// https://gist.github.com/beaucharman/1f93fdd7c72860736643d1ab274fee1a
export default function debounce(
  callback: () => void,
  wait: number,
  context = this
): () => void {
  let timeout: NodeJS.Timeout = null;
  let callbackArgs: unknown[] = null;

  const later = () => callback.apply(context, callbackArgs);

  return function (...args) {
    callbackArgs = args;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
