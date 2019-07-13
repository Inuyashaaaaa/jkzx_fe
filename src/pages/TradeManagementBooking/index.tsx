import { Divider, Menu } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import React, { memo, useRef } from 'react';
import useLifecycles from 'react-use/lib/useLifecycles';
import { IFormField } from '@/components/type';
import {
  LEG_FIELD,
  LEG_ID_FIELD,
  LEG_INJECT_FIELDS,
  PREMIUM_TYPE_MAP,
  DATE_ARRAY,
} from '@/constants/common';
import { COMPUTED_LEG_FIELD_MAP } from '@/constants/global';
import { LEG_ENV } from '@/constants/legs';
import { BOOKING_FROM_PRICING } from '@/constants/trade';
import { Form2 } from '@/containers';
import MultiLegTable from '@/containers/MultiLegTable';
import { IMultiLegTableEl } from '@/containers/MultiLegTable/type';
import Page from '@/containers/Page';
import { createLegDataSourceItem } from '@/services/pages';
import { getLegByRecord, insert, remove, uuid, getMoment } from '@/tools';
import ActionBar from './ActionBar';
import './index.less';

const TradeManagementBooking = props => {
  const tableEl = useRef<IMultiLegTableEl>(null);

  const { location, currentUser, tableData: modalTableData, dispatch } = props;
  const { query } = location;
  const { from } = query;
  const getPricingPermium = record =>
    Form2.getFieldValue(record[LEG_FIELD.PREMIUM_TYPE]) === PREMIUM_TYPE_MAP.CNY
      ? record[COMPUTED_LEG_FIELD_MAP.PRICE]
      : record[COMPUTED_LEG_FIELD_MAP.PRICE_PER];

  const tableData = _.map(modalTableData, iitem =>
    _.mapValues(iitem, (item, key) => {
      if (_.includes(DATE_ARRAY, key)) {
        return {
          type: 'field',
          value: getMoment(item.value),
        };
      }
      return item;
    }),
  );

  const setTableData = payload => {
    dispatch({
      type: 'tradeManagementBooking/setTableData',
      payload,
    });
  };

  const onCellFieldsChange = params => {
    const { record } = params;
    const leg = getLegByRecord(record);

    setTableData(pre => {
      const newData = pre.map(item => {
        if (item[LEG_ID_FIELD] === params.rowId) {
          return {
            ...item,
            ...params.changedFields,
          };
        }
        return item;
      });
      if (leg.onDataChange) {
        leg.onDataChange(
          LEG_ENV.BOOKING,
          params,
          newData[params.rowIndex],
          newData,
          (colId: string, loading: boolean) => {
            tableEl.current.setLoadings(params.rowId, colId, loading);
          },
          tableEl.current.setLoadingsByRow,
          (colId: string, newVal: IFormField) => {
            onCellFieldsChange({
              ...params,
              changedFields: {
                [colId]: newVal,
              },
            });
          },
          setTableData,
        );
      }
      return newData;
    });
  };

  useLifecycles(() => {
    if (from === BOOKING_FROM_PRICING) {
      setTableData(pre =>
        (props.pricingData.tableData || []).map(item => {
          const leg = getLegByRecord(item);
          if (!leg) return item;
          const omits = _.difference(
            leg.getColumns(LEG_ENV.PRICING, item).map(items => items.dataIndex),
            leg.getColumns(LEG_ENV.BOOKING, item).map(items => items.dataIndex),
          );

          const pricingPermium = getPricingPermium(item);
          const permium =
            pricingPermium == null ? undefined : Math.abs(Form2.getFieldValue(pricingPermium));

          const leftRecord = _.omit(item, [...omits, ...LEG_INJECT_FIELDS]);

          const next = {
            ...createLegDataSourceItem(leg, LEG_ENV.BOOKING),
            ...leg.getDefaultData(LEG_ENV.BOOKING),
            ...leftRecord,
            [LEG_FIELD.PREMIUM]: Form2.createField(permium),
          };

          const expirationDate = next[LEG_FIELD.EXPIRATION_DATE];
          const expirationDateVal = Form2.getFieldValue(expirationDate);

          return {
            ...next,
            [LEG_FIELD.SETTLEMENT_DATE]: expirationDateVal
              ? expirationDate
              : next[LEG_FIELD.SETTLEMENT_DATE],
          };
        }),
      );
    }
    return modalTableData;
  });

  return (
    <Page>
      <ActionBar
        setTableData={setTableData}
        tableData={tableData}
        tableEl={tableEl}
        currentUser={currentUser}
      />
      <Divider />
      <MultiLegTable
        tableEl={tableEl}
        env={LEG_ENV.BOOKING}
        onCellFieldsChange={onCellFieldsChange}
        dataSource={tableData}
        getContextMenu={params => (
          <Menu
            onClick={event => {
              if (event.key === 'copy') {
                setTableData(pre => {
                  const next = insert(pre, params.rowIndex, {
                    ..._.cloneDeep(params.record),
                    [LEG_ID_FIELD]: uuid(),
                  });
                  return next;
                });
              }
              if (event.key === 'remove') {
                setTableData(pre => {
                  const next = remove(pre, params.rowIndex);
                  return next;
                });
              }
            }}
          >
            <Menu.Item key="copy">复制</Menu.Item>
            <Menu.Item key="remove">删除</Menu.Item>
          </Menu>
        )}
      />
    </Page>
  );
};

export default memo(
  connect(state => ({
    currentUser: (state.user as any).currentUser,
    pricingData: state.pricingData,
    tableData: state.tradeManagementBooking.tableData,
  }))(TradeManagementBooking),
);
