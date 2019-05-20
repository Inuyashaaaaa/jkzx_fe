import { INPUT_NUMBER_DIGITAL_CONFIG, LCM_EVENT_TYPE_ZHCN_MAP } from '@/constants/common';
import CashInsertModal from '@/containers/CashInsertModal';
import { Table2 } from '@/components';
import {
  cliTasksGenerateByTradeId,
  cliUnProcessedTradeTaskListByTradeId,
} from '@/services/reference-data-service';
import { Modal } from 'antd';
import React, { memo, useEffect, useState } from 'react';

const TABLE_COL_DEFS = fetchTable => [
  {
    title: '交易对手',
    dataIndex: 'legalName',
  },
  {
    title: '交易编号',
    dataIndex: 'tradeId',
  },
  {
    title: '账户编号',
    dataIndex: 'accountId',
  },
  {
    title: '现金流',
    dataIndex: 'cashFlow',
  },
  {
    title: '期权费',
    dataIndex: 'premium',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    title: '生命周期事件',
    dataIndex: 'lcmEventType',
    render: value => LCM_EVENT_TYPE_ZHCN_MAP[value],
  },
  {
    title: '处理状态',
    dataIndex: 'processStatus',
    render: value => (value === 'PROCESSED' ? '已处理' : '未处理'),
  },
  {
    title: '操作',
    dataIndex: 'action',
    render: (val, record) => {
      return <CashInsertModal record={record} fetchTable={fetchTable} />;
    },
  },
];

const CashExportModal = memo<{
  visible: boolean;
  trade: object;
  convertVisible: any;
  loadData?: any;
}>(props => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(
    () => {
      if (props.visible) {
        searchData();
      }
    },
    [props.visible]
  );

  const searchData = async () => {
    const { error, data } = await cliTasksGenerateByTradeId({
      tradeId: props.trade.tradeId,
      legalName: props.trade.counterPartyCode,
    });

    if (error) return false;
    fetchTable();
  };

  const fetchTable = async () => {
    setLoading(true);
    const { error, data } = await cliUnProcessedTradeTaskListByTradeId({
      tradeId: props.trade.tradeId,
    });
    setLoading(false);
    if (error) return;
    setDataSource(data);
  };

  return (
    <>
      <Modal
        visible={props.visible}
        title="现金流管理"
        width={900}
        style={{ height: '500px' }}
        onCancel={() => {
          props.convertVisible();
          if (props.loadData) {
            props.loadData();
          }
        }}
        footer={false}
      >
        <Table2
          loading={loading}
          pagination={false}
          dataSource={dataSource}
          columns={TABLE_COL_DEFS(fetchTable)}
          rowKey="uuid"
        />
      </Modal>
    </>
  );
});

export default CashExportModal;
