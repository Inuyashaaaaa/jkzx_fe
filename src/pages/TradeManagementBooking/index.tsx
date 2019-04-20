import {
  LEG_FIELD,
  LEG_ID_FIELD,
  LEG_NAME_FIELD,
  LEG_TYPE_FIELD,
  LEG_TYPE_ZHCH_MAP,
} from '@/constants/common';
import { LEG_FIELD_ORDERS } from '@/constants/legColDefs/common/order';
import { LEG_ENV, TOTAL_LEGS } from '@/constants/legs';
import MultilLegCreateButton from '@/containers/MultiLegsCreateButton';
import { Form2, Loading, ModalButton, Table2 } from '@/design/components';
import { VERTICAL_GUTTER } from '@/design/components/SourceTable';
import { ITableData } from '@/design/components/type';
import { insert, remove, uuid } from '@/design/utils';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { convertTradePageData2ApiData } from '@/services/pages';
import { cliTasksGenerateByTradeId } from '@/services/reference-data-service';
import { trdTradeCreate } from '@/services/trade-service';
import { getLegByRecord } from '@/tools';
import { ILeg, ILegColDef } from '@/types/leg';
import { Button, Menu, message, Modal, Row } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import React, { memo, useRef, useState } from 'react';
import CreateForm from './CreateForm';
import './index.less';

