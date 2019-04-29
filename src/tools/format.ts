// export function getUnit(unit = '￥', value=0) {
//     let formatter;
//     let parser;
//     const options = undefined;
//     if (unit === '$' || unit === '¥') {
//         return .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
//         // formatter = () => `${unit}${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
//         // parser = () => (value != null ? value : '').replace(new RegExp(`${unit}\s?|(,*)`, 'g'), '');
//     } else {
//         formatter = () => {
//             return `${value}${unit}`;
//         };
//         parser = () => value.replace(unit, '');
//     }
//     console.log(formatter, options, parser, value)
//     return value;
// };

export function getUnit(unit = '￥', value = 0) {
  return `${unit}${!value ? (0).toFixed(4) : value.toFixed(4)}`;
}

export function getDate(value) {
  return /T/.test(value) ? value.replace('T', ' ') : value;
}
