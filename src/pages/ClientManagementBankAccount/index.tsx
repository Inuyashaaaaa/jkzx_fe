import { message, Divider, Table } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import React, { PureComponent } from 'react';
import _ from 'lodash';
import uuidv4 from 'uuid/v4';
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
import { getMoment } from '@/tools';

class ClientManagementBankAccount extends PureComponent {
  public $select = {};

  public $form: Form2 = null;

  public state = {
    dataSource: [],
    searchFormData: {},
    loading: false,
    markets: null,
    bankAccountNames: null,
    visible: false,
    confirmLoading: false,
    createFormData: {},
    searchForm: {},
  };

  public componentDidMount = () => {
    this.fetchTable();
  };

  public fetchTable = async (formData, setSearchFormData = false) => {
    this.setState({
      loading: true,
    });
    const { searchFormData, searchForm } = this.state;
    const { bankAccount, bankAccountName, legalName } = Form2.getFieldsValue(
      formData || searchForm,
    );
    const { error, data } = await refBankAccountSearch({
      bankAccount: (bankAccount || '').split('_')[0],
      legalName: (legalName || '').split('_')[0],
      bankAccountName: (bankAccountName || '').split('_')[0],
    });
    this.setState({
      loading: false,
    });
    if (error) return;
    if (setSearchFormData) {
      this.setState({
        searchForm: searchFormData,
      });
    }
    const sortData = [...data].sort(
      (a, b) => getMoment(b.updatedAt).valueOf() - getMoment(a.updatedAt).valueOf(),
    );
    this.setState({
      dataSource: sortData,
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
        this.fetchTable({}, true);
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
      // [BankAccountSearch.legalName] = _.get(Form2.getFieldsValue(allFields), 'legalName').split(
      //   '_',
      // );
      BankAccountSearch.legalName = _.get(Form2.getFieldsValue(allFields), 'legalName');
    }
    const { searchFormData } = this.state;
    const { error: _error, data: _data } = await refBankAccountSearch(BankAccountSearch);
    if (_error) return false;

    const markets = _data.map(item => ({
      label: item.bankAccount,
      value: item.bankAccount,
      // value: `${item.bankAccount}_${uuidv4()}`,
    }));

    const bankAccountNames = _data.map(item => ({
      label: item.bankAccountName,
      value: item.bankAccountName,
      // value: `${item.bankAccountName}_${uuidv4()}`,
    }));

    if (changedFields.legalName) {
      return this.setState({
        markets,
        bankAccountNames,
        searchFormData: {
          ...searchFormData,
          ...changedFields,
          ...Form2.createFields({ bankAccount: '', bankAccountName: '' }),
        },
      });
    }

    this.setState({
      markets,
      bankAccountNames,
      searchFormData: {
        ...searchFormData,
        ...changedFields,
      },
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
    const res = await this.$form.validate();
    if (res.error) return;
    this.setState({
      confirmLoading: true,
    });
    const { error, data } = await refBankAccountSave({
      ...Form2.getFieldsValue(this.state.createFormData),
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

  public onCreateFormChange = (props, changedFields, allFields) => {
    this.setState(state => ({
      createFormData: {
        ...state.createFormData,
        ...changedFields,
      },
    }));
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
          onSubmitButtonClick={() => this.fetchTable(this.state.searchFormData, true)}
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
                      // filterOption
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
                          // value: `${item}_${uuidv4()}`,
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
                      filterOption={(val, option) =>
                        _.get(option, 'props.children').indexOf(val) >= 0
                      }
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
                                // value: `${item}_${uuidv4()}`,
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
                      filterOption={(val, option) =>
                        _.get(option, 'props.children').indexOf(val) >= 0
                      }
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
                                // value: `${item}_${uuidv4()}`,
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
              refCreateFormModal={node => {
                this.$form = node;
              }}
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
