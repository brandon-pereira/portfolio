---
title: How to speed up linting locally and in CI
datePosted: '2023-12-31T00:00:00.000Z'
---

Today, I will be showing you how to speed up your linting locally and in your continuous integration pipeline (CI). This should help save you time and make your development process more enjoyable.

For linting, we run the following:

1. [ESLint](https://eslint.org/) - To lint our code
2. [Typescript](https://www.typescriptlang.org/) - To type check our code
3. [Prettier](https://prettier.io/) - To format our code

Our code is stored in a monorepo, so we have a lot of code to lint. I was noticing that as the repo grew, linting was taking longer and longer. I decided to see if I could speed it up.

## Enabling ESLint's Cache Feature

We have a lot of linting rules, and we noticed that linting was taking a long time to run. We decided to use [ESLint's cache](https://eslint.org/docs/user-guide/command-line-interface#--cache) to speed it up.

We updated our `lint` command to use the cache:

```json
{
  "scripts": {
    "lint": "eslint --cache . && tsc --noEmit"
  }
}
```

This will cache the results of the linting, and only lint the files that have changed since the last run. As a result, the first time you run this, it will take a while to run. However, subsequent runs will be much faster.

## Enabling Typescript Incremental Builds

We use [Typescript](https://www.typescriptlang.org/) to typecheck our code. We noticed that it was taking a long time to run, so we decided to use [Typescript's incremental builds](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#faster-subsequent-builds-with-incremental).

By enabling this in our `tsconfig.json` file, we were able to speed up our builds by a lot.

```json
{
  "compilerOptions": {
    "incremental": true
  }
}
```

Similarly to ESLint, the first time you run this, it will take a while to run, but subsequent runs will be much faster. This is because Typescript will cache the results of the typechecking, and only type check the files that have changed since the last run.

## Adding caching to our CI pipeline

We leveraged GitHub actions, so your mileage may vary, but we were able to speed up our CI pipeline by caching the `node_modules` folder, the ESLint Cache, and the Typescript Cache.

1. **Cache the node_modules folder** - This one comes for free if you are using the [actions/setup-node](https://github.com/actions/setup-node) action. It will cache the `node_modules` folder for you automatically if you use the `cache` flag in your workflow.

   ```yaml
   - uses: actions/setup-node@v4
   with:
       node-version: 20
       cache: 'yarn'
   ```

   This won't directly speed up your linting, but it will speed up your CI pipeline by a lot.

2. **Output cache manifests for ESLint and Typescript** - We need to update our `lint` command to output the results of ESLint and Typescript to a cacheable location. We do this by using the `--cache-location` in flag ESLint and the `--tsBuildInfoFile` flag in Typescript.

   ```json
   {
     "scripts": {
       "lint:ci": "eslint . --cache --cache-strategy content --cache-location ~/.cache/eslint && tsc --noEmit --tsBuildInfoFile ~/.cache/tsc"
     }
   }
   ```

   **A couple notes:**

   1. We use the `--cache-location` flag to specify where we want to store the cache. We use the `~/.cache` folder in this example, but you can use any folder you want.
   2. We use the `--cache-strategy content` flag to tell ESLint to use the content of the file, not the last modified date. We do this because when cloning the repo, the last modified date will be different, but the content will be the same.
   3. We made a new `lint:ci` script because we don't need to use the `content` cache strategy locally. This is optional, but it felt cleaner to me.

3. **Re-use cache manifests across runs** - we also need to update our workflow to reuse the cache between runs. We do this by using the [actions/cache](https://github.com/actions/cache) action.

   ```yaml
   - name: Setup Linting Cache
     uses: actions/cache@v3
     with:
       path: |
         ~/.cache/eslint/
         ~/.cache/tsc/
       key: ${{ runner.os }}-node-${{ hashFiles('**/yarn.lock', '**/.eslintrc.js', '**/tsconfig.json) }}
   ```

   A couple notes on this one:

   1. We use the `path` flag to specify which folders we want to cache. You could do the whole `cache` folder if you wanted, but in my case other things were changing in there, so I wanted to be more specific.
   2. We use the `key` flag to specify the key for the cache. We use the `hashFiles` function to hash files that should result in a full re-test of all files. This way, if any of those files change, the cache will be invalidated. This is important because if you change your linting rules, you want to make sure that the cache is invalidated, so that the new rules are used.

## Conclusion

Hopefully, this will help you speed up your linting locally and in your CI pipeline. Feel free to mess around with these various changes and see if you can get even more performance gains.

For our team, we saw the following performance gains after implementing these changes:

| Action          | Before | After |
| --------------- | ------ | ----- |
| Linting Locally | 1m     | 10s   |
| Linting in CI   | 10m    | 3m    |

## Inspiration

- https://enochchau.com/blog/2022/eslint-cache-ci/
- https://eslint.org/docs/latest/use/command-line-interface#--cache
- https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#faster-subsequent-builds-with-incremental
