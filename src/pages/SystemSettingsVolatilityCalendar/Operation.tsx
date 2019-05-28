import PopconfirmButton from '@/containers/PopconfirmButton';
import { deleteVolSpecialDates } from '@/services/volatility';
import { Divider, notification, Popconfirm } from 'antd';
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
        <Popconfirm title="确定要删除吗?" onConfirm={this.onRemove}>
          <a style={{ color: 'red' }}>删除</a>
        </Popconfirm>
        <Divider type="vertical" />
        <a onClick={() => this.props.showModal('modify', this.props.record)}>编辑</a>
      </>
    );
  }
}

export default Operation;
