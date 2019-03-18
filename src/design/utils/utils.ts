export const remove = (array: any[], index: number | ((item: any) => boolean)): any[] => {
  if (!Array.isArray(array)) {
    return array;
  }
  if (typeof index === 'function') {
    index = array.findIndex(index);
  }
  const clone = [...array];
  clone.splice(index, 1);
  return clone;
};

export const insert = (
  array: any[],
  index: number | ((item: any) => boolean),
  data: any
): any[] => {
  if (!Array.isArray(array)) {
    return array;
  }
  if (typeof index === 'function') {
    index = array.findIndex(index);
  }
  const clone = [...array];
  clone.splice(index, 1, data);
  return clone;
};
