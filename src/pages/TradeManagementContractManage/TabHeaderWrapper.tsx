import TabHeader from '@/containers/TabHeader';
import { connect } from 'dva';
import React, { memo } from 'react';

const TabHeaderWrapper = props => {
  const { dispatch, activeTabKey } = props;
  const tabList = [
    { key: 'contractManagement', tab: '合约管理' },
    { key: 'open', tab: '当日开仓' },
    { key: 'unwind', tab: '当日平仓' },
    { key: 'expiration', tab: '当日到期' },
    { key: 'overlate', tab: '已过期' },
  ];
  const handleTabChange = key => {
    dispatch({
      type: 'tradeManagementContractManage/onTabChange',
      payload: { key },
    });
  };

  return <TabHeader activeKey={activeTabKey} onChange={handleTabChange} tabList={tabList} />;
};

export default memo<any>(
  connect(state => {
    return {
      activeTabKey: state.tradeManagementContractManage.activeTabKey,
    };
  })(TabHeaderWrapper)
);
