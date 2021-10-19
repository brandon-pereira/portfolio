// https://gist.github.com/beaucharman/e46b8e4d03ef30480d7f4db5a78498ca
export default function throttle(
  callback: () => void,
  wait: number,
  context = this
): () => void {
  let timeout = null;
  let callbackArgs = null;

  const later = () => {
    callback.apply(context, callbackArgs);
    timeout = null;
  };

  return function (...args) {
    if (!timeout) {
      callbackArgs = args;
      timeout = setTimeout(later, wait);
    }
  };
}
