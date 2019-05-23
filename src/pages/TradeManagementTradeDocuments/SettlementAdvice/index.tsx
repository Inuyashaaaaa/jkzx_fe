import SourceTable from '@/containers/SourceTable';
import { delay, mockData } from '@/tools';
import { trdTradeListByBook, trdTradeListBySimilarTradeId } from '@/services/general-service';
import { positionDocSearch, trdBookListBySimilarBookName } from '@/services/trade-service';
import _ from 'lodash';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { SEARCH_FORM_CONTROLS_SETTLE, SETTLE_COLUMN_DEFS, columns } from './constants';
import { Divider, Row, Table, DatePicker } from 'antd';
import { Form2, Select } from '@/containers';
import FormItem from 'antd/lib/form/FormItem';
import SettlementModal from './SettlementModal';
import { refSimilarLegalNameList } from '@/services/reference-data-service';

const { RangePicker } = DatePicker;
class SettlementAdvice extends PureComponent {
  public $sourceTable: SourceTable = null;

  public state = {
    loading: false,
    dataSource: [],
    searchFormData: {},
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      showQuickJumper: true,
      onChange: (page, pagesize) => this.onTablePaginationChange(page, pagesize),
      onShowSizeChange: (page, pagesize) => this.onTablePaginationChange(page, pagesize),
    },
    bookIdList: [],
    positionIdList: [],
  };

  public onTablePaginationChange = (page, pagesize) => {
    const { pagination } = this.state;
    this.setState(
      {
        pagination: {
          ...pagination,
          current: page,
          pageSize: pagesize,
        },
      },
      () => {
        this.onFetch({
          current: page,
          pageSize: pagesize,
        });
      }
    );
  };

  public componentDidMount = () => {
    let { searchFormData } = this.state;
    searchFormData = {
      ...searchFormData,
      ...Form2.createFields({ expirationDate: [moment().subtract(1, 'day'), moment()] }),
    };
    this.setState(
      {
        searchFormData,
      },
      () => {
        this.onFetch();
      }
    );
  };

  public getFormData = data => {
    return _.mapValues(data, item => {
      return _.get(item, 'value');
    });
  };

  public onFetch = async (paramsPagination?) => {
    const formValues = {
      startDate: _.get(this.state.searchFormData, 'expirationDate.value[0]').format('YYYY-MM-DD'),
      endDate: _.get(this.state.searchFormData, 'expirationDate.value[1]').format('YYYY-MM-DD'),
      ...this.getFormData(_.omit(this.state.searchFormData, 'expirationDate')),
    };
    const pagination = this.state.pagination;
    this.setState({
      loading: true,
    });
    const { error, data } = await positionDocSearch({
      page: (paramsPagination || pagination).current - 1,
      pageSize: (paramsPagination || pagination).pageSize,
      ...formValues,
    });
    this.setState({
      loading: false,
    });
    if (error) return;
    const dataSource = data.page.map(item => {
      return {
        ...item,
        status:
          item.docProcessStatus === 'UN_PROCESSED'
            ? '未处理'
            : item.docProcessStatus === 'DOWNLOADED'
            ? `下载 于 ${moment(item.updateAt).format('YYYY-MM-DD HH:mm')}`
            : `发送 于 ${moment(item.updateAt).format('YYYY-MM-DD HH:mm')}`,
      };
    });
    this.setState({
      dataSource,
      pagination: {
        ...pagination,
        ...paramsPagination,
        total: data.totalCount,
      },
    });
  };

  public onReset = () => {
    let { searchFormData } = this.state;
    searchFormData = {
      ...Form2.createFields({ expirationDate: [moment().subtract(1, 'day'), moment()] }),
    };
    this.setState(
      {
        searchFormData,
      },
      () => {
        this.onFetch({ current: 1, pageSize: 10 });
      }
    );
  };

  public onSearchFormChange = async (props, changedFields) => {
    if (changedFields.name === 'bookName' && changedFields.value) {
      const { error, data } = await trdTradeListByBook({
        bookName: changedFields.value,
      });
      if (error) return;
      this.setState({
        bookIdList: data,
        searchFormData: {
          ...this.state.searchFormData,
          ...changedFields,
        },
      });
      return;
    }
    if (changedFields.name === 'tradeId' && changedFields.value) {
      const { error, data } = await trdTradeListByBook({
        bookName: changedFields.value,
      });
      if (error) return;
      this.setState({
        positionIdList: data,
        searchFormData: {
          ...this.state.searchFormData,
          ...changedFields,
        },
      });
      return;
    }
    this.setState({
      bookIdList: [],
      positionIdList: [],
      searchFormData: {
        ...this.state.searchFormData,
        ...changedFields,
      },
    });
  };

  public onSearch = () => {
    this.onFetch({ current: 1, pageSize: 10 });
  };

  public render() {
    const { searchFormData } = this.state;
    console.log(this.state.positionIdList);
    return (
      <>
        <Form2
          ref={node => (this.$sourceTable = node)}
          layout="inline"
          dataSource={searchFormData}
          submitText={`搜索`}
          submitButtonProps={{
            icon: 'search',
          }}
          onSubmitButtonClick={this.onSearch}
          onResetButtonClick={this.onReset}
          onFieldsChange={this.onSearchFormChange}
          columns={[
            {
              title: '到期日',
              dataIndex: 'expirationDate',
              render: (value, record, index, { form, editing }) => {
                return <FormItem>{form.getFieldDecorator({})(<RangePicker />)}</FormItem>;
              },
            },
            {
              title: '结算通知书处理状态',
              dataIndex: 'docProcessStatus',
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
                        options={[
                          {
                            label: '未处理',
                            value: 'UN_PROCESSED',
                          },
                          {
                            label: '已下载',
                            value: 'DOWNLOADED',
                          },
                          {
                            label: '已发送',
                            value: 'SENT',
                          },
                        ]}
                      />
                    )}
                  </FormItem>
                );
              },
            },
            {
              title: '交易簿',
              dataIndex: 'bookName',
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
                        style={{ minWidth: 180 }}
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
              title: '持仓ID',
              dataIndex: 'positionId',
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
                        options={(this.state.positionIdList || []).map(item => {
                          return {
                            label: item,
                            value: item,
                          };
                        })}
                      />
                    )}
                  </FormItem>
                );
              },
            },
            {
              title: '交易对手',
              dataIndex: 'partyName',
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
          ]}
        />
        <Divider type="horizontal" />
        <Table
          dataSource={this.state.dataSource}
          columns={[
            {
              dataIndex: 'positionId',
              title: '持仓ID',
            },
            {
              dataIndex: 'tradeId',
              title: '所属交易ID',
            },
            {
              dataIndex: 'bookName',
              title: '所属交易簿',
            },
            {
              dataIndex: 'partyName',
              title: '交易对手',
            },
            {
              dataIndex: 'salesName',
              title: '销售',
            },
            {
              dataIndex: 'expirationDate',
              title: '到期日',
            },
            {
              dataIndex: 'status',
              title: '结算通知书处理状态',
            },
            {
              title: '操作',
              render: (text, record, index) => {
                return (
                  <Row type="flex" align="middle">
                    <SettlementModal data={text} onFetch={this.onFetch} />
                  </Row>
                );
              },
            },
          ]}
          pagination={this.state.pagination}
          loading={this.state.loading}
        />
        {/* <SourceTable
          rowKey="uuid"
          ref={node => (this.$sourceTable = node)}
          columnDefs={SETTLE_COLUMN_DEFS(this.onFetch)}
          searchFormControls={SEARCH_FORM_CONTROLS_SETTLE(
            this.state.bookIdList,
            this.state.positionIdList
          )}
          searchable={true}
          resetable={true}
          loading={this.state.loading}
          onSearchButtonClick={this.onSearch}
          onResetButtonClick={this.onReset}
          dataSource={this.state.dataSource}
          searchFormData={this.state.searchFormData}
          onSearchFormChange={this.onSearchFormChange}
          paginationProps={{
            backend: true,
          }}
          pagination={this.state.pagination}
          onPaginationChange={this.onTablePaginationChange}
          onPaginationShowSizeChange={this.onTablePaginationChange}
        /> */}
      </>
    );
  }
}

export default SettlementAdvice;
