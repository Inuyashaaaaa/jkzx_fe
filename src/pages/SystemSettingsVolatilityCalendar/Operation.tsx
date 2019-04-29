import PopconfirmButton from '@/components/PopconfirmButton';
import { deleteVolSpecialDates } from '@/services/volatility';
import { Button, notification } from 'antd';
import React, { PureComponent } from 'react';

class Operation extends PureComponent<{
  record: any;
  fetchTable: any;
  showModal: any;
}> {
  public state = {
    loading: false,
  };

  public onRemove = async () => {
    this.setState({ loading: true });
    const rowData = this.props.record;
    const { error, data } = deleteVolSpecialDates({
      specialDateUUIDs: [rowData.uuid],
    });
    this.setState({ loading: false });
    if (error) return;
    notification.success({
      message: '删除成功',
    });
    this.props.fetchTable();
  };

  public render() {
    return (
      <>
        <PopconfirmButton
          type="danger"
          size="small"
          loading={this.state.loading}
          popconfirmProps={{
            title: '确定要删除吗?',
            onConfirm: this.onRemove,
          }}
        >
          删除
        </PopconfirmButton>
        <Button
          key="edit"
          type="primary"
          size="small"
          onClick={() => this.props.showModal('modify', this.props.record)}
        >
          编辑
        </Button>
      </>
    );
  }
}

export default Operation;
