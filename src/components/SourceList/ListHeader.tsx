import { Col, Row } from 'antd';
import React, { PureComponent } from 'react';
import { ListHeaderProps } from './types';

class ListHeader extends PureComponent<ListHeaderProps> {
  public render() {
    const { title } = this.props;
    return (
      <Row type="flex" justify="space-between" align="middle">
        <Col>{title}</Col>
        <Col />
      </Row>
    );
  }
}

export default ListHeader;
