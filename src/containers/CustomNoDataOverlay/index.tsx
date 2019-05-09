import { Empty } from 'antd';
import React, { PureComponent } from 'react';

class CustomNoDataOverlay extends PureComponent {
  public render() {
    return <Empty description={'查询日期内无报告'} />;
  }
}

export default CustomNoDataOverlay;
