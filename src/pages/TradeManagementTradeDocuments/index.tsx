import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import React, { PureComponent } from 'react';
import SettlementAdvice from './SettlementAdvice';
import TradeConfirmation from './TradeConfirmation';

class TradeManagementTradeDocuments extends PureComponent {
  public state = {
    activeTabKey: 'tradeConfirmation',
  };

  public componentDidMount = () => {};

  public onTabChange = key => {
    this.setState({
      activeTabKey: key,
    });
  };

  public render() {
    return (
      <>
        <PageHeaderWrapper
          title="交易文档"
          tabList={[
            { key: 'tradeConfirmation', tab: '交易确认书' },
            { key: 'settlementAdvice', tab: '结算通知书' },
          ]}
          tabActiveKey={this.state.activeTabKey}
          onTabChange={this.onTabChange}
        >
          {this.state.activeTabKey === 'tradeConfirmation' && <TradeConfirmation />}
          {this.state.activeTabKey === 'settlementAdvice' && <SettlementAdvice />}
        </PageHeaderWrapper>
      </>
    );
  }
}

export default TradeManagementTradeDocuments;
