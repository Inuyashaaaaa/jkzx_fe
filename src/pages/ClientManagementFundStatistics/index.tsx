import { Divider } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import { Form2, Select, SmartTable } from '@/containers';
import Page from '@/containers/Page';
import {
  clientAccountSearch,
  refMasterAgreementSearch,
  refSalesGetByLegalName,
  refSimilarLegalNameList,
} from '@/services/reference-data-service';
import { sortByCreateAt } from '@/services/sort';
import { formatNumber } from '@/tools';
import { ADDRESS_CASCADER } from './constants';
import Operation from './Operation';
import Ellipsis from '@/containers/Ellipsis';

class ClientManagementFundStatistics extends PureComponent {
  public state = {
    searchFormData: {
      ...Form2.createFields({ normalStatus: 'all' }),
    },
    loading: false,
    tableDataSource: [],
    searchForm: {
      ...Form2.createFields({ normalStatus: 'all' }),
    },
  };

  public componentDidMount = async () => {
    this.fetchTable();
  };

  public fetchTable = async (option = false) => {
    const { searchFormData, searchForm } = this.state;
    this.setState({ loading: true });
    const searchData = option ? this.state.searchFormData : this.state.searchForm;

    const { error, data } = await clientAccountSearch(
      Object.keys(searchData).length > 0
        ? {
            ..._.omit(Form2.getFieldsValue(searchData), ['normalStatus']),
            ...(searchData.normalStatus && searchData.normalStatus.value === 'all'
              ? null
              : { normalStatus: searchData.normalStatus.value }),
          }
        : {},
    );
    this.setState({ loading: false });

    if (error) return;
    if (option) {
      this.setState({
        searchForm: searchFormData,
      });
    }
    this.setState({
      tableDataSource: sortByCreateAt(data),
    });
  };

  public onFieldsChange = async (props, changedFields, allFields) => {
    let refSalesGetByLegalNameRsp;
    if (changedFields.legalName && changedFields.legalName.value) {
      refSalesGetByLegalNameRsp = await refSalesGetByLegalName({
        legalName: changedFields.legalName.value,
      });
      if (refSalesGetByLegalNameRsp.error) return;
      this.setState({
        searchFormData: {
          // ...params.values,
          ...allFields,
          ...Form2.createFields({
            [ADDRESS_CASCADER]: _.values(
              _.pick(refSalesGetByLegalNameRsp.data, ['subsidiary', 'branch', 'salesName']),
            ),
          }),
        },
      });
      return;
    }
    this.setState({
      searchFormData: allFields,
    });
  };

  public onReset = () => {
    this.setState(
      {
        searchFormData: {},
        searchForm: {},
      },
      () => {
        this.fetchTable();
      },
    );
  };

