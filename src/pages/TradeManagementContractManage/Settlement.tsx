import {
  BIG_NUMBER_CONFIG,
  DIRECTION_ZHCN_MAP,
  LCM_EVENT_TYPE_MAP,
  LEG_FIELD,
  LEG_TYPE_MAP,
  OPTION_TYPE_ZHCN_MAP,
  PRODUCTTYPE_ZHCH_MAP,
  SPECIFIED_PRICE_ZHCN_MAP,
  STRIKE_TYPES_MAP,
} from '@/constants/common';
import { PAGE_SIZE_OPTIONS } from '@/constants/component';
import { Form2, InputNumber, Loading, SmartTable, Table2 } from '@/containers';
import { cliTasksGenerateByTradeId } from '@/services/reference-data-service';
import {
  tradeExercisePreSettle,
  trdTradeLCMEventProcess,
  trdTradeSettleablePaged,
} from '@/services/trade-service';
import { formatMoney, getRequiredRule } from '@/tools';
import { showTotal } from '@/tools/component';
import { getNumOfOptionsByNotionalAmount } from '@/tools/getNumOfOptions';
import { Button, Col, Icon, message, Modal, Pagination, Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import BigNumber from 'bignumber.js';
import { connect } from 'dva';
import _, { get } from 'lodash';
import moment from 'moment';
import React, { forwardRef, memo, useEffect, useRef, useState } from 'react';

const ALREADY = 'ALREADY';

const SettleInputNumber = memo<any>(
  forwardRef(props => {
    const { onReload, editing, ...restProps } = props;

    return editing ? (
      <InputNumber {...restProps} editing={editing} />
    ) : (
      <Row type="flex" justify="space-between" align="middle">
        <InputNumber {...restProps} editing={editing} style={{ width: 'auto', flexGrow: 1 }} />
        <Icon
          type="reload"
          onClick={event => {
            event.preventDefault();
            event.stopPropagation();
            if (onReload) {
              onReload();
            }
          }}
          style={{ paddingLeft: 5, color: '#1890ff' }}
        />
      </Row>
    );
  })
);

const Settlement = props => {
  const POSITION_ID = 'positionId';
  const { modalVisible, setModalVisible, currentUser = {} } = props;
  const [tableData, setTableData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 0,
    pageSize: PAGE_SIZE,
  });
  const [loading, setLoading] = useState(false);

  const [settLoading, setSettLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const tableEl = useRef<Table2>(null);

  const fetch = async (paramsPagination?) => {
    setLoading(true);
    const { error, data = {} } = await trdTradeSettleablePaged({
      page: (paramsPagination || pagination).current - 1,
      pageSize: (paramsPagination || pagination).pageSize,
    });
    setLoading(false);

    if (error) return;
    if (_.isEmpty(data)) return;

    const { page = [], totalCount } = data;

    const tableDataSource = _.flatten(
      page.map(item => {
        return item.positions.map((node, key) => {
          return {
            ...node,
            ...item,
            ...(item.positions.length > 1 ? { style: { background: '#f2f4f5' } } : null),
            ...(item.positions.length <= 1
              ? null
              : key === 0
              ? { timeLineNumber: item.positions.length }
              : null),
          };
        });
      })
    );

    setTableData(tableDataSource);
    setPagination(pre => ({
      ...pre,
      total: totalCount,
      current: (paramsPagination || pagination).current,
      pageSize: (paramsPagination || pagination).pageSize,
    }));
  };

  const onPagination = (current, pageSize) => {
    fetch({
      current,
      pageSize,
    });
  };

  const onShowSizeChange = (current, pageSize) => {
    onPagination(current, pageSize);
  };

  const onChange = (current, pageSize) => {
    onPagination(current, pageSize);
  };

  const settlement = async () => {
    const validates = await tableEl.current.validate({}, selectedRowKeys);

    if (validates.some(item => !_.isEmpty(item.errors))) {
      return;
    }

    if (_.isEmpty(selectedRowKeys)) {
      return message.warn('请先选择结算对象');
    }

    if (!currentUser.username) {
      return message.error('用户名未成功获取，无法结算');
    }

    setSettLoading(true);
    const fetchDatas = tableData.filter(item => selectedRowKeys.indexOf(item[POSITION_ID]) !== -1);
    const rsps = await Promise.all(
      fetchDatas.map(record => {
        const values = Form2.getFieldsValue(record);

        return trdTradeLCMEventProcess({
          positionId: record[POSITION_ID],
          tradeId: record.tradeId,
          eventType: LCM_EVENT_TYPE_MAP.EXERCISE,
          userLoginId: currentUser.username,
          eventDetail: {
            underlyerPrice: String(get(values, `${LEG_FIELD.UNDERLYER_PRICE}`)),
            settleAmount: String(get(values, `${LEG_FIELD.SETTLE_AMOUNT}`)),
            numOfOptions: getNumOfOptionsByNotionalAmount(
              get(record, `asset.${LEG_FIELD.NOTIONAL_AMOUNT}`),
              get(record, `asset.${LEG_FIELD.INITIAL_SPOT}`),
              get(record, `asset.${LEG_FIELD.UNDERLYER_MULTIPLIER}`)
            ), // 名义本金(手数)
            notionalAmount: String(get(values, `asset.${LEG_FIELD.NOTIONAL_AMOUNT}`)), // 名义本金
          },
        });
      })
    );

    const successRsps = rsps.filter(item => {
      return !item.error;
    });

    if (!_.isEmpty(successRsps)) {
      message.success(
        `批量结算成功：${successRsps
          .reduce((container, rsp) => container.concat((rsp.data || {}).positionIds || []), [])
          .join(',')}`
      );
    }

    // 根据接口返回的 positionIds 判断是否结算成功
    successRsps.forEach(rsp => {
      setTableData(pre => {
        return pre.map(record => {
          if (((rsp.data || {}).positionIds || []).indexOf(record[POSITION_ID]) !== -1) {
            return {
              ...record,
              [ALREADY]: true,
            };
          }
          return record;
        });
      });
    });

    successRsps.forEach(rsp => {
      const positionId = ((rsp.data || {}).positionIds || [])[0];
      generateEvent(tableData.find(item => item[POSITION_ID] === positionId));
    });

    setSelectedRowKeys(pre => {
      return _.reject(pre, key =>
        successRsps.some(rsp => ((rsp.data || {}).positionIds || []).indexOf(key) !== -1)
      );
    });
    setSettLoading(false);
    setFetched(true);
  };

  const preSettlement = async (record): Promise<boolean> => {
    const validates = await tableEl.current.validate(
      {},
      [record[POSITION_ID]],
      [LEG_FIELD.UNDERLYER_PRICE]
    );

    if (validates.some(item => !_.isEmpty(item.errors))) {
      return true;
    }

    const values = Form2.getFieldsValue(record);

    const { error, data } = await tradeExercisePreSettle({
      positionId: record[POSITION_ID],
      eventDetail: {
        underlyerPrice: String(get(values, `${LEG_FIELD.UNDERLYER_PRICE}`)),
        numOfOptions: getNumOfOptionsByNotionalAmount(
          get(values, `asset.${LEG_FIELD.NOTIONAL_AMOUNT}`),
          get(values, `asset.${LEG_FIELD.INITIAL_SPOT}`),
          get(values, `asset.${LEG_FIELD.UNDERLYER_MULTIPLIER}`)
        ), // 名义本金(手数)
        notionalAmount: String(get(values, `asset.${LEG_FIELD.NOTIONAL_AMOUNT}`)), // 名义本金
      },
      eventType: LCM_EVENT_TYPE_MAP.EXERCISE,
    });

    if (error) return;

    setTableData(pre => {
      return pre.map(item => {
        if (item[POSITION_ID] === record[POSITION_ID]) {
          return {
            ...item,
            [LEG_FIELD.SETTLE_AMOUNT]: Form2.createField(
              new BigNumber(data).decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES).toNumber()
            ),
          };
        }
        return item;
      });
    });

    return error;
  };

  const generateEvent = async record => {
    if (!record) return;
    const { error, data } = await cliTasksGenerateByTradeId({
      tradeId: record.tradeId,
      legalName: record.counterPartyCode,
    });
  };

  useEffect(
    () => {
      if (!modalVisible) {
        setFetched(false);
        setSelectedRowKeys([]);
        return;
      }
      fetch();
    },
    [modalVisible]
  );

  const canSett = record => {
    if (record[ALREADY]) {
      return false;
    }

    if (
      record[LEG_FIELD.LCM_EVENT_TYPE] === LCM_EVENT_TYPE_MAP.EXPIRATION || // 到期
      record[LEG_FIELD.LCM_EVENT_TYPE] === LCM_EVENT_TYPE_MAP.EXERCISE || // 行权
      record[LEG_FIELD.LCM_EVENT_TYPE] === LCM_EVENT_TYPE_MAP.SETTLE || // 结算
      record[LEG_FIELD.LCM_EVENT_TYPE] === LCM_EVENT_TYPE_MAP.UNWIND // 平仓
    ) {
      return false;
    }

    // 未结算：持仓状态 != 到期 or 行权 or 结算 or 平仓
    if (record[LEG_FIELD.PRODUCT_TYPE] === LEG_TYPE_MAP.VANILLA_EUROPEAN) {
      const expirationDate = get(record, `asset.${LEG_FIELD.EXPIRATION_DATE}`);
      if (moment(expirationDate).isAfter(moment().format('YYYY-MM-DD'))) {
        return false;
      }
    }
    return true;
  };

  const handleRowSelectChange = selectedRowKeys => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const getFooter = () => {
    if (fetched) {
      return (
        <Row type="flex" gutter={10} justify="end">
          <Col>
            <Button onClick={() => setModalVisible(false)}>关闭</Button>
          </Col>
          <Col>
            <Button type="primary" onClick={() => fetch()}>
              刷新
            </Button>
          </Col>
        </Row>
      );
    }

    if (settLoading) {
      return (
        <Row type="flex" gutter={10} justify="end">
          <Button type="primary" loading={true}>
            结算中
          </Button>
        </Row>
      );
    }

    return (
      <Row type="flex" gutter={10} justify="end">
        <Col>
          <Button
            onClick={() => {
              setModalVisible(false);
            }}
          >
            取消
          </Button>
        </Col>
        <Col>
          <Button
            type="primary"
            onClick={() => {
              settlement();
            }}
          >
            批量结算所选持仓
          </Button>
        </Col>
      </Row>
    );
  };

  return (
    <Modal
      destroyOnClose={true}
      title="批量结算"
      width={1300}
      visible={modalVisible}
      onCancel={() => {
        setModalVisible(false);
      }}
      footer={getFooter()}
    >
      <Loading loading={loading}>
        <SmartTable
          ref={node => (tableEl.current = node)}
          rowSelection={{
            selectedRowKeys,
            onChange: handleRowSelectChange,
            getCheckboxProps: record => ({
              disabled: !canSett(record),
            }),
          }}
          onCellEditingChanged={({ record, rowIndex, dataIndex, rowId }) => {
            if (dataIndex === LEG_FIELD.UNDERLYER_PRICE) {
              preSettlement(record);
            }
          }}
          onCellFieldsChange={({ record, rowIndex, value, rowId, changedFields, allFields }) => {
            setTableData(pre => {
              return pre.map(item => {
                if (item[POSITION_ID] === rowId) {
                  return {
                    ...item,
                    ...changedFields,
                  };
                }
                return item;
              });
            });
          }}
          pagination={false}
          rowKey={POSITION_ID}
          dataSource={tableData}
          scroll={{ x: 2000 }}
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
              dataIndex: `asset.${LEG_FIELD.DIRECTION}`,
              render: val => DIRECTION_ZHCN_MAP[val],
            },
            {
              title: '涨/跌',
              dataIndex: `asset.${LEG_FIELD.OPTION_TYPE}`,
              render: val => OPTION_TYPE_ZHCN_MAP[val],
            },
            {
              title: '期权类型',
              width: 100,
              dataIndex: LEG_FIELD.PRODUCT_TYPE,
              render: val => PRODUCTTYPE_ZHCH_MAP[val],
            },
            {
              title: '行权价',
              align: 'right',
              dataIndex: `asset.${LEG_FIELD.STRIKE}`,
              render: (val, record) => {
                if (val == null) return null;
                if (_.get(record, `asset.${LEG_FIELD.STRIKE_TYPE}`) === STRIKE_TYPES_MAP.CNY) {
                  return formatMoney(val, {
                    unit: '￥',
                  });
                }
                return `${new BigNumber(val).multipliedBy(100).toNumber()}%`;
              },
            },
            {
              title: '到期日',
              width: 150,
              dataIndex: `asset.${LEG_FIELD.EXPIRATION_DATE}`,
              render: (value, record, index, { form, editing }) => {
                return value;
              },
            },
            {
              title: '标的物',
              fixed: 'right',
              width: 150,
              dataIndex: `asset.${LEG_FIELD.UNDERLYER_INSTRUMENT_ID}`,
            },
            {
              title: '结算方式',
              fixed: 'right',
              width: 100,
              dataIndex: `asset.${LEG_FIELD.SPECIFIED_PRICE}`,
              render: val => SPECIFIED_PRICE_ZHCN_MAP[val],
            },
            {
              title: '标的物结算价格',
              fixed: 'right',
              align: 'right',
              width: 150,
              editable: record => {
                return canSett(record);
              },
              dataIndex: LEG_FIELD.UNDERLYER_PRICE,
              render: (val, record, index, { form, editing }) => {
                if (!canSett(record)) {
                  return null;
                }
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      rules: [getRequiredRule()],
                    })(<InputNumber autoFocus={true} editing={editing} />)}
                  </FormItem>
                );
              },
            },
            {
              title: '结算金额',
              fixed: 'right',
              align: 'right',
              width: 150,
              editable: record => {
                return canSett(record);
              },
              dataIndex: LEG_FIELD.SETTLE_AMOUNT,
              render: (val, record, index, { form, editing }) => {
                if (!canSett(record)) {
                  return null;
                }
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      rules: [getRequiredRule()],
                    })(
                      <SettleInputNumber
                        editing={editing}
                        onReload={async () => {
                          const error = await preSettlement(record);
                          if (error) return;
                          message.success('刷新试结算成功');
                        }}
                      />
                    )}
                  </FormItem>
                );
              },
            },
            {
              title: '结算状态',
              fixed: 'right',
              width: 150,
              dataIndex: LEG_FIELD.SETTLE_STATUS,
              render: (val, record, dataIndex) => {
                if (canSett(record)) {
                  return '可结算';
                }
                if (record[ALREADY]) {
                  return '已结算';
                }
                return '无法结算';
              },
            },
          ]}
        />
        <Row type="flex" justify="end" style={{ marginTop: 15 }}>
          <Pagination
            {...{
              size: 'small',
              pageSize: pagination.pageSize,
              current: pagination.current,
              onChange,
              total: pagination.total,
              simple: true,
            }}
          />
        </Row>
      </Loading>
    </Modal>
  );
};

export default memo<any>(
  connect(state => {
    return {
      currentUser: state.user.currentUser,
    };
  })(Settlement)
);
