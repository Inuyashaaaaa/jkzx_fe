export const getDiffAttrs = (props, next) => {
  const diff = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const key in props) {
    if (props[key] !== next[key]) {
      diff.push(key);
    }
  }
  return diff;
};