const TradeManagementBooking = props => {
  const [columns, setColumns] = useState([]);
  const [tableData, setTableData] = useState([]);

  const getUnionLegColumns = (legColDefs: ILegColDef[]) => {
    return _.unionBy(legColDefs, item => item.dataIndex);
  };

  const getOrderLegColumns = (legColDefs: ILegColDef[]) => {
    if (!legColDefs) return [];
    const notOrders = _.difference(legColDefs.map(item => item.dataIndex), LEG_FIELD_ORDERS);
    if (notOrders && notOrders.length) {
      console.error(`leg self colDef.dataIndex:[${notOrders}] not join orders yet.`);
    }
    return LEG_FIELD_ORDERS.reduce((pre, next) => {
      const colDef = legColDefs.find(item => item.dataIndex === next);
      if (colDef) {
        return pre.concat(colDef);
      }
      return pre;
    }, []).concat(notOrders.map(next => legColDefs.find(item => item.dataIndex === next)));
  };

  const getLegByType = (type: string) => {
    return TOTAL_LEGS.find(item => item.type === type);
  };

  const cellIsEmpty = (record, colDef) => {
    const legBelongByRecord = getLegByType(record[LEG_TYPE_FIELD]);

    if (
      (colDef.exsitable && !colDef.exsitable(record)) ||
      !(
        legBelongByRecord &&
        legBelongByRecord
          .getColumns(LEG_ENV.PRICING)
          .find(item => item.dataIndex === colDef.dataIndex)
      )
    ) {
      return true;
    }
    return false;
  };

  const getEmptyRenderLegColumns = (legColDefs: ILegColDef[]) => {
    return legColDefs.map(item => {
      return {
        ...item,
        editable(record, index, { colDef }) {
          if (cellIsEmpty(record, colDef)) {
            return false;
          }
          if (typeof item.editable === 'function') {
            return item.editable.apply(this, arguments);
          }
          return !!item.editable;
        },
        onCell(record, index, { colDef }) {
          if (cellIsEmpty(record, colDef)) {
            return {
              style: { backgroundColor: '#e8e8e8' },
              ...(item.onCell ? item.onCell.apply(this, arguments) : null),
            };
          }
        },
        render(val, record, index, { colDef }) {
          if (cellIsEmpty(record, colDef)) {
            return null;
          }

          return item.render.apply(this, arguments);
        },
      };
    });
  };

  const createLegDataSourceItem = (leg: ILeg) => {
    return {
      [LEG_ID_FIELD]: uuid(),
      [LEG_TYPE_FIELD]: leg.type,
      [LEG_NAME_FIELD]: leg.name,
    };
  };

  const getWidthColumns = (legColDefs: ILegColDef[]) => {
    return legColDefs.map(item => {
      return {
        ...item,
        onCell() {
          return {
            width: '250px',
            ...(item.onCell ? item.onCell.apply(this, arguments) : null),
          };
        },
      };
    });
  };

  const getLoadingsColumns = (legColDefs: ILegColDef[]) => {
    return legColDefs.map(item => {
      return {
        ...item,
        render(val, record, index, { colDef }) {
          const loading = _.get(record[colDef.dataIndex], 'loading', false);
          return <Loading loading={loading}>{item.render.apply(this, arguments)}</Loading>;
        },
      };
    });
  };

  const getTitleColumns = (legColDefs: ILegColDef[]) => {
    return [
      {
        title: '结构类型',
        dataIndex: LEG_FIELD.LEG_META,
        render: (val, record) => {
          return LEG_TYPE_ZHCH_MAP[record[LEG_TYPE_FIELD]];
        },
      },
      // meta field 会被 loading 包装
      ...remove(legColDefs, item => item.dataIndex === LEG_FIELD.LEG_META),
    ];
  };

  const [createTradeLoading, setCreateTradeLoading] = useState(false);

  // useEffect(
  //   () => {
  //     setColumns(pre => pre.map(item => item));
  //   },
  //   [loadings]
  // );

  const setLoadings = (colId: string, rowId: string, loading: boolean) => {
    setTableData(pre =>
      pre.map(record => {
        if (record[LEG_ID_FIELD] === rowId) {
          return {
            ...record,
            [colId]: {
              ...record[colId],
              loading,
            },
          };
        }
        return record;
      })
    );
  };

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createFormData, setCreateFormData] = useState({});
  const tableEl = useRef<Table2>(null);
  const [cashModalDataSource, setcashModalDataSource] = useState([]);
  const [cashModalVisible, setCashModalVisible] = useState(false);

  return (
    <PageHeaderWrapper>
      <Row style={{ marginBottom: VERTICAL_GUTTER }}>
        <Button.Group>
          <MultilLegCreateButton
            isPricing={false}
            key="create"
            handleAddLeg={(leg: ILeg) => {
              if (!leg) return;

              setColumns(pre => {
                const next = getTitleColumns(
                  getLoadingsColumns(
                    getWidthColumns(
                      getEmptyRenderLegColumns(
                        getOrderLegColumns(
                          getUnionLegColumns(pre.concat(leg.getColumns(LEG_ENV.BOOKING)))
                        )
                      )
                    )
                  )
                );
                return next;
              });

              setTableData(pre =>
                pre.concat({
                  ...createLegDataSourceItem(leg),
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

              const rsps = await tableEl.current.validate();
              if (rsps.some(item => item.error)) {
                return;
              }

              setCreateModalVisible(true);

              // setTableData(pre =>
              //   pre.map(item =>
              //     _.mapValues(item, val => {
              //       console.log(val);
              //       if (typeof val !== 'object') {
              //         return val;
              //       }
              //       return {
              //         ...val,
              //         value: '1',
              //       };
              //     })
              //   )
              // );
            }}
            modalProps={{
              title: '创建簿记',
              visible: createModalVisible,
              onOk: async () => {
                const trade = convertTradePageData2ApiData(
                  tableData.map(item => Form2.getFieldsValue(item)),
                  Form2.getFieldsValue(createFormData),
                  props.currentUser.userName,
                  LEG_ENV.BOOKING
                );

                const { error } = await trdTradeCreate({
                  trade,
                  validTime: '2018-01-01T10:10:10',
                });

                if (error) return false;

                message.success('簿记成功');

                setCreateModalVisible(false);
                setColumns([]);
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
                <CreateForm
                  setCreateModalVisible={setCreateModalVisible}
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
      <Table2
        size="middle"
        ref={node => (tableEl.current = node)}
        rowKey={LEG_ID_FIELD}
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
                  setLoadings(colId, params.rowId, loading);
                },
                setLoadings,
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
        pagination={false}
        vertical={true}
        columns={columns}
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
      <Modal
        visible={cashModalVisible}
        title="现金流管理"
        width={900}
        onCancel={() => setCashModalVisible(false)}
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
                return <a href="javascript:;">资金录入</a>;
              },
            },
          ]}
        />
      </Modal>
    </PageHeaderWrapper>
  );
};

export default memo(
  connect(state => ({
    currentUser: (state.user as any).currentUser,
    pricingData: state.pricingData,
  }))(TradeManagementBooking)
);
