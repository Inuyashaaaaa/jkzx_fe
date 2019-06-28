import React, { PureComponent, memo } from 'react';

const HeaderCell = memo(props => {
  return <th {...props} />;
});

export default HeaderCell;
