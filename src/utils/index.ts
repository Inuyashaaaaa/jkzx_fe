export const convertOptions = (maps, zhcn) => {
  return Object.keys(maps).map(key => ({
    label: zhcn[key],
    value: maps[key],
  }));
};
