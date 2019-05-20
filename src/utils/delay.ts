export function delay<T = any>(timeout, result?) {
  return new Promise<T>((resolve, reject) => {
    try {
      setTimeout(() => {
        resolve(typeof result === 'function' ? result() : result);
      }, timeout);
    } catch {
      reject();
    }
  });
}
