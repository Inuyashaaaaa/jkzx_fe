import {
  BOOK_NAME_FIELD,
  LCM_EVENT_TYPE_OPTIONS,
  PRODUCT_TYPE_OPTIONS,
  PRODUCTTYPE_OPTIONS,
} from '@/constants/common';
import { VERTICAL_GUTTER } from '@/constants/global';
import { Form2, Select, Table2 } from '@/design/components';
import { trdTradeListBySimilarTradeId, trdTradeSearchIndexPaged } from '@/services/general-service';
import { mktInstrumentSearch } from '@/services/market-data-service';
import {
  refSimilarLegalNameList,
  refSimilarSalesNameList,
} from '@/services/reference-data-service';
import {
  trdBookListBySimilarBookName,
  trdPortfolioListBySimilarPortfolioName,
} from '@/services/trade-service';
import { Card, DatePicker, Divider } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import { isMoment } from 'moment';
import React, { PureComponent } from 'react';
import { BOOKING_TABLE_COLUMN_DEFS } from '../constants';

class CommonModel extends PureComponent<{ status: any }> {
  public $table2: Table2 = null;

  public status: any;

  public state = {
    loading: false,
    searchFormData: {},
    bookIdList: [],
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
    pageSize: 0,
    bookList: [],
    tableDataSource: [],
  };

  public componentDidMount = () => {
    this.status = this.props.status;
    this.onTradeTableSearch();
  };

  public onSearch = ({ domEvent }) => {
    domEvent.preventDefault();
    this.onTradeTableSearch({ current: 1, pageSize: 10 });
  };

  public search = () => {
    this.onTradeTableSearch();
  };

  public getFormData = () => {
    return _.mapValues(this.state.searchFormData, item => {
      return _.get(item, 'value');
    });
  };

  public onTradeTableSearch = async (paramsPagination?) => {
    this.setState({
      loading: true,
    });
    const { searchFormData, pagination } = this.state;
    const newFormData = this.getFormData();
    const formatValues = _.mapValues(newFormData, (val, key) => {
      if (isMoment(val)) {
        return val.format('YYYY-MM-DD');
      }
      return val;
    });

    this.setState({ loading: true });
    const { error, data } = await trdTradeSearchIndexPaged({
      page: (paramsPagination || pagination).current - 1,
      pageSize: (paramsPagination || pagination).pageSize,
      ...formatValues,
      ...(this.status ? { status: this.status } : null),
    });
    this.setState({ loading: false });

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

    this.setState({
      tableDataSource,
      pagination: {
        ...pagination,
        ...paramsPagination,
        total: data.totalCount,
      },
      pageSize: tableDataSource.length,
    });
  };

  public onFieldsChange = (props, changedFields, allFields) => {
    console.log(allFields);
    this.setState(
      {
        searchFormData: allFields,
      },
      () => {
        console.log(this.state.searchFormData);
      }
    );
  };

  //   public onShowSizeChange = (current, pageSize) => {
  //     this.onPagination(current, pageSize);
  //   };

  public onChange = (current, pageSize) => {
    this.onPagination(current, pageSize);
  };

  public onPagination = (current, pageSize) => {
    this.setState(
      {
        pagination: {
          current,
          pageSize,
        },
      },
      () => {
        this.onTradeTableSearch();
      }
    );
  };

  public onReset = event => {
    this.setState(
      {
        searchFormData: {},
        bookIdList: [],
      },
      () => {
        this.onTradeTableSearch({ current: 1, pageSize: 10 });
      }
    );
  };

