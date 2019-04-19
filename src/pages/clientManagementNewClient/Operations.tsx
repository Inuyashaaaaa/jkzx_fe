import PopconfirmButton from '@/components/PopconfirmButton';
import {
  clientAccountDel,
  clientAccountSearch,
  createRefParty,
  refSalesGetByLegalName,
  refSimilarLegalNameList,
} from '@/services/reference-data-service';
import { Button, Col, notification, Row } from 'antd';
import produce from 'immer';
import React, { PureComponent } from 'react';

class Operations extends PureComponent<{
  record?: any;
  handleRemove?: any;
}> {
  public onRemove = async () => {
    const { error, data } = await clientAccountDel({ accountId: this.props.record.data.accountId });
    if (error) return;
    this.props.handleRemove(this.props.record.rowIndex);
  };

  public render() {
    return (
      <>
        <Row type="flex" justify="start">
          <Col>
            <Button key="search" type="primary" size="small">
              查看
            </Button>
          </Col>
          <Col>
            <Button key="edit" type="primary" size="small">
              编辑
            </Button>
          </Col>
          <Col>
            <PopconfirmButton
              type="primary"
              size="small"
              popconfirmProps={{
                title: '确定要删除吗?',
                onConfirm: this.onRemove,
              }}
            >
              删除
            </PopconfirmButton>
          </Col>
        </Row>
      </>
    );
  }
}

export default Operations;
