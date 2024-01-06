---
title: How to make tests faster with Jest and Sequelize transactions
datePosted: '2024-01-05T00:00:00.000Z'
---

At Wreno, we use [Jest](https://jestjs.io/) to run our tests. We also use [Sequelize](https://sequelize.org/) as our ORM. As we built our backend, we added tests for each new endpoint we built, to ensure that we could quickly iterate and prototype without worrying about breaking existing endpoints.

## The problem

As our app got larger and larger, we noticed that the tests were getting slower at an alarming rate. We had a lot of tests that used the database, and we noticed that they were taking a long time to run.

The problem boiled down to two key things:

1. **Dropping and recreate database after each test** - We needed to wipe the database after each test. We did this by running `await sequelize.sync({ force: true })` after each test. This is very slow because it has to drop all the tables and then run the sync command again (which re-creates all tables), which can be slow if you have a lot of models.
2. **Single threaded** - Jest runs tests in parallel by default, but we had to modify that setting by enabling `--runInBand` to force them to run in a single thread. This was because we were using a single database in our tests, and we needed to ensure that the database was cleaned up before the next test ran. Obviously, this means that we can't run tests in parallel, which is a huge bottleneck.

## Leveraging parallelization to speed up tests

After we identified that not running the tests in parallel was the main bottleneck, we decided to try and see if we could improve this.

To run them in parallel, we needed to do the following:

1. **Spin up multiple test databases** - We needed to spin up multiple test databases to run tests against. This allows us to run multiple tests in parallel and not have to wait for the database to be cleaned up after each test.

   Thankfully, we were already using docker-compose to spin up our test database, so this was pretty easy to do. We just had to add a few more databases to the docker-compose file.

   ```yaml
   # docker-compose.yml

   services:
     testdb-1:
       image: postgres
       restart: always
       ports:
         - 5433:5432

     testdb-2:
       image: postgres
       restart: always
       ports:
         - 5434:5432
   #
   #...and so on as ports and test number increments
   ```

2. **Update Jest to load the correct database depending on its current thread number** - We needed to update Jest to load the correct database depending on its current thread number. This allows us to run tests more tests in parallel, and not have to wait as long for the database to be cleaned up after each test.

   We did this by updating the code which initializes the database connection to load the correct database depending on the current thread number, for example:

   ```js
   if (isTesting) {
       dbConfig = {
           ...commonDBConfig,
           // JEST_WORKER_ID will return the current thread number
           // (1-4 in this case)
           port: 5432 + parseInt(process.env.JEST_WORKER_ID!),
           database: "wreno_test_db",
       };
   }
   ```

   We also had to update our `jest.config.js` file to add the following:

   ```json
   {
     // ...other config
     // this number should be the same as the number of
     // test databases you have defined in docker-compose.yml
     "maxWorkers": 4
   }
   ```

This was idea was inspired by [this article](https://blog.mikevosseller.com/2021/11/25/how-to-run-jest-with-multiple-test-databases.html) which goes into more detail about how to do this. It also summarizes the benefits of testing against a real database over a mocked database.

## Leveraging Postgres transactions to speed them up even more

We also knew that running a database sync after each test was slow, so we decided to try and clear the database after each test another way.

After lots of research, I found that the most common and recommended way to do this was to use [Sequelize Transactions](https://sequelize.org/master/manual/transactions.html). The way this works is that you create a transaction before each test, and then you pass that transaction to each query you run in the test. Then, after the test is done, you roll back the transaction, which undoes any changes made to the database during the test.

This sounds easy on paper, but it was actually pretty hard to implement. To do this, we have to monkey patch Sequelize to allow us to pass in the transaction via context and mocking the CLS package. **This requires extra testing when bumping the sequelize package**.

Here's the code we ended up with.

First, we created a file which can enable and disable the transaction mocking:

```js
// tests/utils/db/transactions.ts

const cls = new Map();
Object.defineProperty(cls, "run", {
  value: (fn: (...args: unknown[]) => void) => {
    fn(this);
    return this;
  },
});

/**
 * Function to enable mocking of transactions.
 * This leverages the cls-hooked library to mock transactions.
 */
export const enableTransactionMocking = (txn: Transaction) => {
  // @ts-expect-error this is mocking an internal sequelize property
  sequelize.constructor["_cls"] = cls;
  // @ts-expect-error this is mocking an internal sequelize property
  sequelize.constructor["_cls"].set("transaction", txn);
};

/**
 * Function to disable mocking of transactions.
 * This reverts our changes we made in `enableTransactionMocking` function and clears the database
 * of any data that may exist.
 *
 * This should be called before each test that you can't use transactions for.
 *
 * Try not to call this.
 */
export const disableTransactionMocking = async () => {
  await syncDatabase({ force: true });
  // @ts-expect-error this is mocking an internal sequelize property
  sequelize.constructor["_cls"] = undefined;
};

```

Then, in the global setup file `setupFilesAfterEnv.ts`, we added the following:

```js
// tests/utils/setupFilesAfterEnv.ts

/**
 * Use sequelize transaction for each test.
 * This will ensure that each test is isolated from each other.
 * This will also ensure that each test is rolled back after each test.
 */
let txn: Transaction;
beforeEach(async () => {
  txn = await sequelize.transaction({
    autocommit: false,
  });
  enableTransactionMocking(txn);
});

afterEach(async () => {
  await txn.rollback();
});
```

There were a few tests that we couldn't use transactions for, so we had to disable the mocking for those tests. We did this by adding the following to the test file:

```js
// tests/*.test.ts
/**
 * This is a workaround for the fact
 * that we can't mock transactions for raw queries.
 */
beforeEach(async () => {
  await disableTransactionMocking();
});
```

This solution, while not perfect, allowed us to speed up our tests by a huge amount. We were able to run tests in parallel, and we were able to remove the need to drop and recreate the database after each test.

This solution was inspired by the following articles:

- [Sequelize Docs](https://sequelize.org/docs/v6/other-topics/transactions/#automatically-pass-transactions-to-all-queries) - See "Managed Transactions" and "Automatically pass transactions to all queries"
- [This Blog Post](https://ericyd.hashnode.dev/write-clean-database-tests-with-jest) - Primary inspiration for the current implementation, also provides alternatives.
- [Sequelize GitHub Issue](https://github.com/sequelize/sequelize/issues/11408#issuecomment-1102321495)

## Conclusion

After implementing these changes, we saw a huge improvement in the speed of our tests.

Local Computer Stats:

| Feature                           | Before    | After       |
| --------------------------------- | --------- | ----------- |
| Parallelization (no transactions) | 5 minutes | 3 minutes   |
| Transactions (no parallelization) | 5 minutes | 2.5 minutes |
| Both                              | 5 minutes | 1 minute    |

These changes can also be applied to a CI environment, where they will be even more noticeable and allow your team to move even more quickly.

One callout when combining these two solutions is that you may want to modify the `maxWorkers` setting in your `jest.config.js` file and see what works best for your team. We found that 4 workers was the sweet spot for us, but you may find that a different number works better for you.

I hope you found this article useful. If you have any questions or comments, feel free to reach out to me!