  public render() {
    return (
      <>
        <Form2
          ref={node => (this.$table2 = node)}
          layout="inline"
          dataSource={this.state.searchFormData}
          submitText="查询"
          submitButtonProps={{
            icon: 'search',
          }}
          onSubmitButtonClick={this.onSearch}
          onResetButtonClick={this.onReset}
          onFieldsChange={this.onFieldsChange}
          columns={[
            {
              title: '交易簿',
              dataIndex: BOOK_NAME_FIELD,
              render: (value, record, index, { form, editing }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({})(
                      <Select
                        placeholder="请输入内容搜索"
                        allowClear={true}
                        showSearch={true}
                        fetchOptionsOnSearch={true}
                        options={async (value: string = '') => {
                          const { data, error } = await trdBookListBySimilarBookName({
                            similarBookName: value,
                          });
                          if (error) return [];
                          return data
                            .sort((a, b) => {
                              return a.localeCompare(b);
                            })
                            .map(item => ({
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
              title: '交易ID',
              dataIndex: 'tradeId',
              render: (value, record, index, { form, editing }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({})(
                      <Select
                        placeholder="请输入内容搜索"
                        allowClear={true}
                        showSearch={true}
                        fetchOptionsOnSearch={true}
                        options={
                          this.state.bookIdList.length
                            ? this.state.bookIdList.map(item => {
                                return {
                                  label: item,
                                  value: item,
                                };
                              })
                            : async (value: string = '') => {
                                const { data, error } = await trdTradeListBySimilarTradeId({
                                  similarTradeId: value,
                                });
                                if (error) return [];
                                return data.map(item => ({
                                  label: item,
                                  value: item,
                                }));
                              }
                        }
                      />
                    )}
                  </FormItem>
                );
              },
            },
            {
              title: '交易对手',
              dataIndex: 'counterPartyName',
              render: (value, record, index, { form, editing }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({})(
                      <Select
                        placeholder="请输入内容搜索"
                        allowClear={true}
                        showSearch={true}
                        fetchOptionsOnSearch={true}
                        options={async (value: string = '') => {
                          const { data, error } = await refSimilarLegalNameList({
                            similarLegalName: value,
                          });
                          if (error) return [];
                          return data.map(item => ({
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
              title: '销售',
              dataIndex: 'salesName',
              render: (value, record, index, { form, editing }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({})(
                      <Select
                        placeholder="请输入内容搜索"
                        allowClear={true}
                        showSearch={true}
                        fetchOptionsOnSearch={true}
                        options={async (value: string = '') => {
                          const { data, error } = await refSimilarSalesNameList({
                            similarSalesName: value,
                          });
                          if (error) return [];
                          return data.map(item => ({
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
              title: '投资组合',
              dataIndex: 'portfolioNames',
              render: (value, record, index, { form, editing }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({})(
                      <Select
                        placeholder="请输入内容搜索"
                        allowClear={true}
                        showSearch={true}
                        mode="multiple"
                        fetchOptionsOnSearch={true}
                        options={async (value: string = '') => {
                          const { data, error } = await trdPortfolioListBySimilarPortfolioName({
                            similarPortfolioName: value,
                          });
                          if (error) return [];
                          return data.map(item => ({
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
              title: '标的物',
              dataIndex: 'instrumentId',
              render: (value, record, index, { form, editing }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({})(
                      <Select
                        placeholder="请输入内容搜索"
                        allowClear={true}
                        showSearch={true}
                        fetchOptionsOnSearch={true}
                        options={async (value: string = '') => {
                          const { data, error } = await mktInstrumentSearch({
                            instrumentIdPart: value,
                          });
                          if (error) return [];
                          return data.map(item => ({
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
              title: '交易日',
              dataIndex: 'tradeDate',
              render: (value, record, index, { form, editing }) => {
                return <FormItem>{form.getFieldDecorator({})(<DatePicker />)}</FormItem>;
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
              title: '持仓状态',
              dataIndex: 'lcmEventType',
              render: (value, record, index, { form, editing }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({})(
                      <Select
                        placeholder="请输入内容搜索"
                        allowClear={true}
                        showSearch={true}
                        fetchOptionsOnSearch={true}
                        options={LCM_EVENT_TYPE_OPTIONS}
                      />
                    )}
                  </FormItem>
                );
              },
            },
          ]}
        />
        <Divider />
        <div style={{ marginTop: VERTICAL_GUTTER }}>
          <Table2
            size="middle"
            pagination={{
              position: 'bottom',
              //   showSizeChanger: true,
              //   onShowSizeChange: this.onShowSizeChange,
              showQuickJumper: true,
              current: this.state.pagination.current,
              pageSize: this.state.pageSize,
              onChange: this.onChange,
              total: this.state.pagination.total,
            }}
            rowKey={'positionId'}
            loading={this.state.loading}
            dataSource={this.state.tableDataSource}
            columns={BOOKING_TABLE_COLUMN_DEFS(this.search)}
            onRow={record => {
              return record.style ? { style: record.style } : null;
            }}
          />
        </div>
      </>
    );
  }
}

export default CommonModel;
