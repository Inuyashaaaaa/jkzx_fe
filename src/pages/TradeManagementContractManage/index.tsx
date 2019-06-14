import Page from '@/containers/Page';
import { Button } from 'antd';
import { connect } from 'dva';
import React, { memo, useEffect, useState } from 'react';
import CommonModel from './containers/CommonModel';
import Settlement from './Settlement';
import TabHeaderWrapper from './TabHeaderWrapper';

const TradeManagementContractManage = props => {
  const { activeTabKey } = props.tradeManagementContractManage;
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const { preRouting, dispatch } = props;
    if (preRouting && preRouting.pathname !== '/trade-management/book-edit') {
      dispatch({
        type: 'tradeManagementContractManage/initKey',
        payload: 'contractManagement',
      });
    }
  }, []);

  return (
    <Page
      title="合约管理"
      footer={<TabHeaderWrapper />}
      extra={[
        <Button
          type="primary"
          key="1"
          onClick={() => {
            setModalVisible(true);
          }}
        >
          批量结算
        </Button>,
      ]}
    >
      {activeTabKey === 'contractManagement' && <CommonModel name="contractManagement" />}
      {activeTabKey === 'open' && <CommonModel status="OPEN_TODAY" name="open" />}
      {activeTabKey === 'unwind' && <CommonModel status="UNWIND_TODAY" name="unwind" />}
      {activeTabKey === 'expiration' && <CommonModel status="EXPIRATION_TODAY" name="expiration" />}
      {activeTabKey === 'overlate' && <CommonModel status="EXPIRATION" name="overlate" />}
      <Settlement modalVisible={modalVisible} setModalVisible={setModalVisible} />
    </Page>
  );
};

export default memo<any>(
  connect(state => {
    return {
      tradeManagementContractManage: state.tradeManagementContractManage,
      preRouting: state.preRouting.location,
    };
  })(TradeManagementContractManage)
);
