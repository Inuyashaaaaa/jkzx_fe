import React, { PureComponent } from 'react';

class ClassBaseRow extends PureComponent {
  public render() {
    return <tr {...this.props} />;
  }
}

export default ClassBaseRow;
