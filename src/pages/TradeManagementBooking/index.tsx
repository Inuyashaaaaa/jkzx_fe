import { LEG_FIELD, LEG_ID_FIELD, PREMIUM_TYPE_MAP } from '@/constants/common';
import {
  COMPUTED_LEG_FIELDS,
  COMPUTED_LEG_FIELD_MAP,
  FORM_EDITABLE_STATUS,
  TRADESCOL_FIELDS,
} from '@/constants/global';
import { LEG_ENV } from '@/constants/legs';
import { BOOKING_FROM_PRICING } from '@/constants/trade';
import BookingBaseInfoForm from '@/containers/BookingBaseInfoForm';
import CashExportModal from '@/containers/CashExportModal';
import MultilLegCreateButton from '@/containers/MultiLegsCreateButton';
import MultiLegTable from '@/containers/MultiLegTable';
import { IMultiLegTableEl } from '@/containers/MultiLegTable/type';
import { Form2, ModalButton } from '@/design/components';
import { IFormField } from '@/design/components/type';
import { insert, remove, uuid } from '@/design/utils';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { convertTradePageData2ApiData, createLegDataSourceItem } from '@/services/pages';
import { trdTradeCreate } from '@/services/trade-service';
import { getLegByRecord } from '@/tools';
import { ILeg } from '@/types/leg';
import { Affix, Button, Divider, Menu, message, Row } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import React, { memo, useRef, useState } from 'react';
import './index.less';

const ActionBar = memo<any>(props => {
  const { setTableData, tableData, tableEl, currentUser } = props;

  const [affix, setAffix] = useState(false);
  const [createTradeLoading, setCreateTradeLoading] = useState(false);

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createFormData, setCreateFormData] = useState({});
  const [cashModalVisible, setCashModalVisible] = useState(false);

  const handleCancel = () => {
    setCashModalVisible(false);
    setCreateFormData({});
  };

  return (
    <Affix offsetTop={0} onChange={affix => setAffix(affix)}>
      <Row
        type="flex"
        justify="space-between"
        style={{
          background: '#fff',
          borderBottom: affix ? '1px solid #ddd' : 'none',
          padding: affix ? '20px 0' : 0,
        }}
      >
        <Button.Group>
          <MultilLegCreateButton
            isPricing={false}
            key="create"
            handleAddLeg={(leg: ILeg) => {
              if (!leg) return;

              setTableData(pre =>
                pre.concat({
                  ...createLegDataSourceItem(leg, LEG_ENV.BOOKING),
                  ...leg.getDefaultData(LEG_ENV.BOOKING),
                })
              );
            }}
          />
          <ModalButton
            key="完成簿记"
            type="primary"
            loading={createTradeLoading}
            onClick={async () => {
              if (tableData.length === 0) {
                return message.warn('缺少交易结构');
              }

              const rsps = await tableEl.current.table.validate();
              if (rsps.some(item => item.errors)) {
                return;
              }

              setCreateModalVisible(true);
            }}
            modalProps={{
              title: '创建簿记',
              visible: createModalVisible,
              onOk: async () => {
                const trade = convertTradePageData2ApiData(
                  tableData.map(item => Form2.getFieldsValue(item)),
                  Form2.getFieldsValue(createFormData),
                  currentUser.userName,
                  LEG_ENV.BOOKING
                );

                const { error } = await trdTradeCreate({
                  trade,
                  validTime: '2018-01-01T10:10:10',
                });

                if (error) return;

                message.success('簿记成功');

                setCreateModalVisible(false);
                setTableData([]);

                setCashModalVisible(true);
              },
              onCancel: () => setCreateModalVisible(false),
              children: (
                <BookingBaseInfoForm
                  editableStatus={FORM_EDITABLE_STATUS.EDITING_NO_CONVERT}
                  createFormData={createFormData}
                  setCreateFormData={setCreateFormData}
                />
              ),
            }}
          >
            完成簿记
          </ModalButton>
        </Button.Group>
      </Row>

      <CashExportModal
        visible={cashModalVisible}
        trade={Form2.getFieldsValue(createFormData)}
        convertVisible={handleCancel}
      />
    </Affix>
  );
});

const TradeManagementBooking = props => {
  const { location, currentUser } = props;
  const { query } = location;
  const { from } = query;

  const [tableData, setTableData] = useState(
    from === BOOKING_FROM_PRICING
      ? (props.pricingData.tableData || []).map(item => {
          const permium = Math.abs(
            Form2.getFieldValue(
              item[LEG_FIELD.PREMIUM_TYPE] === PREMIUM_TYPE_MAP.CNY
                ? item[COMPUTED_LEG_FIELD_MAP.PRICE]
                : item[COMPUTED_LEG_FIELD_MAP.PRICE_PER],
              0
            )
          );
          return {
            ..._.omit(item, [...TRADESCOL_FIELDS, ...COMPUTED_LEG_FIELDS]),
            [LEG_FIELD.PREMIUM]: Form2.createField(permium),
          };
        })
      : []
  );

  const tableEl = useRef<IMultiLegTableEl>(null);

  return (
    <PageHeaderWrapper>
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
        onCellFieldsChange={params => {
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
    </PageHeaderWrapper>
  );
};

export default memo(
  connect(state => ({
    currentUser: (state.user as any).currentUser,
    pricingData: state.pricingData,
  }))(TradeManagementBooking)
);
