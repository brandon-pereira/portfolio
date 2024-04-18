---
title: Keeping your Javascript dependencies up to date
datePosted: '2024-02-24T00:00:00.000Z'
---

Today I will be going over what I believe is an essential task for maintaining a Javascript repository. That task is keeping your dependencies up to date.

**Javascript moves fast.**s

Every day there are new versions of packages being released.

By keeping your dependencies up to date, you ensure that:

- you are using the latest and greatest features and bug fixes.
- you are not exposing your project to security vulnerabilities.
- your organization is attracting developers who want to work with the latest technologies.

However, updating dependencies can be a pain. It can be time consuming and sometimes even break your code. Assuming you have a good test suite, the risk of breaking your code is significantly lessened.

To automate the process of updating dependencies, I recommend using [ncu](https://www.npmjs.com/package/npm-check-updates). This is a command line tool that will check for updates to your dependencies and update your `package.json` file.

To install `ncu`, run the following command:

```bash
npm install -g npm-check-updates
```

To check for updates, run the following command:

```bash
ncu -u
npm install
```

This will list out all of the dependencies that have updates available. For example:

```bash
 @astrojs/check         ^0.5.4  →  ^0.5.10
 astro                  ^4.4.0  →   ^4.6.3
 postcss               ^8.4.35  →  ^8.4.38
 postcss-custom-media  ^10.0.2  →  ^10.0.4
 postcss-nesting       ^12.0.2  →  ^12.1.1
```

Here you can see I have a few updates available. Assuming these dependencies follow [semver](https://semver.org/), we know we can safely upgrade these packages. It's always a good idea to also check the following:

1. **Changelog**
2. **Run Typescript Checks**
3. **Run all tests**
4. **Perform manual tests**

It's also a good idea to have a rollback strategy incase you find issues. I typically try and upgrade each large package in a separate pull request so that I can rollback those commits independently for problematic packages.

## The inevitable breaking changes

Sometimes, you will find that a package has breaking changes. This can be a pain, but there are two strategies you can use to mitigate this:

1. **Update your code to work with the new version.** - This is obviously easier said than done, but it's the best way to ensure you are using the latest and greatest features.
2. **Lock the version of the package.** - If you are unable to update your code to work with the new version, you can lock the version of the package in your `package.json` file. You'll also need to add an `ncurc.json` [config file](https://github.com/raineorshine/npm-check-updates?tab=readme-ov-file#config-file) to your project with a `reject` option to prevent `ncu` from updating the package.

Be sure to also check for migration guides, codemods, or other tools that can help you update your code to work with the new version.

## Conclusion

Keeping your dependencies up to date is an essential task for maintaining a Javascript repository. It ensures that you are using the latest and greatest features and bug fixes, and that you are not exposing your project to security vulnerabilities.

I hope that this post has been helpful, and that you will now be more proactive in keeping your dependencies up to date.

It doesn't need to be a painful process, and the benefits are well worth it!
