import { Form2, Input, Loading, Select } from '@/components';
import {
  DIRECTION_OPTIONS,
  DIRECTION_TYPE_ZHCN_MAP,
  EXPIRE_NO_BARRIER_PREMIUM_TYPE_ZHCN_MAP,
  LEG_FIELD,
  NOTIONAL_AMOUNT_TYPE_MAP,
  OPTION_TYPE_OPTIONS,
  PRODUCTTYPE_OPTIONS,
  PRODUCTTYPE_ZHCH_MAP,
  STRIKE_TYPES_MAP,
  FROM_HISTORY_PRICING_TAG,
} from '@/constants/common';
import { TRADESCOLDEFS_LEG_FIELD_MAP, VERTICAL_GUTTER } from '@/constants/global';
import Page from '@/containers/Page';
import { mktInstrumentSearch } from '@/services/market-data-service';
import { quotePrcPositionDelete, quotePrcSearchPaged } from '@/services/trade-service';
import styles from '@/styles/index.less';
import { formatMoney } from '@/tools';
import {
  DatePicker,
  Divider,
  notification,
  Pagination,
  Popconfirm,
  Row,
  Table,
  Timeline,
} from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import TimelineItem from 'antd/lib/timeline/TimelineItem';
import _ from 'lodash';
import { isMoment } from 'moment';
import React, { useState, memo } from 'react';
import useLifecycles from 'react-use/lib/useLifecycles';
import { connect } from 'dva';
import router from 'umi/router';
import { refSimilarLegalNameList } from '@/services/reference-data-service';

const RANGE_DATE_KEY = 'RANGE_DATE_KEY';

