import React, { memo, useState } from 'react';
import Page from '@/containers/Page';
import TabHeader from '@/containers/TabHeader';
import TradingTemplate from './TradingTemplate';
import CustomerTemplate from './CustomerTemplate';

const ClientManagementDocument = memo(props => {
  const [activeKey, setActiveKey] = useState('trade');
  const changeTab = tab => {
    setActiveKey(tab);
  };

  return (
    <Page
      footer={
        <TabHeader
          activeKey={activeKey}
          onChange={changeTab}
          tabList={[{ key: 'trade', tab: '交易模板' }, { key: 'customer', tab: '客户模板' }]}
        />
      }
    >
      {activeKey === 'trade' && <TradingTemplate />}
      {activeKey === 'customer' && <CustomerTemplate />}
    </Page>
  );
});

export default ClientManagementDocument;

// Fifth1314