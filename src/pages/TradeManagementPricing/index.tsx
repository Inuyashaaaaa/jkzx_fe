import {
  BIG_NUMBER_CONFIG,
  LEG_FIELD,
  LEG_ID_FIELD,
  LEG_TYPE_FIELD,
  LEG_TYPE_ZHCH_MAP,
} from '@/constants/common';
import {
  COMPUTED_LEG_FIELDS,
  TRADESCOL_FIELDS,
  TRADESCOLDEFS_LEG_FIELD_MAP,
} from '@/constants/global';
import { LEG_FIELD_ORDERS } from '@/constants/legColDefs/common/order';
import { COMPUTED_LEG_FIELD_MAP } from '@/constants/legColDefs/computedColDefs/ComputedColDefs';
import {
  LEG_ENV,
  TOTAL_COMPUTED_FIELDS,
  TOTAL_LEGS,
  TOTAL_TRADESCOL_FIELDS,
} from '@/constants/legs';
import { PRICING_FROM_TAG } from '@/constants/trade';
import MultilLegCreateButton from '@/containers/MultiLegsCreateButton';
import { Form2, Loading, Table2 } from '@/design/components';
import { IFormField } from '@/design/components/type';
import { insert, remove, uuid } from '@/design/utils';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import {
  countDelta,
  countDeltaCash,
  countGamaCash,
  countGamma,
  countPrice,
  countPricePer,
  countRhoR,
  countStdDelta,
  countTheta,
  countVega,
} from '@/services/cash';
import { convertTradePositions, createLegDataSourceItem } from '@/services/pages';
import { prcTrialPositionsService } from '@/services/pricing';
import { prcPricingEnvironmentsList } from '@/services/pricing-service';
import { getActualNotionAmountBigNumber } from '@/services/trade';
import { getLegByRecord } from '@/tools';
import { ILeg, ILegColDef } from '@/types/leg';
import {
  Affix,
  Button,
  Col,
  Divider,
  Input,
  Menu,
  message,
  Modal,
  notification,
  Row,
  Select,
} from 'antd';
import BigNumber from 'bignumber.js';
import { connect } from 'dva';
import _ from 'lodash';
import React, { memo, useEffect, useRef, useState } from 'react';
import useLifecycles from 'react-use/lib/useLifecycles';
import router from 'umi/router';
import './index.less';

const ActionBar = memo<any>(props => {
  const {
    setColumnMeta,
    getUnionLegColumns,
    chainLegColumns,
    setTableData,
    curPricingEnv,
    setCurPricingEnv,
    tableData,
    pricingEnvironmentsList,
    createTradeLoading,
    fetchDefaultPricingEnvData,
    testPricing,
    pricingLoading,
  } = props;

  const onPricingEnvSelectChange = val => {
    setCurPricingEnv(val);
    tableData.forEach(item => fetchDefaultPricingEnvData(item, true));
  };

  const convertBooking = () => {
    router.push({
      pathname: '/trade-management/booking',
      query: {
        from: PRICING_FROM_TAG,
      },
    });
  };

  const [affix, setAffix] = useState(false);

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
        <Row type="flex" align="middle">
          <Col>
            <MultilLegCreateButton
              isPricing={false}
              key="create"
              handleAddLeg={(leg: ILeg) => {
                if (!leg) return;

                setColumnMeta(pre => {
                  const { columns, unionColumns } = pre;
                  const nextUnion = getUnionLegColumns(
                    unionColumns.concat(leg.getColumns(LEG_ENV.PRICING))
                  );
                  const nextColumns = chainLegColumns(nextUnion);
                  return {
                    columns: nextColumns,
                    unionColumns: nextUnion,
                  };
                });

                setTableData(pre =>
                  pre.concat({
                    ...createLegDataSourceItem(leg, LEG_ENV.PRICING),
                    ...leg.getDefaultData(LEG_ENV.PRICING),
                  })
                );
              }}
            />
          </Col>
          <Col style={{ marginLeft: 15 }}>定价环境:</Col>
          <Col style={{ marginLeft: 10, width: 400 }}>
            <Input.Group compact={true}>
              <Select
                onChange={onPricingEnvSelectChange}
                value={curPricingEnv}
                style={{ width: 200 }}
              >
                {pricingEnvironmentsList.map(item => {
                  return (
                    <Select.Option key={item} value={item}>
                      {item}
                    </Select.Option>
                  );
                })}
              </Select>
              <Button loading={pricingLoading} key="试定价" type="primary" onClick={testPricing}>
                试定价
              </Button>
            </Input.Group>
          </Col>
        </Row>
        <Button key="转换簿记" type="primary" onClick={convertBooking}>
          转换簿记
        </Button>
      </Row>
    </Affix>
  );
});