const TradeManagementPricingManagement = props => {
  const [searchFormData, setSearchFormData] = useState({});
  const { tableDataSource, dispatch } = props;
  const setTableDataSource = next => {
    dispatch({
      type: 'tradeManagementPricingManagement/setTableDataSource',
      payload: next,
    });
  };
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [loading, setLoading] = useState(false);

  const [pageSizeCurrent, setPageSizeCurrent] = useState(1);

  const onTradeTableSearch = async (params = {}) => {
    const { paramsPagination, paramsSearchFormData } = params as any;
    const newFormData = Form2.getFieldsValue(paramsSearchFormData || searchFormData);
    const formatValues = _.reduce(
      _.mapValues(newFormData, (val, key) => {
        if (isMoment(val)) {
          return val.format('YYYY-MM-DD');
        }
        return val;
      }),
      (prev, curr, key) => {
        if (key === RANGE_DATE_KEY) {
          const [expirationStartDate, expirationEndDate] = curr;
          prev.expirationStartDate = isMoment(expirationStartDate)
            ? expirationStartDate.format('YYYY-MM-DD')
            : expirationStartDate;
          prev.expirationEndDate = isMoment(expirationEndDate)
            ? expirationEndDate.format('YYYY-MM-DD')
            : expirationEndDate;
        } else {
          prev[key] = curr;
        }
        return prev;
      },
      {}
    );

    setLoading(true);

    const { error, data } = await quotePrcSearchPaged({
      page: (paramsPagination || pagination).current - 1,
      pageSize: (paramsPagination || pagination).pageSize,
      ...formatValues,
    });

    setLoading(false);

    if (error) return;
    if (_.isEmpty(data)) return;

    const tableDataSource = _.flatten(
      data.page.map(item => {
        return item.quotePositions.map((node, key) => {
          return {
            ...node,
            ...item,
            ...(item.quotePositions.length > 1 ? { style: { background: '#f2f4f5' } } : null),
            ...(item.quotePositions.length <= 1
              ? null
              : key === 0
              ? { timeLineNumber: item.quotePositions.length }
              : null),
          };
        });
      })
    );

    setTableDataSource(tableDataSource);
    setPagination({
      ...pagination,
      ...paramsPagination,
      total: data.totalCount,
    });
    setPageSizeCurrent((paramsPagination || pagination).pageSize);
  };

  const onPagination = (current, pageSize) => {
    onTradeTableSearch({
      paramsPagination: {
        current,
        pageSize,
      },
    });
  };

  const handlePaninationChange = (current, pageSize) => {
    onPagination(current, pageSize);
  };

  const handleShowSizeChange = (current, pageSize) => {
    onPagination(current, pageSize);
  };

  useLifecycles(() => {
    onTradeTableSearch();
  });

  return (
    <Page back={true}>
      <Form2
        submitText="搜索"
        onSubmitButtonClick={() => {
          onTradeTableSearch();
        }}
        onResetButtonClick={() => {
          setSearchFormData({});
          onTradeTableSearch({
            paramsSearchFormData: {},
          });
        }}
        onFieldsChange={(props, changedFields, allFields) => {
          setSearchFormData({
            ...searchFormData,
            ...changedFields,
          });
        }}
        dataSource={searchFormData}
        layout="inline"
        columns={[
          {
            title: '交易对手',
            dataIndex: 'counterPartyCode',
            render: (val, record, index, { form }) => {
              return (
                <FormItem>
                  {form.getFieldDecorator()(
                    <Select
                      {...{
                        style: {
                          width: '180px',
                        },
                        editing: true,
                        fetchOptionsOnSearch: true,
                        showSearch: true,
                        placeholder: '请输入内容搜索',
                        options: async (value: string = '') => {
                          const { data, error } = await refSimilarLegalNameList({
                            similarLegalName: value,
                          });
                          if (error) return [];
                          return data.map(item => ({
                            label: item,
                            value: item,
                          }));
                        },
                      }}
                    />
                  )}
                </FormItem>
              );
            },
          },
          {
            title: '标的物',
            dataIndex: LEG_FIELD.UNDERLYER_INSTRUMENT_ID,
            render: (value, record, index, { form, editing }) => {
              return (
                <FormItem>
                  {form.getFieldDecorator({})(
                    <Select
                      style={{ minWidth: 180 }}
                      placeholder="请输入内容搜索"
                      allowClear={true}
                      showSearch={true}
                      fetchOptionsOnSearch={true}
                      options={async (value: string = '') => {
                        const { data, error } = await mktInstrumentSearch({
                          instrumentIdPart: value,
                        });
                        if (error) return [];
                        return data.slice(0, 50).map(item => ({
                          label: item,
                          value: item,
                        }));
                      }}
                    />
                  )}
                </FormItem>
              );
            },
          },
          {
            title: '期权类型',
            dataIndex: 'productType',
            render: (value, record, index, { form, editing }) => {
              return (
                <FormItem>
                  {form.getFieldDecorator({})(
                    <Select
                      style={{ minWidth: 180 }}
                      placeholder="请输入内容搜索"
                      allowClear={true}
                      showSearch={true}
                      fetchOptionsOnSearch={true}
                      options={PRODUCTTYPE_OPTIONS}
                    />
                  )}
                </FormItem>
              );
            },
          },
          {
            title: '日期范围',
            dataIndex: RANGE_DATE_KEY,
            render: (value, record, index, { form, editing }) => {
              return <FormItem>{form.getFieldDecorator({})(<DatePicker.RangePicker />)}</FormItem>;
            },
          },
          {
            title: '涨/跌',
            dataIndex: LEG_FIELD.OPTION_TYPE,
            render: (value, record, index, { form, editing }) => {
              return (
                <FormItem>
                  {form.getFieldDecorator({})(
                    <Select
                      style={{ minWidth: 180 }}
                      placeholder="请选择"
                      allowClear={true}
                      showSearch={true}
                      options={OPTION_TYPE_OPTIONS}
                    />
                  )}
                </FormItem>
              );
            },
          },
          {
            title: '买卖方向',
            dataIndex: LEG_FIELD.DIRECTION,
            render: (value, record, index, { form, editing }) => {
              return (
                <FormItem>
                  {form.getFieldDecorator({})(
                    <Select
                      style={{ minWidth: 180 }}
                      placeholder="请选择内容"
                      allowClear={true}
                      showSearch={true}
                      options={DIRECTION_OPTIONS}
                    />
                  )}
                </FormItem>
              );
            },
          },
          {
            title: '备注',
            dataIndex: LEG_FIELD.COMMENT,
            render: (value, record, index, { form, editing }) => {
              return (
                <FormItem>
                  {form.getFieldDecorator({})(<Input placeholder="请输入内容" />)}
                </FormItem>
              );
            },
          },
        ]}
      />
      <Divider />
      <div style={{ marginTop: VERTICAL_GUTTER }}>
        <Loading loading={loading}>
          <Table
            size="middle"
            pagination={false}
            rowKey={'uuid'}
            scroll={{ x: 2500 }}
            dataSource={tableDataSource}
            columns={[
              {
                title: '期权类型',
                dataIndex: 'productType',
                width: 150,
                fixed: 'left',
                onCell: record => {
                  return {
                    style: { paddingLeft: '20px' },
                  };
                },
                onHeaderCell: record => {
                  return {
                    style: { paddingLeft: '20px' },
                  };
                },
                render: (text, record, index) => {
                  if (record.timeLineNumber) {
                    return (
                      <span style={{ position: 'relative' }}>
                        {PRODUCTTYPE_ZHCH_MAP[text] || '--'}
                        <Timeline
                          style={{ position: 'absolute', left: '-20px', top: '5px' }}
                          className={styles.timelines}
                        >
                          {record.quotePositions.map((item, index) => {
                            return (
                              <TimelineItem
                                style={{
                                  paddingBottom:
                                    index === record.quotePositions.length - 1 ? 0 : 46,
                                }}
                                key={index}
                              />
                            );
                          })}
                        </Timeline>
                      </span>
                    );
                  }
                  return <span>{PRODUCTTYPE_ZHCH_MAP[text] || '--'}</span>;
                },
              },
              {
                title: '买/卖',
                dataIndex: 'direction',
                width: 150,
                render: (text, record, index) => {
                  return DIRECTION_TYPE_ZHCN_MAP[text];
                },
              },
              {
                title: '标的物',
                dataIndex: 'asset.underlyerInstrumentId',
                width: 150,
                // width: 150,
              },
              {
                title: '期初价格（￥）',
                dataIndex: `asset.${LEG_FIELD.INITIAL_SPOT}`,
                width: 150,
              },
              {
                title: '涨/跌',
                dataIndex: 'asset.optionType',
                width: 150,
                // width: 60,
                render: (text, record, index) => {
                  return EXPIRE_NO_BARRIER_PREMIUM_TYPE_ZHCN_MAP[text];
                },
              },
              {
                title: '起始日',
                dataIndex: LEG_FIELD.EFFECTIVE_DATE,
                width: 150,
              },
              {
                title: '到期日',
                dataIndex: LEG_FIELD.EXPIRATION_DATE,
                width: 150,
              },
              {
                title: '行权价',
                dataIndex: `asset.${LEG_FIELD.STRIKE}`,
                width: 150,
                render: (val, record) => {
                  if (val == null) return null;
                  if (record[LEG_FIELD.STRIKE_TYPE] === STRIKE_TYPES_MAP.CNY) {
                    return formatMoney(val, {
                      unit: '￥',
                    });
                  }
                  return `${val}%`;
                },
              },
              {
                title: '名义本金',
                dataIndex: `asset.${LEG_FIELD.NOTIONAL_AMOUNT}`,
                width: 150,
                render: (val, record) => {
                  if (val == null) return null;
                  if (record[LEG_FIELD.NOTIONAL_AMOUNT_TYPE] === NOTIONAL_AMOUNT_TYPE_MAP.CNY) {
                    return formatMoney(val, {
                      unit: '￥',
                    });
                  }
                  return `${val}手`;
                },
              },
              {
                title: 'vol（%）',
                dataIndex: TRADESCOLDEFS_LEG_FIELD_MAP.VOL,
                width: 150,
                render: (val, record) => {
                  return val;
                },
              },
              {
                title: 'r（%）',
                dataIndex: TRADESCOLDEFS_LEG_FIELD_MAP.R,
                width: 150,
                render: (val, record) => {
                  return val;
                },
              },
              {
                title: 'q（%）',
                dataIndex: TRADESCOLDEFS_LEG_FIELD_MAP.Q,
                width: 150,
                render: (val, record) => {
                  return val;
                },
              },
              {
                title: '备注',
                dataIndex: LEG_FIELD.COMMENT,
                render: (val, record) => {
                  return val;
                },
              },
              {
                title: '操作',
                dataIndex: 'action',
                width: 150,
                fixed: 'right',
                render: (val, record) => {
                  return (
                    <div>
                      <a
                        href="javascript:;"
                        onClick={() => {
                          router.push({
                            pathname: '/trade-management/pricing',
                            query: {
                              from: FROM_HISTORY_PRICING_TAG,
                              id: record.uuid,
                            },
                          });
                        }}
                      >
                        复用
                      </a>
                      <Divider type="vertical" />
                      <Popconfirm
                        title="确认删除本条数据吗?"
                        onConfirm={async () => {
                          const { error, data } = await quotePrcPositionDelete({
                            uuid: record.uuid,
                          });
                          if (error) return;
                          notification.success({ message: '删除成功' });
                          setTimeout(() => {
                            onTradeTableSearch();
                          });
                        }}
                        okText="是"
                        cancelText="否"
                      >
                        <a href="javascript:;" style={{ color: 'red' }}>
                          删除
                        </a>
                      </Popconfirm>
                    </div>
                  );
                },
              },
            ]}
            onRow={record => {
              return record.style ? { style: record.style } : null;
            }}
          />
          <Row type="flex" justify="end" style={{ marginTop: 15 }}>
            <Pagination
              {...{
                size: 'small',
                showSizeChanger: true,
                onShowSizeChange: handleShowSizeChange,
                showQuickJumper: true,
                current: pagination.current,
                pageSize: pageSizeCurrent,
                onChange: handlePaninationChange,
                total: pagination.total,
              }}
            />
          </Row>
        </Loading>
      </div>
    </Page>
  );
};

export default memo(
  connect(state => {
    return {
      tableDataSource: state.tradeManagementPricingManagement.tableDataSource,
    };
  })(TradeManagementPricingManagement)
);
