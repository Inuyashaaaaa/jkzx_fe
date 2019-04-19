import ModalButton from '@/design/components/ModalButton';
import SourceTable from '@/design/components/SourceTable';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { refBankAccountSave, refBankAccountSearch } from '@/services/reference-data-service';
import { message } from 'antd';
import React, { PureComponent } from 'react';
import CommonModalForm from './CommonModalForm';
import { SEARCH_FORM_CONTROL, TABLE_COLUMN_DEFS } from './constants';

class ClientManagementBankAccount extends PureComponent {
  public state = {
    dataSource: [],
    searchFormData: {},
    loading: false,
    markets: [],
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
      ...this.state.searchFormData,
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

  public onSearchFormChange = async params => {
    const { changedValues, values } = params;
    if (Object.keys(changedValues)[0] === 'legalName' && !changedValues.legalName) {
      return this.setState({
        markets: [],
        searchFormData: {},
      });
    }

    const { error, data } = await refBankAccountSearch({
      legalName: values.legalName,
    });

    if (error) return false;

    const markets = data.map(item => ({
      label: item.bankAccount,
      value: item.bankAccount,
    }));

    let bankAccountNameValue;
    let legalNameValue;
    let bankAccountValue;

    if (changedValues.bankAccount) {
      const { error, data } = await refBankAccountSearch({
        bankAccount: values.bankAccount,
      });
      bankAccountNameValue = data[0] ? data[0].bankAccountName : '';
      legalNameValue = data[0].legalName;
      bankAccountValue = data[0].bankAccount;
    }

    if (changedValues.bankAccountName) {
      const { error, data } = await refBankAccountSearch({
        bankAccountName: values.bankAccountName,
      });
      bankAccountNameValue = data[0] ? data[0].bankAccountName : '';
      legalNameValue = data[0].legalName;
      bankAccountValue = data[0].bankAccount;
    }

    this.setState({
      markets,
      searchFormData: {
        legalName: legalNameValue ? legalNameValue : values.legalName,
        bankAccount: bankAccountValue,
        bankAccountName: bankAccountNameValue,
      },
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
      <PageHeaderWrapper>
        <SourceTable
          rowKey="uuid"
          dataSource={this.state.dataSource}
          columnDefs={TABLE_COLUMN_DEFS(this.fetchTable)}
          loading={this.state.loading}
          searchable={true}
          resetable={true}
          onResetButtonClick={this.onReset}
          searchFormControls={SEARCH_FORM_CONTROL(this.state.legalNameList, this.state.markets)}
          searchFormData={this.state.searchFormData}
          onSearchFormChange={this.onSearchFormChange}
          onSearchButtonClick={this.fetchTable}
          header={
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
          }
        />
      </PageHeaderWrapper>
    );
  }
}

export default ClientManagementBankAccount;
