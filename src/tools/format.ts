export function getUnit(unit = '￥', value = 0) {
  return `${unit}${!value ? (0).toFixed(4) : value.toFixed(4)}`;
}

export function getDate(value) {
  return /T/.test(value) ? value.replace('T', ' ') : value;
}
