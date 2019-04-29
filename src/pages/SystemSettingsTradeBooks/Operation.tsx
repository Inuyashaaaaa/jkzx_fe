import PopconfirmButton from '@/components/PopconfirmButton';
import { deleteNonGroupResource } from '@/services/tradeBooks';
import { message } from 'antd';
import React, { PureComponent } from 'react';

class Operation extends PureComponent<{ record: any; fetchTable: any }> {
  public state = {
    loading: false,
    visible: false,
  };

  public onRemove = async () => {
    this.setState({
      loading: true,
    });
    const { error, data } = await deleteNonGroupResource({
      resourceType: this.props.record.resourceType,
      resourceName: this.props.record.resourceName,
    });
    this.setState({ loading: false });
    if (error) {
      message.error('删除失败');
      return;
    }
    message.success('删除成功');
    this.props.fetchTable();
  };

  public render() {
    return (
      <PopconfirmButton
        type="danger"
        size="small"
        loading={this.state.loading}
        popconfirmProps={{
          title: '确认要删除该交易簿？',
          onConfirm: this.onRemove,
        }}
      >
        删除
      </PopconfirmButton>
    );
  }
}

export default Operation;
