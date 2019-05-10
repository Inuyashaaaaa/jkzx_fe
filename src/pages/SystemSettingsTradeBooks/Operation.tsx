import PopconfirmButton from '@/components/PopconfirmButton';
import { deleteNonGroupResource } from '@/services/tradeBooks';
import { message } from 'antd';
import React, { PureComponent } from 'react';
import { trdTradeListByBook } from '@/services/general-service';

class Operation extends PureComponent<{ record: any; fetchTable: any }> {
  public state = {
    loading: false,
    visible: false,
  };

  public onRemove = async () => {
    this.setState({
      loading: true,
    });
    const trdTradeListByBookRsp = await trdTradeListByBook({
      bookName: this.props.record.resourceName,
    });
    if (trdTradeListByBookRsp.error) {
      return;
    }
    if (trdTradeListByBookRsp.data.length) {
      this.setState({ loading: false });
      message.error('该交易簿下已存在交易，不允许删除');
      this.props.fetchTable();
      return;
    }
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
