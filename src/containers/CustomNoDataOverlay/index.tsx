import { Empty } from 'antd';
import React, { PureComponent } from 'react';

class CustomNoDataOverlay extends PureComponent {
  public render() {
    return (
      <Empty
        description={this.props.frameworkComponentWrapper.agGridReact.props.context.description}
      />
    );
  }
}

export default CustomNoDataOverlay;
