export const showTotal = (total, range = [0, 0]) =>
  `${range[0]}-${isNaN(range[1]) ? 0 : range[1]} 共 ${total} 项`;
