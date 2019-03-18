import React, { PureComponent } from 'react';

class GeneralRow extends PureComponent {
  render() {
    const { vertical, ...restProps } = this.props;
    console.log('render GeneralRow');
    return <tr {...restProps} />;
  }
}

const GeneralCell = ({ vertical, ...restProps }) => {
  console.log('render GeneralCell');
  return <td {...restProps} />;
};

export { GeneralRow, GeneralCell };
