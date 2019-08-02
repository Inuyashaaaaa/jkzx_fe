import numeral from 'numeral';

const formatNumber = ({ value, formatter }) => {
  if (value == null) return '';
  return numeral(value).format(formatter);
};

export default formatNumber;
