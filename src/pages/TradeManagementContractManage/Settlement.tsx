import { LEG_FIELD } from '@/constants/common';
import { SmartTable, InputNumber } from '@/containers';
import { Modal } from 'antd';
import _ from 'lodash';
import React, { memo, useState } from 'react';
import FormItem from 'antd/lib/form/FormItem';

const Settlement = memo<any>(props => {
  const { modalVisible, setModalVisible } = props;
  const [tableData, setTableData] = useState([]);

  return (
    <Modal
      title="批量结算"
      width={1500}
      visible={modalVisible}
      onCancel={() => {
        setModalVisible(false);
      }}
    >
      <SmartTable
        rowKey="id"
        dataSource={tableData}
        rowSelection={{}}
        scroll={_.isEmpty(tableData) ? { x: 2000 } : null}
        columns={[
          {
            title: '交易簿',
            dataIndex: LEG_FIELD.BOOK_NAME,
          },
          {
            title: '交易ID',
            dataIndex: LEG_FIELD.TRADE_ID,
          },
          {
            title: '交易日',
            dataIndex: LEG_FIELD.TRADE_DATE,
          },
          {
            title: '买/卖',
            dataIndex: LEG_FIELD.DIRECTION,
          },
          {
            title: '涨/跌',
            dataIndex: LEG_FIELD.OPTION_TYPE,
          },
          {
            title: '期权类型',
            dataIndex: LEG_FIELD.PRODUCT_TYPE,
          },
          {
            title: '行权价',
            align: 'right',
            dataIndex: LEG_FIELD.STRIKE,
          },
          {
            title: '标的物',
            fixed: 'right',
            width: 150,
            dataIndex: LEG_FIELD.UNDERLYER_INSTRUMENT_ID,
          },
          {
            title: '结算方式',
            fixed: 'right',
            width: 150,
            dataIndex: LEG_FIELD.SPECIFIED_PRICE,
          },
          {
            title: '标的物结算价格',
            fixed: 'right',
            align: 'right',
            width: 150,
            dataIndex: LEG_FIELD.UNDERLYER_INSTRUMENT_PRICE,
            render: (val, record, index, { form }) => {
              return (
                <FormItem>{form.getFieldDecorator()(<InputNumber editing={true} />)}</FormItem>
              );
            },
          },
          {
            title: '结算金额',
            fixed: 'right',
            align: 'right',
            width: 150,
            dataIndex: LEG_FIELD.SETTLE_AMOUNT,
            render: (val, record, index, { form }) => {
              return (
                <FormItem>{form.getFieldDecorator()(<InputNumber editing={true} />)}</FormItem>
              );
            },
          },
          {
            title: '结算状态',
            fixed: 'right',
            width: 150,
            dataIndex: LEG_FIELD.SETTLE_STATUS,
          },
        ]}
      />
    </Modal>
  );
});

export default Settlement;
