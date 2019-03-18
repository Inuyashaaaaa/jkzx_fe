import SourceTable from '@/lib/components/_SourceTable';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
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
    };
  }

  public fetchTable = async event => {
    if (event) {
      const { error, data } = await refBankAccountSearch({
        ...event.searchFormData,
      });
      if (error) return false;
      return data;
    }
  };

  public onCreate = async event => {
    const { error, data } = await refBankAccountSave({
      bankName: event.createFormData.bankName,
      legalName: event.createFormData.legalName,
      bankAccount: event.createFormData.bankAccount,
      bankAccountName: event.createFormData.bankAccountName,
      paymentSystemCode: event.createFormData.paymentSystemCode,
    });
    if (error) return false;
    return {
      tableDataSource: event.tableDataSource.concat(data),
    };
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
    if (Object.keys(event.changed)[0] === 'legalName' && !event.changed.legalName) {
      return this.setState({
        markets: [],
        bankAccountFormData: {},
      });
    }

    if (event.changed.legalName) {
      event.formData.bankAccount = '';
      event.formData.bankAccountName = '';
    }

    const { error, data } = await refBankAccountSearch({
      legalName: event.formData.legalName,
    });
    // const { error, data } = await refBankAccountSearch({
    //   ...event.changed,
    // });
    if (error) return false;

    const markets = data.map(item => ({
      label: item.bankAccount,
      value: item.bankAccount,
    }));

    let bankAccountNameValue;
    let legalNameValue;
    let bankAccountValue;

    if (event.changed.bankAccount || event.changed.bankAccountName) {
      const { error, data } = await refBankAccountSearch({
        bankAccount: event.formData.bankAccount,
      });
      bankAccountNameValue = data[0] ? data[0].bankAccountName : '';
      legalNameValue = data[0].legalName;
      bankAccountValue = data[0].bankAccount;
    }

    this.setState({
      markets,
      bankAccountFormData: {
        legalName: legalNameValue ? legalNameValue : event.formData.legalName,
        bankAccount: bankAccountValue,
        bankAccountName: bankAccountNameValue,
      },
    });
    return data;
  };

  public render() {
    return (
      <PageHeaderWrapper back={true}>
        <SourceTable
          rowKey="uuid"
          searchFormControls={searchFormControls(this.state.legalNameList, this.state.markets)}
          searchFormData={this.state.bankAccountFormData}
          createFormControls={CREATE_FORM_CONTROLS}
          tableColumnDefs={TABLE_COLUMN_DEFS}
          autoFetch={false}
          onSearchFormChange={this.handleSearchFormChange}
          onSearch={this.fetchTable}
          createText="创建银行账户"
          createModalProps={{ width: 700 }}
          onCreate={this.onCreate}
          tableProps={{
            onCellValueChanged: this.onCellValueChanged,
          }}
        />
      </PageHeaderWrapper>
    );
  }
}

export default BankAccount;
