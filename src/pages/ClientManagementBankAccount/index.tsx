import { message, Divider, Table } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import React, { PureComponent } from 'react';
import _ from 'lodash';
import { Form2, Select, SmartTable } from '@/containers';
import ModalButton from '@/containers/ModalButton';
import Page from '@/containers/Page';
import CommonModalForm from './CommonModalForm';
import {
  refSimilarAccountNameList,
  refSimilarBankAccountList,
  refSimilarLegalNameList,
  refBankAccountSave,
  refBankAccountSearch,
} from '@/services/reference-data-service';
import Operation from './Operation';

class ClientManagementBankAccount extends PureComponent {
  public $select = {};

  public state = {
    dataSource: [],
    searchFormData: {},
    loading: false,
    markets: null,
    bankAccountNames: null,
    visible: false,
    confirmLoading: false,
    createFormData: {},
  };

  public componentDidMount = () => {
    this.fetchTable();
  };

  public fetchTable = async () => {
    this.setState({
      loading: true,
    });
    const { error, data } = await refBankAccountSearch({
      ...Form2.getFieldsValue(this.state.searchFormData),
    });
    this.setState({
      loading: false,
    });
    if (error) return;
    this.setState({
      dataSource: data,
    });
  };

  public onReset = () => {
    this.setState(
      {
        searchFormData: {},
        markets: null,
        bankAccountNames: null,
      },
      () => {
        this.fetchTable();
      },
    );
  };

  public onSearchFormChange = async (props, changedFields, allFields) => {
    if (Object.keys(changedFields)[0] === 'legalName' && !changedFields.legalName.value) {
      return this.setState({
        markets: null,
        bankAccountNames: null,
        searchFormData: {},
      });
    }
    const BankAccountSearch = {};
    if (_.get(Form2.getFieldsValue(allFields), 'legalName')) {
      BankAccountSearch.legalName = _.get(Form2.getFieldsValue(allFields), 'legalName');
    }
    if (
      _.get(Form2.getFieldsValue(allFields), 'bankAccount')
      // && _.get(Form2.getFieldsValue(changedFields), 'bankAccountName')
    ) {
      BankAccountSearch.bankAccount = _.get(Form2.getFieldsValue(allFields), 'bankAccount');
    }
    if (_.get(Form2.getFieldsValue(allFields), 'bankAccountName')) {
      BankAccountSearch.bankAccountName = _.get(Form2.getFieldsValue(allFields), 'bankAccountName');
    }
    const { error: _error, data: _data } = await refBankAccountSearch(BankAccountSearch);
    if (_error) return false;

    const markets = _data.map(item => ({
      label: item.bankAccount,
      value: item.bankAccount,
    }));

    const bankAccountNames = _data.map(item => ({
      label: item.bankAccountName,
      value: item.bankAccountName,
    }));

    let bankAccountNameValue;
    let legalNameValue;
    let bankAccountValue;

    if (changedFields.bankAccount && changedFields.bankAccount.value) {
      const { error, data } = await refBankAccountSearch(BankAccountSearch);
      bankAccountNameValue = data[0] ? data[0].bankAccountName : '';
      legalNameValue = data[0].legalName;
      bankAccountValue = data[0].bankAccount;
    }

    if (changedFields.bankAccountName && changedFields.bankAccountName.value) {
      const { error, data } = await refBankAccountSearch(BankAccountSearch);
      bankAccountNameValue = data[0] ? data[0].bankAccountName : '';
      legalNameValue = data[0].legalName;
      bankAccountValue = data[0].bankAccount;
    }

    this.setState({
      markets,
      bankAccountNames,
      searchFormData: Form2.createFields({
        legalName: legalNameValue || (allFields.legalName || {}).value,
        bankAccount: bankAccountValue,
        bankAccountName: bankAccountNameValue,
      }),
    });
    return true;
  };

  public switchModal = () => {
    this.setState({
      visible: true,
    });
  };

  public onCancel = () => {
    this.setState({
      visible: false,
    });
  };

  public handleCreate = async () => {
    this.setState({
      confirmLoading: true,
    });
    const { error, data } = await refBankAccountSave({
      ...this.state.createFormData,
    });
    this.setState({
      confirmLoading: false,
    });
    if (error) {
      message.error('创建失败');
      return;
    }
    this.setState({ visible: false, createFormData: {} });
    message.success('创建成功');
    this.fetchTable();
  };

