import { DatePicker, Divider, Pagination, Row, Table } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { connect } from 'dva';
import _ from 'lodash';
import { isMoment } from 'moment';
import React, { PureComponent } from 'react';
import { Form2, Loading, Select, Table2, SmartTable } from '@/containers';
import { BOOK_NAME_FIELD, LCM_EVENT_TYPE_OPTIONS, PRODUCTTYPE_OPTIONS } from '@/constants/common';
import { VERTICAL_GUTTER } from '@/constants/global';
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
import { BOOKING_TABLE_COLUMN_DEFS } from '../../tools';
import SmartForm from '@/containers/SmartForm';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/component';
import { showTotal } from '@/tools/component';

class CommonModel extends PureComponent<any> {
  public $table2: Table2 = null;

  public state = {
    loading: false,
    searchFormData: {},
    bookIdList: [],
    searchForm: {},
  };

  public componentDidMount = () => {
    const { preLocation, modify } = this.props;
    if (
      preLocation &&
      preLocation.pathname === '/trade-management/book-edit' &&
      this.props.entryTabKey === this.props.name
    ) {
      if (modify) {
        const { activeTabKey } = this.props;
        const { pagination } = this.props[activeTabKey];
        this.onTradeTableSearch(pagination);
        return this.props.dispatch({
          type: 'tradeManagementContractManage/modify',
          payload: false,
        });
      }
      return this.props.dispatch({
        type: 'tradeManagementContractManage/setEntryTabKey',
        payload: null,
      });
    }
    return this.onTradeTableSearch({ current: 1, pageSize: PAGE_SIZE });
  };

  public onSearch = ({ domEvent }) => {
    domEvent.preventDefault();
    const { searchFormData } = this.state;
    this.setState({
      searchForm: searchFormData,
    });
    this.onTradeTableSearch({ current: 1, pageSize: PAGE_SIZE });
  };

  public search = () => {
    this.onTradeTableSearch();
  };

  public getFormData = data => _.mapValues(data, item => _.get(item, 'value'));

