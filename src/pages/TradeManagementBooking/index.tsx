import { LEG_FIELD, LEG_ID_FIELD, LEG_TYPE_FIELD, LEG_TYPE_ZHCH_MAP } from '@/constants/common';
import { FORM_EDITABLE_STATUS, TRADESCOL_FIELDS, COMPUTED_LEG_FIELDS } from '@/constants/global';
import { LEG_FIELD_ORDERS } from '@/constants/legColDefs/common/order';
import {
  LEG_ENV,
  TOTAL_LEGS,
  TOTAL_COMPUTED_FIELDS,
  TOTAL_TRADESCOL_FIELDS,
} from '@/constants/legs';
import BookingBaseInfoForm from '@/containers/BookingBaseInfoForm';
import MultilLegCreateButton from '@/containers/MultiLegsCreateButton';
import { Form2, Loading, ModalButton, Table2 } from '@/design/components';
import { VERTICAL_GUTTER } from '@/design/components/SourceTable';
import { IFormField, ITableData } from '@/design/components/type';
import { insert, remove, uuid } from '@/design/utils';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { convertTradePageData2ApiData, createLegDataSourceItem } from '@/services/pages';
import { cliTasksGenerateByTradeId } from '@/services/reference-data-service';
import { trdTradeCreate } from '@/services/trade-service';
import { getLegByRecord } from '@/tools';
import { ILeg, ILegColDef } from '@/types/leg';
import { Affix, Button, Divider, Menu, message, Modal, Row } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import React, { memo, useEffect, useRef, useState } from 'react';
import './index.less';
import { PRICING_FROM_TAG } from '@/constants/trade';
import { LEG_MAP } from '@/constants/legType';
import MultiLegTable from '@/containers/MultiLegTable';
import { IMultiLegTableEl } from '@/containers/MultiLegTable/type';

const ActionBar = memo<any>(props => {
  const { setTableData, tableData, tableEl, currentUser } = props;

  const [affix, setAffix] = useState(false);
  const [createTradeLoading, setCreateTradeLoading] = useState(false);

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createFormData, setCreateFormData] = useState({});
  const [cashModalDataSource, setcashModalDataSource] = useState([]);
  const [cashModalVisible, setCashModalVisible] = useState(false);

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
                setCreateFormData({});

                const { error: _error, data: _data } = await cliTasksGenerateByTradeId({
                  tradeId: trade.tradeId,
                  legalName: Form2.getFieldValue(createFormData.counterPartyCode),
                });

                if (_error) return;

                setcashModalDataSource(_data);
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

      <Modal
        visible={cashModalVisible}
        title="现金流管理"
        width={900}
        onCancel={() => setCashModalVisible(false)}
        onOk={() => setCashModalVisible(false)}
      >
        <Table2
          pagination={false}
          dataSource={cashModalDataSource}
          columns={[
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
              title: '生命周期事件',
              dataIndex: 'lcmEventType',
            },
            {
              title: '处理状态',
              dataIndex: 'processStatus',
              render: value => {
                if (value === 'PROCESSED') {
                  return '已处理';
                }
                return '未处理';
              },
            },
            {
              title: '操作',
              dataIndex: 'action',
              render: (val, record) => {
                return <a href="javascript:;">资金录入(等待接入新的资金窗口）</a>;
              },
            },
          ]}
        />
      </Modal>
    </Affix>
  );
});

const TradeManagementBooking = props => {
  const { location, currentUser } = props;
  const { query } = location;
  const { from } = query;

  const [tableData, setTableData] = useState(
    from === PRICING_FROM_TAG
      ? (props.pricingData.tableData || []).map(item =>
          _.omit(item, [...TRADESCOL_FIELDS, ...COMPUTED_LEG_FIELDS])
        )
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
