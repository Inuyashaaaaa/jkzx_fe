import React, { PureComponent } from 'react';

class GeneralRow extends PureComponent {
  render() {
    const { vertical, ...restProps } = this.props;

    return <tr {...restProps} />;
  }
}

const GeneralCell = ({ vertical, ...restProps }) => {
  return <td {...restProps} />;
};

export { GeneralRow, GeneralCell };