  public onTradeTableSearch = async (paramsPagination = undefined, searchForm) => {
    const { searchFormData } = this.state;
    const { activeTabKey } = this.props;
    const { pagination } = this.props[activeTabKey];
    const newFormData = this.getFormData(searchForm || searchFormData);
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
      status: this.props.status,
    });
    this.setState({ loading: false });

    if (error) return;
    if (_.isEmpty(data)) return;

    const tableDataSource = _.flatten(
      data.page.map(item =>
        item.positions.map((node, key) => ({
          ...node,
          ...item,
          ...(item.positions.length > 1 ? { style: { background: '#f2f4f5' } } : null),
          ...(item.positions.length > 1 && key === 0
            ? { timeLineNumber: item.positions.length }
            : null),
        })),
      ),
    );

    const { dispatch, name } = this.props;
    dispatch({
      type: 'tradeManagementContractManage/save',
      payload: {
        activeTabKey: name,
        tableDataSource,
        pagination: {
          ...pagination,
          ...paramsPagination,
          total: data.totalCount,
        },
      },
    });
  };

  public onFieldsChange = (props, changedFields, allFields) => {
    this.setState(state => ({
      searchFormData: {
        ...state.searchFormData,
        ...changedFields,
      },
    }));
  };

  public onShowSizeChange = (current, pageSize) => {
    this.onPagination(current, pageSize);
  };

  public onChange = (current, pageSize) => {
    this.onPagination(current, pageSize);
  };

  public onPagination = (current, pageSize) => {
    this.onTradeTableSearch(
      {
        current,
        pageSize,
      },
      this.state.searchForm,
    );
  };

  public onReset = event => {
    this.setState(
      {
        searchFormData: {},
        bookIdList: [],
      },
      () => {
        this.onTradeTableSearch({ current: 1, pageSize: PAGE_SIZE });
      },
    );
  };

  public status: any;

  public render() {
    const { activeTabKey } = this.props;
    const { tableDataSource, pagination, collapse } = this.props[activeTabKey];
    return (
      <>
        <SmartForm
          spread={3}
          onCollapseChange={next => {
            this.props.dispatch({
              type: 'tradeManagementContractManage/changeCollapse',
              payload: {
                activeTabKey,
                collapse: next,
              },
            });
          }}
          collapse={collapse}
          ref={node => {
            this.$table2 = node;
          }}
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
              render: (value, record, index, { form, editing }) => (
                <FormItem>
                  {form.getFieldDecorator({})(
                    <Select
                      style={{ minWidth: 180 }}
                      placeholder="请输入内容搜索"
                      allowClear
                      showSearch
                      fetchOptionsOnSearch
                      options={async (values: string = '') => {
                        const { data, error } = await trdBookListBySimilarBookName({
                          similarBookName: values,
                        });
                        if (error) return [];
                        return data
                          .sort((a, b) => a.localeCompare(b))
                          .map(item => ({
                            label: item,
                            value: item,
                          }));
                      }}
                    />,
                  )}
                </FormItem>
              ),
            },
            {
              title: '交易ID',
              dataIndex: 'tradeId',
              render: (value, record, index, { form, editing }) => (
                <FormItem>
                  {form.getFieldDecorator({})(
                    <Select
                      style={{ minWidth: 180 }}
                      placeholder="请输入内容搜索"
                      allowClear
                      showSearch
                      fetchOptionsOnSearch
                      options={
                        this.state.bookIdList.length
                          ? this.state.bookIdList.map(item => ({
                              label: item,
                              value: item,
                            }))
                          : async (values: string = '') => {
                              const { data, error } = await trdTradeListBySimilarTradeId({
                                similarTradeId: values,
                              });
                              if (error) return [];
                              return data.map(item => ({
                                label: item,
                                value: item,
                              }));
                            }
                      }
                    />,
                  )}
                </FormItem>
              ),
            },
            {
              title: '交易对手',
              dataIndex: 'counterPartyName',
              render: (value, record, index, { form, editing }) => (
                <FormItem>
                  {form.getFieldDecorator({})(
                    <Select
                      style={{ minWidth: 180 }}
                      placeholder="请输入内容搜索"
                      allowClear
                      showSearch
                      fetchOptionsOnSearch
                      options={async (values: string = '') => {
                        const { data, error } = await refSimilarLegalNameList({
                          similarLegalName: values,
                        });
                        if (error) return [];
                        return data.map(item => ({
                          label: item,
                          value: item,
                        }));
                      }}
                    />,
                  )}
                </FormItem>
              ),
            },
            {
              title: '销售',
              dataIndex: 'salesName',
              render: (value, record, index, { form, editing }) => (
                <FormItem>
                  {form.getFieldDecorator({})(
                    <Select
                      style={{ minWidth: 180 }}
                      placeholder="请输入内容搜索"
                      allowClear
                      showSearch
                      fetchOptionsOnSearch
                      options={async (values: string = '') => {
                        const { data, error } = await refSimilarSalesNameList({
                          similarSalesName: values,
                        });
                        if (error) return [];
                        return data.map(item => ({
                          label: item,
                          value: item,
                        }));
                      }}
                    />,
                  )}
                </FormItem>
              ),
            },
            {
              title: '投资组合',
              dataIndex: 'portfolioNames',
              render: (value, record, index, { form, editing }) => (
                <FormItem>
                  {form.getFieldDecorator({})(
                    <Select
                      style={{ minWidth: 180 }}
                      placeholder="请输入内容搜索"
                      allowClear
                      showSearch
                      mode="multiple"
                      fetchOptionsOnSearch
                      options={async (values: string = '') => {
                        const { data, error } = await trdPortfolioListBySimilarPortfolioName({
                          similarPortfolioName: values,
                        });
                        if (error) return [];
                        return data.map(item => ({
                          label: item,
                          value: item,
                        }));
                      }}
                    />,
                  )}
                </FormItem>
              ),
            },
            {
              title: '标的物',
              dataIndex: 'instrumentId',
              render: (value, record, index, { form, editing }) => (
                <FormItem>
                  {form.getFieldDecorator({})(
                    <Select
                      style={{ minWidth: 180 }}
                      placeholder="请输入内容搜索"
                      allowClear
                      showSearch
                      fetchOptionsOnSearch
                      options={async (values: string = '') => {
                        const { data, error } = await mktInstrumentSearch({
                          instrumentIdPart: values,
                        });
                        if (error) return [];
                        return data.slice(0, 50).map(item => ({
                          label: item,
                          value: item,
                        }));
                      }}
                    />,
                  )}
                </FormItem>
              ),
            },
            {
              title: '期权类型',
              dataIndex: 'productType',
              render: (value, record, index, { form, editing }) => (
                <FormItem>
                  {form.getFieldDecorator({})(
                    <Select
                      style={{ minWidth: 180 }}
                      placeholder="请输入内容搜索"
                      allowClear
                      showSearch
                      fetchOptionsOnSearch
                      options={PRODUCTTYPE_OPTIONS}
                    />,
                  )}
                </FormItem>
              ),
            },
            {
              title: '交易日',
              dataIndex: 'tradeDate',
              render: (value, record, index, { form, editing }) => (
                <FormItem>{form.getFieldDecorator({})(<DatePicker />)}</FormItem>
              ),
            },
            {
              title: '到期日',
              dataIndex: 'expirationDate',
              render: (value, record, index, { form, editing }) => (
                <FormItem>{form.getFieldDecorator({})(<DatePicker />)}</FormItem>
              ),
            },
            {
              title: '持仓状态',
              dataIndex: 'lcmEventType',
              render: (value, record, index, { form, editing }) => (
                <FormItem>
                  {form.getFieldDecorator({})(
                    <Select
                      style={{ minWidth: 180 }}
                      placeholder="请输入内容搜索"
                      allowClear
                      showSearch
                      fetchOptionsOnSearch
                      options={LCM_EVENT_TYPE_OPTIONS.sort((a, b) =>
                        b.value.localeCompare(a.value),
                      )}
                    />,
                  )}
                </FormItem>
              ),
            },
          ]}
        />
        <Divider />
        <div style={{ marginTop: VERTICAL_GUTTER }}>
          <Loading loading={this.state.loading}>
            <SmartTable
              pagination={false}
              rowKey="positionId"
              scroll={{ x: 2400 }}
              dataSource={tableDataSource}
              columns={BOOKING_TABLE_COLUMN_DEFS(this.search, this.props.name)}
              onRow={record => (record.style ? { style: record.style } : null)}
            />
            <Row type="flex" justify="end" style={{ marginTop: 15 }}>
              <Pagination
                {...{
                  size: 'small',
                  showSizeChanger: true,
                  onShowSizeChange: this.onShowSizeChange,
                  showQuickJumper: true,
                  current: pagination.current,
                  pageSize: pagination.pageSize,
                  onChange: this.onChange,
                  total: pagination.total,
                  pageSizeOptions: PAGE_SIZE_OPTIONS,
                  showTotal,
                }}
              />
            </Row>
          </Loading>
        </div>
      </>
    );
  }
}

export default connect(({ preRouting, tradeManagementContractManage }) => ({
  contractManagement: tradeManagementContractManage.contractManagement,
  open: tradeManagementContractManage.open,
  unwind: tradeManagementContractManage.unwind,
  expiration: tradeManagementContractManage.expiration,
  overlate: tradeManagementContractManage.overlate,
  preLocation: preRouting.location,
  activeTabKey: tradeManagementContractManage.activeTabKey,
  entryTabKey: tradeManagementContractManage.entryTabKey,
  modify: tradeManagementContractManage.modify,
}))(CommonModel);
