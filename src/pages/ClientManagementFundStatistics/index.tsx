import SourceTable from '@/design/components/SourceTable';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { arr2treeOptions } from '@/lib/utils';
import {
  clientAccountSearch,
  refSalesGetByLegalName,
  refSimilarLegalNameList,
  refMasterAgreementSearch,
} from '@/services/reference-data-service';
import { queryCompleteCompanys } from '@/services/sales';
import { sortByCreateAt } from '@/services/sort';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import { ADDRESS_CASCADER, SEARCH_FORM_CONTROLS, TABLE_COL_DEF } from './constants';
import { Form2, Select } from '@/design/components';
import FormItem from 'antd/lib/form/FormItem';
import { Button, Divider, Row, Table } from 'antd';
import Operation from './Operation';
import { formatMoney } from '@/tools';

class ClientManagementFundStatistics extends PureComponent {
  public state = {
    searchFormData: {
      ...Form2.createFields({ normalStatus: 'all' }),
    },
    loading: false,
    branchSalesList: [],
    tableDataSource: [],
  };

  public componentDidMount = async () => {
    this.fetchBranchSalesList();
    this.fetchSimilarLegalName();
    this.fetchTable();
  };

  public fetchSimilarLegalName = async () => {
    const { error, data } = await refSimilarLegalNameList({
      similarLegalName: '',
    });
    if (error) return;
    const markets = data.map(item => ({
      label: item,
      value: item,
    }));
    this.setState({ markets });
  };

  public fetchBranchSalesList = async () => {
    const { error, data } = await queryCompleteCompanys();
    if (error) return false;
    const newData = arr2treeOptions(
      data,
      ['subsidiary', 'branch', 'salesName'],
      ['subsidiary', 'branch', 'salesName']
    );
    const branchSalesList = newData.map(subsidiaryName => {
      return {
        value: subsidiaryName.value,
        label: subsidiaryName.label,
        children: subsidiaryName.children.map(branchName => {
          return {
            value: branchName.value,
            label: branchName.label,
            children: branchName.children.map(salesName => {
              return {
                value: salesName.value,
                label: salesName.label,
              };
            }),
          };
        }),
      };
    });
    this.setState({ branchSalesList });
    return true;
  };

