import { allLeg } from '@/containers/_MultiLegs/constants/legTypes';
import { arrayOf, func, oneOf, shape, string } from 'prop-types';

export const MultiLegs = {
  dataSource: arrayOf(
    shape({
      type: oneOf(allLeg.map(leg => leg.type)).isRequired,
    })
  ),
  legs: arrayOf(
    shape({
      name: string,
      type: string,
      columns: arrayOf(
        shape({
          title: string,
          dataIndex: string.isRequired,
        })
      ),
    })
  ),
  editings: func,
};
