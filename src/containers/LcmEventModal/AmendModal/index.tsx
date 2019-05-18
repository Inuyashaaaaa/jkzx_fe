import { LCM_EVENT_TYPE_MAP, LEG_FIELD, LEG_ID_FIELD } from '@/constants/common';
import { LEG_ENV } from '@/constants/legs';
import MultiLegTable from '@/containers/MultiLegTable';
import { trdTradeLCMEventProcess } from '@/services/trade-service';
import { convertLegDataByEnv, getLegByRecord } from '@/tools';
import { ILegColDef } from '@/types/leg';
import { Modal, message } from 'antd';
import _ from 'lodash';
import React, { memo, useState, useRef } from 'react';
import { convertTradePositions } from '@/services/pages';
import { Form2 } from '@/components';
import { ITableData } from '@/components/type';
import { IMultiLegTableEl } from '@/containers/MultiLegTable/type';
import moment from 'moment';

const UN_EDITDIR = [
  LEG_FIELD.UNDERLYER_MULTIPLIER,
  LEG_FIELD.TERM,
  LEG_FIELD.EFFECTIVE_DATE,
  LEG_FIELD.EXPIRATION_DATE,
  LEG_FIELD.NOTIONAL_AMOUNT_TYPE,
  LEG_FIELD.NOTIONAL_AMOUNT,
  LEG_FIELD.UNIT,
  LEG_FIELD.ALREADY_BARRIER,
];

const DATE_ARRAY = [
  LEG_FIELD.EFFECTIVE_DATE,
  LEG_FIELD.EXPIRATION_DATE,
  LEG_FIELD.SETTLEMENT_DATE,
  LEG_FIELD.DOWN_BARRIER_DATE,
  LEG_FIELD.OBSERVE_START_DAY,
  LEG_FIELD.OBSERVE_END_DAY,
];

export interface IAmendModalEl {
  show: (record, tableFormData, currentUser, reload) => void;
}

export interface IAmendModal {
  current: (node: IAmendModalEl) => void;
}

const AmendModal = memo<IAmendModal>(props => {
  const { current } = props;

  const [visible, setVisible] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [store, setStore] = useState<{
    record?: any;
    tableFormData?: any;
    currentUser?: any;
    reload?: any;
  }>({});
  current({
    show: (record, tableFormData, currentUser, reload) => {
      const newData = _.mapValues(record, (item, key) => {
        if (_.includes(DATE_ARRAY, key)) {
          return {
            type: 'field',
            value: moment(item.value),
          };
        }
        return item;
      });
      setTableData([convertLegDataByEnv(newData, LEG_ENV.BOOKING)]);
      setVisible(true);
      setStore({
        record,
        tableFormData,
        currentUser,
        reload,
      });
    },
  });

  const [confirmLoading, setConfirmLoading] = useState(false);
  const tableEl = useRef<IMultiLegTableEl>(null);

  return (
    <Modal
      okText="保存"
      visible={visible}
      title="修改交易要素"
      onCancel={() => setVisible(false)}
      onOk={async () => {
        setConfirmLoading(true);
        const [position = {}] = convertTradePositions(
          tableData.map(item => Form2.getFieldsValue(item)),
          Form2.getFieldsValue(store.tableFormData),
          LEG_ENV.BOOKING
        );
        const { error } = await trdTradeLCMEventProcess({
          positionId: store.record[LEG_ID_FIELD],
          tradeId: store.tableFormData.tradeId,
          eventType: LCM_EVENT_TYPE_MAP.AMEND,
          userLoginId: store.currentUser.username,
          eventDetail: {
            asset: _.get(position, 'asset'),
            productType: position.productType,
          },
        });
        setConfirmLoading(false);
        if (error) return;

        message.success('修改交易要素成功');
        if (store.reload) {
          store.reload();
        }
      }}
      confirmLoading={confirmLoading}
    >
      <MultiLegTable
        tableEl={tableEl}
        env={LEG_ENV.BOOKING}
        dataSource={tableData}
        onCellFieldsChange={params => {
          const { record } = params;
          const leg = getLegByRecord(record);

          setTableData(pre => {
            const newData = [
              {
                ..._.get(pre, '[0]'),
                ...params.changedFields,
              },
            ];

            if (leg.onDataChange) {
              leg.onDataChange(
                LEG_ENV.EDITING,
                params,
                newData[params.rowIndex],
                newData,
                (colId: string, loading: boolean) => {
                  tableEl.current.setLoadings(params.rowId, colId, loading);
                },
                tableEl.current.setLoadingsByRow,
                (colId: string, newVal: ITableData) => {
                  setTableData(pre =>
                    pre.map(item => {
                      if (item[LEG_ID_FIELD] === params.rowId) {
                        return {
                          ...item,
                          [colId]: newVal,
                        };
                      }
                      return item;
                    })
                  );
                },
                setTableData
              );
            }
            return newData;
          });
        }}
        chainColumns={(columns: ILegColDef[]) => {
          return columns.map(item => {
            return {
              ...item,
              editable(record) {
                if (UN_EDITDIR.find(key => key === item.dataIndex)) return false;

                return typeof item.editable === 'function'
                  ? item.editable.apply(this, arguments)
                  : item.editable;
              },
            };
          });
        }}
      />
    </Modal>
  );
});

export default AmendModal;