  public render() {
    return (
      <Page>
        <Form2
          layout="inline"
          dataSource={this.state.searchFormData}
          submitText="查询"
          submitButtonProps={{
            icon: 'search',
          }}
          onSubmitButtonClick={() => this.fetchTable(true)}
          onResetButtonClick={this.onReset}
          onFieldsChange={this.onFieldsChange}
          columns={[
            {
              title: '交易对手',
              dataIndex: 'legalName',
              render: (value, record, index, { form, editing }) => (
                <FormItem>
                  {form.getFieldDecorator({})(
                    <Select
                      style={{ minWidth: 180 }}
                      placeholder="请输入内容搜索"
                      allowClear
                      showSearch
                      fetchOptionsOnSearch
                      options={async (_value: string = '') => {
                        const { data, error } = await refSimilarLegalNameList({
                          similarLegalName: _value,
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
              title: '主协议编号',
              dataIndex: 'masterAgreementId',
              render: (value, record, index, { form, editing }) => (
                <FormItem>
                  {form.getFieldDecorator({})(
                    <Select
                      style={{ minWidth: 180 }}
                      placeholder="请输入内容搜索"
                      allowClear
                      showSearch
                      fetchOptionsOnSearch
                      options={async (_value: string = '') => {
                        const { data, error } = await refMasterAgreementSearch({
                          masterAgreementId: _value,
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
              title: '状态',
              dataIndex: 'normalStatus',
              render: (value, record, index, { form, editing }) => (
                <FormItem>
                  {form.getFieldDecorator({})(
                    <Select
                      style={{ minWidth: 180 }}
                      placeholder="请输入内容搜索"
                      allowClear
                      showSearch
                      filterOption
                      options={[
                        {
                          label: '全部',
                          value: 'all',
                        },
                        {
                          label: '正常',
                          value: true,
                        },
                        {
                          label: '异常',
                          value: false,
                        },
                      ]}
                    />,
                  )}
                </FormItem>
              ),
            },
          ]}
        />
        <Divider type="horizontal" />
        <SmartTable
          dataSource={this.state.tableDataSource}
          columns={[
            {
              title: '交易对手',
              dataIndex: 'legalName',
              width: 200,
              fixed: 'left',
              render: val => (
                <span
                  style={{
                    overflow: 'hidden',
                    display: 'inline-block',
                    wordBreak: 'break-all',
                    width: '100%',
                  }}
                >
                  {val}
                </span>
              ),
            },
            {
              title: '状态',
              dataIndex: 'normalStatus',
              width: 50,
              render: (text, record, index) => {
                if (text) return '正常';
                return '错误';
              },
            },
            {
              title: '账户信息',
              dataIndex: 'accountInformation',
            },
            {
              title: '保证金 (¥)',
              align: 'right',
              width: 150,
              dataIndex: 'margin',
              render: (text, record, index) => formatNumber(text, 4),
            },
            {
              title: '现金余额 (¥)',
              align: 'right',
              width: 150,
              dataIndex: 'cash',
              render: (text, record, index) => formatNumber(text, 4),
            },
            {
              title: '已用授信额度 (¥)',
              align: 'right',
              width: 150,
              dataIndex: 'creditUsed',
              render: (text, record, index) => formatNumber(text, 4),
            },
            {
              title: '负债 (¥)',
              dataIndex: 'debt',
              align: 'right',
              width: 150,
              render: (text, record, index) => formatNumber(text, 4),
            },
            {
              title: '出入金总额 (¥)',
              align: 'right',
              width: 150,
              dataIndex: 'netDeposit',
              render: (text, record, index) => formatNumber(text, 4),
            },
            {
              title: '已实现盈亏 (¥)',
              align: 'right',
              width: 150,
              dataIndex: 'realizedPnL',
              render: (text, record, index) => formatNumber(text, 4),
            },
            {
              title: '授信总额 (¥)',
              align: 'right',
              width: 150,
              dataIndex: 'credit',
              render: (text, record, index) => formatNumber(text, 4),
            },
            {
              title: '我方授信总额 (¥)',
              dataIndex: 'counterPartyCredit',
              align: 'right',
              width: 150,
              render: (text, record, index) => formatNumber(text, 4),
            },
            {
              title: '我方剩余授信余额 (¥)',
              dataIndex: 'counterPartyCreditBalance',
              align: 'right',
              width: 160,
              render: (text, record, index) => formatNumber(text, 4),
            },
            {
              title: '我方可用资金 (¥)',
              dataIndex: 'counterPartyFund',
              align: 'right',
              width: 150,
              render: (text, record, index) => formatNumber(text, 4),
            },
            {
              title: '我方冻结保证金 (¥)',
              dataIndex: 'counterPartyMargin',
              align: 'right',
              width: 150,
              render: (text, record, index) => formatNumber(text, 4),
            },
            {
              title: '操作',
              fixed: 'right',
              width: 150,
              render: (text, record, index) => (
                <Operation record={record} fetchTable={this.fetchTable} />
              ),
            },
          ]}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          loading={this.state.loading}
          rowKey="accountId"
          scroll={{ x: 2300 }}
        />
      </Page>
    );
  }
}

export default ClientManagementFundStatistics;
