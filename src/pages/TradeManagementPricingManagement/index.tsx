import React, { PureComponent, useState } from 'react';
import { Form2, Select, DatePicker, Input, Loading } from '@/components';
import FormItem from 'antd/lib/form/FormItem';
import { mktInstrumentSearch } from '@/services/market-data-service';
import {
  PRODUCTTYPE_OPTIONS,
  OPTION_TYPE_OPTIONS,
  DIRECTION_OPTIONS,
  LEG_FIELD,
  EXPIRE_NO_BARRIER_PREMIUM_TYPE_ZHCN_MAP,
  PRODUCTTYPE_ZHCH_MAP,
} from '@/constants/common';
import { VERTICAL_GUTTER } from '@/constants/global';
import { Table, Row, Divider, Pagination, Timeline } from 'antd';
import { formatMoney } from '@/tools';
import TimelineItem from 'antd/lib/timeline/TimelineItem';
import { trdTradeSearchIndexPaged } from '@/services/general-service';
import _ from 'lodash';
import { isMoment } from 'moment';

const TradeManagementPricingManagement = () => {
  const [searchFormData, setSearchFormData] = useState({});
  const [tableDataSource, setTableDataSource] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [loading, setLoading] = useState(false);

  const [pageSizeCurrent, setPageSizeCurrent] = useState(1);

  const onTradeTableSearch = async (paramsPagination?) => {
    const newFormData = Form2.getFieldsValue(searchFormData);
    const formatValues = _.mapValues(newFormData, (val, key) => {
      if (isMoment(val)) {
        return val.format('YYYY-MM-DD');
      }
      return val;
    });

    setLoading(true);

    const { error, data } = await trdTradeSearchIndexPaged({
      page: (paramsPagination || pagination).current - 1,
      pageSize: (paramsPagination || pagination).pageSize,
      ...formatValues,
    });

    setLoading(false);

    if (error) return;
    if (_.isEmpty(data)) return;

    const dataSource = data.page.map(item => {
      return [
        ...item.positions.map((node, key) => {
          return {
            ...item,
            ..._.omit(node, ['bookName']),
            ...node.asset,
            ...(item.positions.length > 1 ? { style: { background: '#f2f4f5' } } : null),
            ...(item.positions.length <= 1
              ? null
              : key === 0
              ? { timeLineNumber: item.positions.length }
              : null),
          };
        }),
      ];
    });

    const tableDataSource = _.reduce(
      dataSource,
      (result, next) => {
        return result.concat(next);
      },
      []
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
      current,
      pageSize,
    });
  };

  const handlePaninationChange = (current, pageSize) => {
    onPagination(current, pageSize);
  };

  const handleShowSizeChange = (current, pageSize) => {
    onPagination(current, pageSize);
  };

  return (
    <>
      <Form2
        onFieldsChange={(props, changedFields, allFields) => {
          this.setState({
            searchFormData: {
              ...searchFormData,
              ...changedFields,
            },
          });
        }}
        dataSource={searchFormData}
        layout="inline"
        columns={[
          {
            title: '标的物',
            dataIndex: 'instrumentId',
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
            title: '到期日',
            dataIndex: 'expirationDate',
            render: (value, record, index, { form, editing }) => {
              return <FormItem>{form.getFieldDecorator({})(<DatePicker />)}</FormItem>;
            },
          },
          {
            title: '看涨看跌',
            dataIndex: 'xxx',
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
            dataIndex: 'xx333x',
            render: (value, record, index, { form, editing }) => {
              return (
                <FormItem>
                  {form.getFieldDecorator({})(
                    <Select
                      style={{ minWidth: 180 }}
                      placeholder="请选择"
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
            dataIndex: 'xx3323423433x',
            render: (value, record, index, { form, editing }) => {
              return <FormItem>{form.getFieldDecorator({})(<Input />)}</FormItem>;
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
            rowKey={'positionId'}
            scroll={{ x: 2500 }}
            dataSource={tableDataSource}
            columns={[
              {
                title: '期权类型',
                dataIndex: 'productType',
                width: 100,
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
                          {record.positions.map((item, index) => {
                            return (
                              <TimelineItem
                                style={{
                                  paddingBottom: index === record.positions.length - 1 ? 0 : 46,
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
                width: 100,
                render: (text, record, index) => {
                  return DIRECTION_TYPE_ZHCN_MAP[text];
                },
              },
              {
                title: '标的物',
                dataIndex: 'underlyerInstrumentId',
                width: 100,
                // width: 150,
              },
              {
                title: '期初价格（￥）',
                dataIndex: LEG_FIELD.INITIAL_SPOT,
                width: 250,
              },
              {
                title: '涨/跌',
                dataIndex: 'optionType',
                width: 100,
                // width: 60,
                render: (text, record, index) => {
                  return EXPIRE_NO_BARRIER_PREMIUM_TYPE_ZHCN_MAP[text];
                },
              },
              {
                title: '起始日',
                dataIndex: 'expirationDate',
                width: 150,
              },
              {
                title: '到期日',
                dataIndex: 'expirationDate',
                width: 150,
              },
              {
                title: '行权价',
                dataIndex: LEG_FIELD.STRIKE,
                width: 150,
                render: val => {
                  return formatMoney(val, {
                    unit: 'xxxx',
                  });
                },
              },
              {
                title: '名义本金',
                dataIndex: LEG_FIELD.NOTIONAL_AMOUNT,
                width: 150,
                render: val => {
                  return formatMoney(val, {
                    unit: 'xxxx',
                  });
                },
              },
              {
                title: 'vol,r,p(%)',
                dataIndex: LEG_FIELD.NOTIONAL_AMOUNT,
                width: 150,
                render: (val, record) => {
                  return [record.vol, record.r, record.p].map(item => item || '--').join(', ');
                },
              },
              {
                title: '备注',
                dataIndex: LEG_FIELD.NOTIONAL_AMOUNT,
                width: 150,
                render: (val, record) => {
                  return [record.vol, record.r, record.p].map(item => item || '--').join(', ');
                },
              },
              {
                title: '操作',
                dataIndex: 'action',
                width: 150,
                render: (val, record) => {
                  return (
                    <div>
                      <a href="javascript:;">复用</a>
                      <Divider type="vertical" />
                      <a href="javascript:;" style={{ color: 'red' }}>
                        删除
                      </a>
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
    </>
  );
};

export default TradeManagementPricingManagement;
