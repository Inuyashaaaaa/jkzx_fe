import React, { useState } from 'react';
import Page from '@/containers/Page';
import OperationLog from './OperationLog';
import ErrorLog from './ErrorLog';
import TabHeader from '@/containers/TabHeader';

const SystemSettingOperationLog = props => {
  const { query } = props.location;
  const [activeTabKey, setActiveTabKey] = useState(query.activeKey || 'operation');

  const onHeaderTabChange = key => {
    setActiveTabKey(key);
  };
  return (
    <Page
      footer={
        <TabHeader
          activeKey={activeTabKey}
          onChange={onHeaderTabChange}
          tabList={[
            {
              key: 'operation',
              tab: '操作日志',
            },
            {
              key: 'error',
              tab: '错误日志',
            },
          ]}
        />
      }
    >
      {activeTabKey === 'operation' && <OperationLog />}
      {activeTabKey === 'error' && <ErrorLog />}
    </Page>
  );
};

export default SystemSettingOperationLog;
