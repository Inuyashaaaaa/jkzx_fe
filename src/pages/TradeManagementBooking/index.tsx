import { LEG_FIELD, LEG_ID_FIELD, LEG_INJECT_FIELDS, PREMIUM_TYPE_MAP } from '@/constants/common';
import { COMPUTED_LEG_FIELD_MAP } from '@/constants/global';
import { LEG_ENV } from '@/constants/legs';
import { BOOKING_FROM_PRICING } from '@/constants/trade';
import { Form2 } from '@/containers';
import MultiLegTable from '@/containers/MultiLegTable';
import { IMultiLegTableEl } from '@/containers/MultiLegTable/type';
import Page from '@/containers/Page';
import { IFormField } from '@/containers/type';
import { createLegDataSourceItem } from '@/services/pages';
import { getLegByRecord, insert, remove, uuid } from '@/tools';
import { Divider, Menu } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import React, { memo, useRef, useState } from 'react';
import ActionBar from './ActionBar';
import './index.less';

const TradeManagementBooking = props => {
  const { location, currentUser, tableData: modalTableData, dispatch } = props;
  const { query } = location;
  const { from } = query;

  const getPricingPermium = record => {
    return Form2.getFieldValue(record[LEG_FIELD.PREMIUM_TYPE]) === PREMIUM_TYPE_MAP.CNY
      ? record[COMPUTED_LEG_FIELD_MAP.PRICE]
      : record[COMPUTED_LEG_FIELD_MAP.PRICE_PER];
  };

  const tableData =
    from === BOOKING_FROM_PRICING
      ? (props.pricingData.tableData || []).map(item => {
          const leg = getLegByRecord(item);
          if (!leg) return item;
          const omits = _.difference(
            leg.getColumns(LEG_ENV.PRICING).map(item => item.dataIndex),
            leg.getColumns(LEG_ENV.BOOKING).map(item => item.dataIndex)
          );

          const pricingPermium = getPricingPermium(item);
          const permium =
            pricingPermium == null ? undefined : Math.abs(Form2.getFieldValue(pricingPermium));

          return {
            ...createLegDataSourceItem(leg, LEG_ENV.BOOKING),
            ...leg.getDefaultData(LEG_ENV.BOOKING),
            ..._.omit(item, [...omits, ...LEG_INJECT_FIELDS]),
            [LEG_FIELD.PREMIUM]: Form2.createField(permium),
          };
        })
      : modalTableData;

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
          setTableData
        );
      }
      return newData;
    });
  };

  const tableEl = useRef<IMultiLegTableEl>(null);
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
        getContextMenu={params => {
          return (
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
          );
        }}
      />
    </Page>
  );
};

export default memo(
  connect(state => ({
    currentUser: (state.user as any).currentUser,
    pricingData: state.pricingData,
    tableData: state.tradeManagementBooking.tableData,
  }))(TradeManagementBooking)
);