const TradeManagementBooking = props => {
  const [columnMeta, setColumnMeta] = useState({
    columns: [],
    unionColumns: [],
  });
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

    if (TOTAL_TRADESCOL_FIELDS.find(item => item.dataIndex === colDef.dataIndex)) {
      return false;
    }

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

  const [loadingsByRow, setLoadingsByRow] = useState({});

  const chainLegColumns = nextUnion => {
    return getTitleColumns(
      getLoadingsColumns(getWidthColumns(getEmptyRenderLegColumns(getOrderLegColumns(nextUnion))))
    );
  };

  useEffect(
    () => {
      if (!tableData.length) return;
      setColumnMeta(pre => {
        const { columns, unionColumns } = pre;
        return {
          columns: chainLegColumns(unionColumns),
          unionColumns,
        };
      });
    },
    [loadingsByRow]
  );

  const getLoadingsColumns = (legColDefs: ILegColDef[]) => {
    return legColDefs.map(item => {
      return {
        ...item,
        render(val, record, index, { colDef }) {
          const loading = _.get(loadingsByRow, [record[LEG_ID_FIELD], colDef.dataIndex], false);
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

  const setLoadings = (rowId: string, colId: string, loading: boolean) => {
    setLoadingsByRow(pre => {
      return {
        ..._.set(pre, [rowId], {
          ..._.get(pre, [rowId], {}),
          [colId]: loading,
        }),
      };
    });
  };

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createFormData, setCreateFormData] = useState({});
  const tableEl = useRef<Table2>(null);
  const [cashModalDataSource, setcashModalDataSource] = useState([]);
  const [cashModalVisible, setCashModalVisible] = useState(false);
  const [curPricingEnv, setCurPricingEnv] = useState(null);

  const judgeLegColumnsHasError = record => {
    const leg = getLegByRecord(record);

    if (!leg) {
      throw new Error('leg is not defiend.');
    }

    const leftColumns = _.reject(
      leg.getColumns(LEG_ENV.PRICING),
      item =>
        !![...TOTAL_TRADESCOL_FIELDS, ...TOTAL_COMPUTED_FIELDS].find(
          iitem => iitem.dataIndex === item.dataIndex
        )
    );

    const leftKeys = leftColumns.map(item => item.dataIndex);

    const fills = leftKeys.reduce((obj, key) => {
      obj[key] = record[key] || undefined;
      return obj;
    }, {});

    const leftValues = Form2.getFieldsValue(_.pick(fills, leftKeys));

    if (_.some(leftValues, val => val == null)) {
      return true;
    }

    return false;
  };

  const fetchDefaultPricingEnvData = _.debounce(async (record, reload = false) => {
    if (judgeLegColumnsHasError(record)) {
      return;
    }

    const inlineSetLoadings = loading => {
      tradeOptions.forEach(colId => {
        setLoadings(record[LEG_ID_FIELD], colId, loading);
      });
    };

    // const rsps = await tableEl.current.validate({ silence: true });
    // if (rsps.some(item => item.errors)) {
    //   return;
    // }

    const tradeOptions = TRADESCOL_FIELDS.filter(
      item => item !== TRADESCOLDEFS_LEG_FIELD_MAP.UNDERLYER_PRICE
    );

    // val，q 等都为空，视为默认
    if (!reload && _.some(_.pick(record, tradeOptions), item => item != null)) {
      return;
    }

    if (!curPricingEnv) {
      return message.warn('定价环境不能为空');
    }

    inlineSetLoadings(true);

    const { error, data = [] } = await prcTrialPositionsService({
      positions: convertTradePositions(
        [Form2.getFieldsValue(_.omit(record, [...TRADESCOL_FIELDS, ...COMPUTED_LEG_FIELDS]))],
        {},
        LEG_ENV.PRICING
      ),
      pricingEnvironmentId: curPricingEnv,
    });

    inlineSetLoadings(false);

    if (error) return;

    const rowId = record[LEG_ID_FIELD];

    setTableData(pre => {
      return pre.map(item => {
        if (item[LEG_ID_FIELD] === rowId) {
          return {
            ...item,
            ...Form2.createFields(
              _.mapValues(
                _.pick<{
                  [key: string]: number;
                }>(
                  _.first(data),
                  TRADESCOL_FIELDS.filter(
                    item => item !== TRADESCOLDEFS_LEG_FIELD_MAP.UNDERLYER_PRICE
                  )
                ),
                val => {
                  if (val) {
                    return new BigNumber(val)
                      .multipliedBy(100)
                      .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
                      .toNumber();
                  }
                  return val;
                }
              )
            ),
          };
        }
        return item;
      });
    });
  }, 1000);

  const [pricingEnvironmentsList, setPricingEnvironmentsList] = useState([]);

  const loadPricingEnv = async () => {
    const { error, data } = await prcPricingEnvironmentsList();
    if (error) return;
    setPricingEnvironmentsList(data);
    setCurPricingEnv(data[0]);
  };

  useLifecycles(() => {
    loadPricingEnv();
  });

  const [pricingLoading, setPricingLoading] = useState(false);

  const testPricing = async params => {
    if (_.isEmpty(tableData)) {
      message.warn('请添加期权结构');
      return;
    }

    const results = await tableEl.current.validate();

    if (results.some(item => item.errors)) return;

    setPricingLoading(true);

    const positions = convertTradePositions(
      tableData.map(item =>
        Form2.getFieldsValue(_.omit(item, [...TRADESCOL_FIELDS, ...COMPUTED_LEG_FIELDS]))
      ),
      {},
      LEG_ENV.PRICING
    );

    const rsps = await Promise.all(
      positions.map((item, index) => {
        return prcTrialPositionsService({
          // 需要计算的值，可选price, delta, gamma, vega, theta, rhoR和rhoQ。若为空数组或null，则计算所有值
          // requests,
          // pricingEnvironmentId,
          // valuationDateTime,
          // timezone,
          positions: [item],
          ..._.mapValues(
            Form2.getFieldsValue(_.pick(tableData[index], TRADESCOL_FIELDS)),
            (val, key) => {
              if (key === TRADESCOLDEFS_LEG_FIELD_MAP.UNDERLYER_PRICE) {
                return val;
              }
              return val ? new BigNumber(val).multipliedBy(0.01).toNumber() : val;
            }
          ),
          pricingEnvironmentId: curPricingEnv,
        });
      })
    );

    setPricingLoading(false);

    if (
      rsps.some(rsp => {
        const { raw } = rsp;
        if (raw && raw.diagnostics && raw.diagnostics.length) {
          return true;
        }
        return false;
      })
    ) {
      return notification.error({
        message: rsps.map(item => _.get(item.raw.diagnostics, '[0].message', [])).join(','),
      });
    }

    if (rsps.some(rsp => rsp.error) || rsps.some(rsp => _.isEmpty(rsp.data))) return;

    setTableData(pre => {
      return rsps
        .reduce((pre, next) => {
          return pre.concat(next.data);
        }, [])
        .map((item, index) => {
          const cur = pre[index];

          return {
            ...cur,
            ...Form2.createFields(
              _.mapValues(_.pick(item, TRADESCOL_FIELDS), (val, key) => {
                val = new BigNumber(val).decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES).toNumber();
                if (key === TRADESCOLDEFS_LEG_FIELD_MAP.UNDERLYER_PRICE) {
                  return val;
                }
                return val
                  ? new BigNumber(val)
                      .multipliedBy(100)
                      .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
                      .toNumber()
                  : val;
              })
            ),
            [COMPUTED_LEG_FIELD_MAP.PRICE]: countPrice(item.price),
            [COMPUTED_LEG_FIELD_MAP.PRICE_PER]: countPricePer(
              item.price,
              getActualNotionAmountBigNumber(Form2.getFieldsValue(cur))
            ),
            [COMPUTED_LEG_FIELD_MAP.STD_DELTA]: countStdDelta(item.delta, item.quantity),
            [COMPUTED_LEG_FIELD_MAP.DELTA]: countDelta(
              item.delta,
              Form2.getFieldValue(cur[LEG_FIELD.UNDERLYER_MULTIPLIER])
            ),
            [COMPUTED_LEG_FIELD_MAP.DELTA_CASH]: countDeltaCash(item.delta, item.underlyerPrice),
            [COMPUTED_LEG_FIELD_MAP.GAMMA]: countGamma(
              item.gamma,
              Form2.getFieldValue(cur[LEG_FIELD.UNDERLYER_MULTIPLIER]),
              item.underlyerPrice
            ),
            [COMPUTED_LEG_FIELD_MAP.GAMMA_CASH]: countGamaCash(item.gamma, item.underlyerPrice),
            [COMPUTED_LEG_FIELD_MAP.VEGA]: countVega(item.vega),
            [COMPUTED_LEG_FIELD_MAP.THETA]: countTheta(item.theta),
            [COMPUTED_LEG_FIELD_MAP.RHO_R]: countRhoR(item.rhoR),
            // [COMPUTED_LEG_FIELD_MAP.RHO]: new BigNumber(item.rho)
            // .multipliedBy(100)
            // .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
            // .toNumber(),
          };
        });
    });
  };

  return (
    <PageHeaderWrapper>
      <ActionBar
        setColumnMeta={setColumnMeta}
        getUnionLegColumns={getUnionLegColumns}
        chainLegColumns={chainLegColumns}
        setTableData={setTableData}
        curPricingEnv={curPricingEnv}
        setCurPricingEnv={setCurPricingEnv}
        tableData={tableData}
        pricingEnvironmentsList={pricingEnvironmentsList}
        createTradeLoading={createTradeLoading}
        fetchDefaultPricingEnvData={fetchDefaultPricingEnvData}
        testPricing={testPricing}
        pricingLoading={pricingLoading}
      />
      <Divider />
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
                LEG_ENV.PRICING,
                params,
                newData[params.rowIndex],
                newData,
                (colId: string, loading: boolean) => {
                  setLoadings(params.rowId, colId, loading);
                },
                setLoadingsByRow,
                (colId: string, newVal: IFormField) => {
                  setTableData(pre => {
                    return pre.map(item => {
                      if (item[LEG_ID_FIELD] === params.rowId) {
                        return {
                          ...item,
                          [colId]: newVal,
                        };
                      }
                      return item;
                    });
                  });
                },
                setTableData
              );
            }
            return newData;
          });
        }}
        onCellValuesChange={params => {
          // changedValues 里面有最新的字段值
          fetchDefaultPricingEnvData({
            ...params.record,
            ...params.changedValues,
          });
        }}
        pagination={false}
        vertical={true}
        columns={columnMeta.columns}
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
    </PageHeaderWrapper>
  );
};

export default memo(
  connect(state => ({
    currentUser: (state.user as any).currentUser,
    pricingData: state.pricingData,
  }))(TradeManagementBooking)
);
