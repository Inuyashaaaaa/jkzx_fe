import { LEG_FIELD, LEG_ID_FIELD, LEG_TYPE_FIELD, LEG_TYPE_ZHCH_MAP } from '@/constants/common';
import { FORM_EDITABLE_STATUS } from '@/constants/global';
import { LEG_FIELD_ORDERS } from '@/constants/legColDefs/common/order';
import { LEG_ENV, TOTAL_LEGS } from '@/constants/legs';
import BookingBaseInfoForm from '@/containers/BookingBaseInfoForm';
import { Form2, Loading, Table2 } from '@/design/components';
import { ITableData } from '@/design/components/type';
import { insert, remove, uuid } from '@/design/utils';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { trdTradeGet } from '@/services/general-service';
import {
  backConvertPercent,
  createLegDataSourceItem,
  getTradeCreateModalData,
} from '@/services/pages';
import { trdPositionLCMEventTypes, trdTradeLCMUnwindAmountGet } from '@/services/trade-service';
import { getLegByRecord } from '@/tools';
import { ILeg, ILegColDef } from '@/types/leg';
import { Affix, Button, Divider, Menu, message, Row, Typography } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import React, { memo, useRef, useState } from 'react';
import useLifecycles from 'react-use/lib/useLifecycles';
import './index.less';

const TradeManagementBooking = props => {
  const [columnMeta, setColumnMeta] = useState({
    columns: [],
    unionColumns: [],
  });
  const [tableData, setTableData] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createFormData, setCreateFormData] = useState({});
  const tableEl = useRef<Table2>(null);
  const [cashModalDataSource, setcashModalDataSource] = useState([]);
  const [cashModalVisible, setCashModalVisible] = useState(false);
  const [eventTypes, setEventTypes] = useState({});

  const addLeg = (leg: ILeg, position) => {
    if (!leg) return;

    setColumnMeta(pre => {
      const { columns, unionColumns } = pre;
      const nextUnion = getUnionLegColumns(unionColumns.concat(leg.getColumns(LEG_ENV.EDITING)));
      const nextColumns = getTitleColumns(
        getLoadingsColumns(getWidthColumns(getEmptyRenderLegColumns(getOrderLegColumns(nextUnion))))
      );
      return {
        columns: nextColumns,
        unionColumns: nextUnion,
      };
    });

    const isAnnualized = position.asset.annualized;

    setTableData(pre =>
      pre.concat({
        ...createLegDataSourceItem(leg, LEG_ENV.EDITING),
        [LEG_ID_FIELD]: position.positionId,
        lcmEventType: position.lcmEventType,
        ...leg.getPageData(LEG_ENV.EDITING, position),
        ...Form2.createFields(
          backConvertPercent({
            ..._.omitBy(
              _.omit(position.asset, ['counterpartyCode', 'annualized', 'exerciseType']),
              _.isNull
            ),
            [LEG_FIELD.IS_ANNUAL]: isAnnualized,
          })
        ),
      })
    );
  };

  const loadTableData = async () => {
    if (!props.location.query.id) {
      return message.warn('查看 id 不存在');
    }

    setTableLoading(true);

    const { error, data } = await trdTradeGet({
      tradeId: props.location.query.id,
    });

    if (error) return;

    const tableFormData = getTradeCreateModalData(data);

    const { positions } = data;

    const composePositions = await Promise.all(
      positions.map(position => {
        return trdTradeLCMUnwindAmountGet({
          tradeId: tableFormData.tradeId,
          positionId: position.positionId,
        }).then(rsp => {
          const { error, data } = rsp;
          if (error) return position;
          return {
            ...position,
            asset: {
              ...position.asset,
              [LEG_FIELD.INITIAL_NOTIONAL_AMOUNT]: data.initialValue,
              [LEG_FIELD.ALUNWIND_NOTIONAL_AMOUNT]: data.historyValue,
            },
          };
        });
      })
    );

    setTableLoading(false);
    setCreateFormData(Form2.createFields(tableFormData));
    mockAddLegItem(composePositions, tableFormData);
    fetchEventType(composePositions);
  };

  const mockAddLegItem = async (composePositions, tableFormData) => {
    composePositions.forEach(position => {
      const leg = TOTAL_LEGS.find(it => it.type === position.productType);
      addLeg(leg, position);
    });
  };

  const fetchEventType = composePositions => {
    composePositions.forEach(position => {
      trdPositionLCMEventTypes({
        positionId: position.positionId,
      }).then(rsp => {
        if (rsp.error) return;
        const data = [...rsp.data];
        setEventTypes(pre => ({
          ...pre,
          [position.positionId]: data,
        }));
      });
    });
  };

  useLifecycles(() => {
    loadTableData();
  });

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

  const [affixed, setAffixed] = useState(false);

  return (
    <PageHeaderWrapper>
      <Typography.Title level={4}>基本信息</Typography.Title>
      <Divider />
      <Loading loading={tableLoading}>
        <BookingBaseInfoForm
          editableStatus={FORM_EDITABLE_STATUS.EDITING_CAN_CONVERT}
          createFormData={createFormData}
          setCreateFormData={setCreateFormData}
        />
      </Loading>
      <Typography.Title style={{ marginTop: 20 }} level={4}>
        交易结构信息
      </Typography.Title>
      <Divider />
      <Table2
        loading={tableLoading}
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
                LEG_ENV.EDITING,
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
        columns={columnMeta.columns}
        dataSource={tableData}
        // getContextMenu={params => {
        //   return (
        //     <Menu
        //       onClick={event => {
        //         if (event.key === 'copy') {
        //           setTableData(pre => {
        //             const next = insert(pre, params.rowIndex, {
        //               ..._.cloneDeep(params.record),
        //               [LEG_ID_FIELD]: uuid(),
        //             });
        //             return next;
        //           });
        //         }
        //         if (event.key === 'remove') {
        //           setTableData(pre => {
        //             const next = remove(pre, params.rowIndex);
        //             return next;
        //           });
        //         }
        //       }}
        //     >
        //       <Menu.Item key="copy">复制</Menu.Item>
        //       <Menu.Item key="remove">删除</Menu.Item>
        //     </Menu>
        //   );
        // }}
      />
      <Affix offsetBottom={0} onChange={affixed => setAffixed(affixed)}>
        <Row
          type="flex"
          justify="end"
          style={{
            background: affixed ? '#fff' : 'initial',
            padding: '20px 10px',
            borderTop: affixed ? '1px solid #ddd' : 'none',
          }}
        >
          <Button
            type="primary"
            onClick={() => {
              this.setState({
                top: this.state.top + 10,
              });
            }}
          >
            保存
          </Button>
        </Row>
      </Affix>
    </PageHeaderWrapper>
  );
};

export default memo(
  connect(state => ({
    currentUser: (state.user as any).currentUser,
    pricingData: state.pricingData,
  }))(TradeManagementBooking)
);
