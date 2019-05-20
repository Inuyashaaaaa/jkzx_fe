import { VERTICAL_GUTTER } from '@/constants/global';
import Form from '@/components/Form';
import ModalButton from '@/components/ModalButton';
import SourceTable from '@/components/SourceTable';
import Page from '@/containers/Page';
import { refBankAccountSave, refBankAccountSearch } from '@/services/reference-data-service';
import { message } from 'antd';
import React, { PureComponent } from 'react';
import { CREATE_FORM_CONTROLS, TABLE_COLUMN_DEFS } from './constants';
import { searchFormControls } from './services';

class BankAccount extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      markets: [],
      bankAccountNameValue: '',
      legalNameValue: '',
      bankAccountFormData: {},
      legalNameList: [],
      loading: false,
      dataSource: [],
      createModalVisible: false,
      confirmLoading: false,
      createFormData: {},
    };
  }

  public componentDidMount = () => {
    this.fetchTable();
  };

  public fetchTable = async () => {
    this.setState({
      loading: true,
    });
    const { error, data } = await refBankAccountSearch({
      ...this.state.bankAccountFormData,
    });
    this.setState({
      loading: false,
    });
    if (error) return;
    this.setState({
      dataSource: data,
    });
  };

  public onCreate = async event => {
    this.setState({
      confirmLoading: true,
    });
    const { error, data } = await refBankAccountSave(this.state.createFormData);
    this.setState({
      confirmLoading: false,
    });
    if (error) {
      message.error('创建失败');
      return;
    }
    message.success('创建成功');
    this.setState({
      createModalVisible: false,
    });
    this.fetchTable();
  };

  public onCellValueChanged = async event => {
    const { error, data } = await refBankAccountSave(event.data);
    if (error) {
      message.error('更新失败');
      return false;
    }
    message.success('更新成功');
    return true;
  };

  public handleSearchFormChange = async event => {
    if (Object.keys(event.changedValues)[0] === 'legalName' && !event.changedValues.legalName) {
      return this.setState({
        markets: [],
        bankAccountFormData: {},
      });
    }

    if (Object.keys(event.changedValues)[0] === 'legalName' && event.changedValues.legalName) {
      event.values.bankAccount = '';
      event.values.bankAccountName = '';
    }

    const { error, data } = await refBankAccountSearch({
      legalName: event.values.legalName,
    });
    if (error) return false;

    const markets = data.map(item => ({
      label: item.bankAccount,
      value: item.bankAccount,
    }));

    let bankAccountNameValue;
    let legalNameValue;
    let bankAccountValue;

    if (event.changedValues.bankAccount) {
      const { error, data } = await refBankAccountSearch({
        bankAccount: event.values.bankAccount,
      });
      bankAccountNameValue = data[0] ? data[0].bankAccountName : '';
      legalNameValue = data[0].legalName;
      bankAccountValue = data[0].bankAccount;
    } else if (event.changedValues.bankAccountName) {
      const { error, data } = await refBankAccountSearch({
        bankAccountName: event.values.bankAccountName,
      });
      bankAccountNameValue = data[0].bankAccountName;
      legalNameValue = data[0].legalName;
      bankAccountValue = data[0] ? data[0].bankAccount : '';
    }

    this.setState({
      markets,
      bankAccountFormData: {
        legalName: legalNameValue ? legalNameValue : event.values.legalName,
        bankAccount: bankAccountValue,
        bankAccountName: bankAccountNameValue,
      },
    });
    return data;
  };

  public onReset = () => {
    this.setState(
      {
        bankAccountFormData: {},
      },
      () => {
        this.fetchTable();
      }
    );
  };

  public switchModal = () => {
    this.setState({
      createModalVisible: !this.state.createModalVisible,
    });
  };

  public onValueChange = params => {
    this.setState({
      createFormData: params.values,
    });
  };

  public render() {
    return (
      <Page back={true}>
        <SourceTable
          rowKey="uuid"
          loading={this.state.loading}
          dataSource={this.state.dataSource}
          resetable={true}
          searchable={true}
          onResetButtonClick={this.onReset}
          searchFormControls={searchFormControls(this.state.legalNameList, this.state.markets)}
          searchFormData={this.state.bankAccountFormData}
          columnDefs={TABLE_COLUMN_DEFS}
          onSearchFormChange={this.handleSearchFormChange}
          onSearchButtonClick={this.fetchTable}
          onCellValueChanged={this.onCellValueChanged}
          header={
            <ModalButton
              style={{ marginBottom: VERTICAL_GUTTER }}
              type="primary"
              onClick={this.switchModal}
              modalProps={{
                width: 700,
                title: '创建银行账户',
                onCancel: this.switchModal,
                onOk: this.onCreate,
                visible: this.state.createModalVisible,
                confirmLoading: this.state.confirmLoading,
              }}
              content={
                <Form
                  controlNumberOneRow={1}
                  controls={CREATE_FORM_CONTROLS}
                  dataSource={this.state.createFormData}
                  footer={false}
                  onValueChange={this.onValueChange}
                />
              }
            >
              创建银行账户
            </ModalButton>
          }
        />
      </Page>
    );
  }
}

export default BankAccount;
