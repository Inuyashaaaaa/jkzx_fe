import PopconfirmButton from '@/components/PopconfirmButton';
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
      portfolioName: params.data.portfolio,
    });
    if (error) return;
    message.success('删除成功');
    this.props.onRemove(params);
  };

  public render() {
    return (
      <PopconfirmButton title="确认删除?" type="danger" size="small" onConfirm={this.onRemove}>
        删除
      </PopconfirmButton>
    );
  }
}

export default ActionCol;
