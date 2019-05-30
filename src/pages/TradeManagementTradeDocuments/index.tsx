import Page from '@/containers/Page';
import React, { PureComponent } from 'react';
import SettlementAdvice from './SettlementAdvice';
import TradeConfirmation from './TradeConfirmation';
import TabHeader from '@/containers/TabHeader';

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
        <Page
          title="交易文档"
          footer={
            <TabHeader
              activeKey={this.state.activeTabKey}
              onChange={this.onTabChange}
              tabList={[
                { key: 'tradeConfirmation', tab: '交易确认书' },
                { key: 'settlementAdvice', tab: '结算通知书' },
              ]}
            />
          }
        >
          {this.state.activeTabKey === 'tradeConfirmation' && <TradeConfirmation />}
          {this.state.activeTabKey === 'settlementAdvice' && <SettlementAdvice />}
        </Page>
      </>
    );
  }
}

export default TradeManagementTradeDocuments;
