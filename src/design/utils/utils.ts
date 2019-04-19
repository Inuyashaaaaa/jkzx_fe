export const remove = (
  array: any[],
  index: number | ((item: any, index: number) => boolean)
): any[] => {
  if (!Array.isArray(array)) {
    return array;
  }
  if (typeof index === 'function') {
    index = array.findIndex(index);
    if (index === -1) return array;
  }
  const clone = [...array];
  clone.splice(index, 1);
  return clone;
};

export const insert = (
  array: any[],
  index: number | ((item: any, index: number) => boolean),
  data: any
): any[] => {
  if (!Array.isArray(array)) {
    return array;
  }
  if (typeof index === 'function') {
    index = array.findIndex(index);
    if (index === -1) return array;
  }
  const clone = [...array];
  clone.splice(index, 0, data);
  return clone;
};