  public fetchTable = async () => {
    const { searchFormData } = this.state;
    this.setState({ loading: true });

    const { error, data } = await clientAccountSearch(
      Object.keys(this.state.searchFormData).length > 0
        ? {
            ..._.omit(Form2.getFieldsValue(this.state.searchFormData), ['normalStatus']),
            ...(this.state.searchFormData.normalStatus &&
            this.state.searchFormData.normalStatus.value === 'all'
              ? null
              : { normalStatus: this.state.searchFormData.normalStatus.value }),
          }
        : {}
    );
    this.setState({ loading: false });

    if (error) return;

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
              _.pick(refSalesGetByLegalNameRsp.data, ['subsidiary', 'branch', 'salesName'])
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
      },
      () => {
        this.fetchTable();
      }
    );
  };

  public render() {
    return (
      <PageHeaderWrapper>
        <Form2
          ref={node => (this.$sourceTable = node)}
          layout="inline"
          dataSource={this.state.searchFormData}
          submitText={'查询'}
          submitButtonProps={{
            icon: 'search',
          }}
          onSubmitButtonClick={this.fetchTable}
          onResetButtonClick={this.onReset}
          onFieldsChange={this.onFieldsChange}
          columns={[
            {
              title: '交易对手',
              dataIndex: 'legalName',
              render: (value, record, index, { form, editing }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({})(
                      <Select
                        style={{ minWidth: 180 }}
                        placeholder="请输入内容搜索"
                        allowClear={true}
                        showSearch={true}
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
              title: '主协议编号',
              dataIndex: 'masterAgreementId',
              render: (value, record, index, { form, editing }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({})(
                      <Select
                        style={{ minWidth: 180 }}
                        placeholder="请输入内容搜索"
                        allowClear={true}
                        showSearch={true}
                        options={async (value: string = '') => {
                          const { data, error } = await refMasterAgreementSearch({
                            masterAgreementId: value,
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
              title: '状态',
              dataIndex: 'normalStatus',
              render: (value, record, index, { form, editing }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({})(
                      <Select
                        style={{ minWidth: 180 }}
                        placeholder="请输入内容搜索"
                        allowClear={true}
                        showSearch={true}
                        options={[
                          {
                            label: '全部',
                            value: 'all',
                          },
                          {
                            label: '正常',
                            value: 'true',
                          },
                          {
                            label: '异常',
                            value: 'false',
                          },
                        ]}
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
          dataSource={this.state.tableDataSource}
          columns={[
            {
              title: '交易对手',
              dataIndex: 'legalName',
              width: 180,
            },
            {
              title: '状态',
              dataIndex: 'normalStatus',
              width: 150,
              render: (text, record, index) => {
                if (text) return '正常';
                return '错误';
              },
            },
            {
              title: '账户信息',
              width: 150,
              dataIndex: 'accountInformation',
            },
            {
              title: '保证金 (¥)',
              width: 150,
              dataIndex: 'margin',
              render: (text, record, index) => {
                return text ? formatMoney(text, {}) : text;
              },
            },
            {
              title: '现金余额 (¥)',
              width: 150,
              dataIndex: 'cash',
              render: (text, record, index) => {
                return text ? formatMoney(text, {}) : text;
              },
            },
            {
              title: '已用授信额度 (¥)',
              width: 150,
              dataIndex: 'creditUsed',
              render: (text, record, index) => {
                return text ? formatMoney(text, {}) : text;
              },
            },
            {
              title: '负债 (¥)',
              width: 150,
              dataIndex: 'debt',
              render: (text, record, index) => {
                return text ? formatMoney(text, {}) : text;
              },
            },
            {
              title: '出入金总额 (¥)',
              width: 150,
              dataIndex: 'netDeposit',
              render: (text, record, index) => {
                return text ? formatMoney(text, {}) : text;
              },
            },
            {
              title: '已实现盈亏 (¥)',
              width: 150,
              dataIndex: 'realizedPnL',
              render: (text, record, index) => {
                return text ? formatMoney(text, {}) : text;
              },
            },
            {
              title: '授信总额 (¥)',
              width: 150,
              dataIndex: 'credit',
              render: (text, record, index) => {
                return text ? formatMoney(text, {}) : text;
              },
            },
            {
              title: '我方授信总额 (¥)',
              width: 150,
              dataIndex: 'counterPartyCredit',
              render: (text, record, index) => {
                return text ? formatMoney(text, {}) : text;
              },
            },
            {
              title: '我方剩余授信余额 (¥)',
              width: 150,
              dataIndex: 'counterPartyCreditBalance',
              render: (text, record, index) => {
                return text ? formatMoney(text, {}) : text;
              },
            },
            {
              title: '我方可用资金 (¥)',
              width: 150,
              dataIndex: 'counterPartyFund',
              render: (text, record, index) => {
                return text ? formatMoney(text, {}) : text;
              },
            },
            {
              title: '我方冻结保证金 (¥)',
              width: 150,
              dataIndex: 'counterPartyMargin',
              render: (text, record, index) => {
                return text ? formatMoney(text, {}) : text;
              },
            },
            {
              title: '操作',
              fixed: 'right',
              width: 150,
              render: (text, record, index) => {
                return <Operation record={text} fetchTable={this.fetchTable} />;
              },
            },
          ]}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          loading={this.state.loading}
          rowKey="accountId"
          size="middle"
          scroll={this.state.tableDataSource ? { x: '1800px' } : { x: false }}
        />
        {/* <SourceTable
          rowKey="accountId"
          loading={this.state.loading}
          columnDefs={TABLE_COL_DEF(this.fetchTable)}
          dataSource={this.state.tableDataSource}
          autoSizeColumnsToFit={false}
          searchable={true}
          resetable={true}
          onResetButtonClick={this.onReset}
          searchFormControls={SEARCH_FORM_CONTROLS(this.state.branchSalesList)}
          searchFormData={this.state.searchFormData}
          onSearchButtonClick={this.fetchTable}
          onSearchFormChange={this.onSearchFormChange}
        /> */}
      </PageHeaderWrapper>
    );
  }
}

export default ClientManagementFundStatistics;
