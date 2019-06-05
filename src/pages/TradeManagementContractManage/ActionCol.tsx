import PopconfirmButton from '@/containers/PopconfirmButton';
import { trdTradePortfolioDelete } from '@/services/trade-service';
import { message } from 'antd';
import _ from 'lodash';
import React, { PureComponent } from 'react';

class ActionCol extends PureComponent<any> {
  constructor(props) {
    super(props);
  }

  public onRemove = async () => {
    const { params, rowData } = this.props;
    const { error, data } = await trdTradePortfolioDelete({
      tradeId: rowData.tradeId,
      portfolioName: params.portfolio,
    });
    if (error) return;
    message.success('移除成功');
    this.props.onRemove(params);
  };

  public render() {
    return (
      <PopconfirmButton
        type="danger"
        size="small"
        popconfirmProps={{
          title: '确定要将合约移出该投资组合吗?',
          onConfirm: this.onRemove,
        }}
      >
        移除关联
      </PopconfirmButton>
    );
  }
}

export default ActionCol;
