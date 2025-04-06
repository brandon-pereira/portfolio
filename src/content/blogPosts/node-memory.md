---
title: How to Dynamically Set Node.js Heap Limits in Google Cloud Run
datePosted: '2024-12-20T00:00:00.000Z'
---

When running Node.js apps on [Google Cloud Run](https://cloud.google.com/run?hl=en), it's common to encounter memory-related crashes—especially if your app handles large datasets or high traffic. Fortunately, there's a simple way to increase the memory available to the Node.js heap and squeeze more performance out of your allocated RAM.

If you’ve seen this error in your logs, you’re in the right place:

```bash
FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed - JavaScript heap out of memory
```

## Understanding Node's Default Heap Memory Limit

Although there's no official answer for the default heap size, in practice, Node.js typically [uses about 50% of the available memory](https://github.com/nodejs/node/issues/35573#issuecomment-1169927027) as its heap limit.

This behavior means that even if your Cloud Run instance has 8GB of memory, Node.js will only use about 4GB for the heap unless you explicitly increase the limit.

## Increasing the Heap Memory Limit

To override the default, use the [`--max-old-space-size`](https://nodejs.org/api/cli.html#--max-old-space-sizesize-in-mib) flag when starting your Node.js application. This flag tells V8 (Node.js’s underlying JavaScript engine) how much memory to allocate for the "old generation" heap, which stores most of your long-lived objects.

Example:

```bash
export NODE_OPTIONS="--max-old-space-size=8192"
```

This command sets the maximum heap size to 8GB (8192 MB). To calculate this value:

- Take the total memory in gigabytes
- Multiply by 1024 to convert to megabytes
- Set `--max-old-space-size` to that number

For example, if your server has 4GB of RAM:

```bash
4 * 1024 = 4096
```

You would use:

```bash
--max-old-space-size=4096
```

## Doing This in Google Cloud Run

The best way to apply this setting in Google Cloud Run—and have it scale with the instance memory—is to set the flag using the `NODE_OPTIONS` environment variable. This allows you to configure it dynamically per revision.

### Steps

1. Open the relevant Service or Job in Cloud Run
2. Click **Edit & Deploy New Revision**
3. Go to the **Variables & Secrets** tab
4. Click **Add Variable**
5. Set the name to `NODE_OPTIONS`
6. Set the value to something like `--max-old-space-size=8192` (adjust as needed)
7. Click **Deploy**

### Optional: Set It Dynamically in a Script

If you're building a container from scratch and want to calculate memory dynamically, you can read the memory limit from the cgroup and set the flag automatically through your Dockerfile `CMD` or entrypoint script:

```bash
#!/bin/bash
TOTAL_MEM_MB=$(cat /sys/fs/cgroup/memory/memory.limit_in_bytes | awk '{print int($1 / 1024 / 1024)}')
HEAP_LIMIT_MB=$(($TOTAL_MEM_MB * 80 / 100)) # use 80% of available memory
export NODE_OPTIONS="--max-old-space-size=$HEAP_LIMIT_MB"
```

This lets your Node.js app make the most of whatever memory your Cloud Run container is allocated.

## Conclusion

- Node.js uses ~50% of available memory for the heap by default
- Override it with `--max-old-space-size` to use more memory in production
- In Cloud Run, set the flag using the `NODE_OPTIONS` environment variable
- For flexibility, calculate the limit dynamically based on container memory
