import { array, bool, element, func, object, oneOfType } from 'prop-types';

export const MultiLeg = {
  createble: bool,
  onCreate: func,
  // dataSource: arrayOf(
  //   shape({
  //     types: array,
  //     title: string,
  //     data: object,
  //   })
  // ),
  dataSource: array,
  formItems: array,
  formData: object,
  onFormChange: func,
  onLegChange: func,
  rowMenu: oneOfType([func, element, bool]),
  extraRowMenuItems: oneOfType([func, element]),
  legs: array,
  extraLeg: oneOfType([array, object]),
};

// // @todo
// const news = {
//   createble: bool,
//   onCreate: func,

//   legs: array,
// };
