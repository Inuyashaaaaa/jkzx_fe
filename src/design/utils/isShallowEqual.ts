export function isShallowEqual(object, other, ignore?: (val: any, key: string) => boolean) {
  if (typeof object !== 'object' || typeof other !== 'object') {
    return object === other;
  }

  if (Object.keys(object).length !== Object.keys(other).length) {
    return false;
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const key in object) {
    if (ignore && ignore(object[key], key)) continue;
    if (object[key] !== other[key]) {
      return false;
    }
  }
  return true;
}
