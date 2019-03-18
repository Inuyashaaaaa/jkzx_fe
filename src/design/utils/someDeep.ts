export function someDeep(arr, cb, fieldName = 'children') {
  return arr.some(item => {
    if (item[fieldName]) {
      return someDeep(item[fieldName], cb, fieldName);
    }
    return cb(item);
  });
}