  public onCreateFormChange = params => {
    this.setState({
      createFormData: params.values,
    });
  };

  public render() {
    const searchForm = Form2.getFieldsValue(this.state.searchFormData);
    return (
      <Page>
        <Form2
          layout="inline"
          dataSource={this.state.searchFormData}
          submitText="搜索"
          submitButtonProps={{
            icon: 'search',
          }}
          onSubmitButtonClick={this.fetchTable}
          onResetButtonClick={this.onReset}
          onFieldsChange={this.onSearchFormChange}
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
                      ref={node => {
                        this.$select.legalName = node;
                      }}
                      onDropdownVisibleChange={open => {
                        if (open) {
                          this.$select.legalName.onSearch(value);
                        }
                      }}
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
              title: '交易对手银行账号',
              dataIndex: 'bankAccount',
              render: (value, record, index, { form, editing }) => (
                <FormItem>
                  {form.getFieldDecorator({})(
                    <Select
                      style={{ minWidth: 180 }}
                      placeholder="请输入内容搜索"
                      allowClear
                      showSearch
                      fetchOptionsOnSearch
                      filterOption
                      ref={node => {
                        this.$select.bankAccount = node;
                      }}
                      onDropdownVisibleChange={open => {
                        if (open) {
                          this.$select.bankAccount.onSearch(value);
                        }
                      }}
                      options={
                        this.state.markets
                          ? this.state.markets
                          : async (values: string = '') => {
                              const { data, error } = await refSimilarBankAccountList({
                                similarLegalName: searchForm.legalName,
                                similarBankAccount: values,
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
              title: '交易对手银行账户名',
              dataIndex: 'bankAccountName',
              render: (value, record, index, { form, editing }) => (
                <FormItem>
                  {form.getFieldDecorator({})(
                    <Select
                      style={{ minWidth: 180 }}
                      placeholder="请输入内容搜索"
                      allowClear
                      showSearch
                      fetchOptionsOnSearch
                      filterOption
                      ref={node => {
                        this.$select.bankAccountName = node;
                      }}
                      onDropdownVisibleChange={open => {
                        if (open) {
                          this.$select.bankAccountName.onSearch(value);
                        }
                      }}
                      options={
                        this.state.bankAccountNames
                          ? this.state.bankAccountNames
                          : async (values: string = '') => {
                              const { data, error } = await refSimilarAccountNameList({
                                similarLegalName: searchForm.legalName,
                                similarBankAccount: searchForm.bankAccount,
                                similarAccountName: values,
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
          ]}
        />
        <Divider type="horizontal" />
        <ModalButton
          type="primary"
          key="create"
          onClick={this.switchModal}
          style={{ marginBottom: '20px' }}
          modalProps={{
            visible: this.state.visible,
            confirmLoading: this.state.confirmLoading,
            onCancel: this.onCancel,
            onOk: this.handleCreate,
            title: '新建银行账户',
          }}
          content={
            <CommonModalForm
              createFormData={this.state.createFormData}
              onCreateFormChange={this.onCreateFormChange}
            />
          }
        >
          新建银行账户
        </ModalButton>
        <SmartTable
          dataSource={this.state.dataSource}
          columns={[
            {
              title: '交易对手',
              dataIndex: 'legalName',
            },
            {
              title: '交易对手银行账号',
              dataIndex: 'bankAccount',
            },
            {
              title: '交易对手银行账户名',
              dataIndex: 'bankAccountName',
            },
            {
              title: '交易对手开户行',
              dataIndex: 'bankName',
            },
            {
              title: '交易对手支付系统行号',
              dataIndex: 'paymentSystemCode',
            },
            {
              title: '操作',
              render: (text, record, index) => (
                <Operation record={text} fetchTable={this.fetchTable} />
              ),
            },
          ]}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          loading={this.state.loading}
          rowKey="uuid"
          scroll={this.state.dataSource.length ? { x: '1000px' } : { x: false }}
        />
      </Page>
    );
  }
}

export default ClientManagementBankAccount;
