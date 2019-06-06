import ModalButton from '@/containers/ModalButton';
import Page from '@/containers/Page';
import { Form2, Select, SmartTable } from '@/containers';
import { message, Divider, Table } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import React, { PureComponent } from 'react';
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
  public state = {
    dataSource: [],
    searchFormData: {},
    loading: false,
    markets: null,
    legalNameList: [],
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
    if (error) return false;
    this.setState({
      dataSource: data,
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

  public onSearchFormChange = async (props, changedFields, allFields) => {
    if (Object.keys(changedFields)[0] === 'legalName' && !changedFields.legalName.value) {
      return this.setState({
        markets: null,
        searchFormData: {},
      });
    }

    const { error, data } = await refBankAccountSearch({
      legalName: allFields.legalName.value,
    });
    if (error) return false;

    const markets = data.map(item => ({
      label: item.bankAccount,
      value: item.bankAccount,
    }));

    let bankAccountNameValue;
    let legalNameValue;
    let bankAccountValue;

    if (changedFields.bankAccount && changedFields.bankAccount.value) {
      const { error, data } = await refBankAccountSearch({
        bankAccount: changedFields.bankAccount.value,
      });
      bankAccountNameValue = data[0] ? data[0].bankAccountName : '';
      legalNameValue = data[0].legalName;
      bankAccountValue = data[0].bankAccount;
    }

    if (changedFields.bankAccountName && changedFields.bankAccountName.value) {
      const { error, data } = await refBankAccountSearch({
        bankAccountName: changedFields.bankAccountName.value,
      });
      bankAccountNameValue = data[0] ? data[0].bankAccountName : '';
      legalNameValue = data[0].legalName;
      bankAccountValue = data[0].bankAccount;
    }

    this.setState({
      markets,
      searchFormData: Form2.createFields({
        legalName: legalNameValue ? legalNameValue : (allFields.legalName || {}).value,
        bankAccount: bankAccountValue,
        bankAccountName: bankAccountNameValue,
      }),
    });
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
      visible: false,
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
    message.success('创建成功');
    this.fetchTable();
  };

  public onCreateFormChange = params => {
    this.setState({
      createFormData: params.values,
    });
  };

  public render() {
    return (
      <Page>
        <Form2
          layout="inline"
          dataSource={this.state.searchFormData}
          submitText={'搜索'}
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
            {
              title: '交易账号',
              dataIndex: 'bankAccount',
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
                          this.state.markets
                            ? this.state.markets
                            : async (value: string = '') => {
                                const { data, error } = await refSimilarBankAccountList({
                                  similarBankAccount: value,
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
              title: '交易对手账户名',
              dataIndex: 'bankAccountName',
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
                          const { data, error } = await refSimilarAccountNameList({
                            similarAccountName: value,
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
          rowKey="uuid"
          scroll={this.state.dataSource.length ? { x: '1000px' } : { x: false }}
        />
      </Page>
    );
  }
}

export default ClientManagementBankAccount;
