import { VERTICAL_GUTTER } from '@/constants/global';
import Form from '@/design/components/Form';
import ModalButton from '@/design/components/ModalButton';
import SourceTable from '@/design/components/SourceTable';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { createApprovalProcess } from '@/services/approval';
import { cliFundEventSearch, refBankAccountSearch } from '@/services/reference-data-service';
import { message } from 'antd';
import produce from 'immer';
import _ from 'lodash';
import moment, { isMoment } from 'moment';
import React, { PureComponent } from 'react';
import { CREATE_FORM_CONTROLS, SEARCH_FORM_CONTROLS, TABLE_COL_DEFS } from './constants';
import router from 'umi/router';

class ClientManagementDiscrepancyManagement extends PureComponent {
  public $form: Form = null;
  public state = {
    dataSource: [],
    searchFormData: {
      processStatus: 'all',
    },
    loading: false,
    visible: false,
    confirmLoading: false,
    bankAccountList: [],
    createFormData: {},
  };

  public componentDidMount = () => {
    this.setState({
      createFormData: {
        paymentDate: moment(),
        accountDirection: 'PARTY',
      },
    });
    this.fetchTable();
  };

  public fetchTable = async () => {
    this.setState({
      loading: true,
    });

    const { error, data } = await cliFundEventSearch({
      ..._.omit(this.state.searchFormData, ['paymentDate', 'processStatus']),
      ...(this.state.searchFormData.paymentDate
        ? {
            startDate: moment(this.state.searchFormData.paymentDate[0]).format('YYYY-MM-DD'),
            endDate: moment(this.state.searchFormData.paymentDate[1]).format('YYYY-MM-DD'),
          }
        : null),
      ...(this.state.searchFormData.processStatus &&
      this.state.searchFormData.processStatus === 'all'
        ? null
        : { processStatus: this.state.searchFormData.processStatus }),
    });
    this.setState({
      loading: false,
    });
    if (error) return;
    this.setState({
      dataSource: data,
    });
    return;
  };

  public onSearchFormChange = params => {
    this.setState({
      searchFormData: params.values,
    });
  };

  public onReset = () => {
    this.setState(
      {
        searchFormData: {
          processStatus: 'all',
        },
      },
      () => {
        this.fetchTable();
      }
    );
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

  public onOk = async () => {
    if (this.$form) {
      const { error } = await this.$form.validate();
      if (error) return;
    }
    this.setState({
      visible: false,
      confirmLoading: true,
    });
    const { createFormData } = this.state;
    const formatValues = _.mapValues(createFormData, (val, key) => {
      if (isMoment(val)) {
        return val.format('YYYY-MM-DD');
      }
      return val;
    });
    const { error, data } = await createApprovalProcess({
      processName: '资金录入经办复合流程',
      processData: { ...formatValues },
    });
    this.setState({
      confirmLoading: false,
    });
    if (error) return;
    this.setState(
      produce((state: any) => {
        state.discrepancyCreateData = {
          paymentDate: moment(),
          accountDirection: 'PARTY',
        };
        state.modalVisible = false;
        state.createFormData = {};
      }),
      () => {
        message.success(data.processInstanceId ? '已进入流程' : '资金录入成功');
        router.push('/approval-process/process-manangement');
        // this.fetchTable();
      }
    );
  };

  public createFormChange = async params => {
    const { changedValues, values } = params;
    if (changedValues.clientId) {
      const { error, data } = await refBankAccountSearch({
        legalName: values.clientId,
      });
      if (error) return;
      const bankAccountList = _.map(data, (val, key) => {
        return {
          label: _.pick(val, ['bankAccount']).bankAccount,
          value: _.pick(val, ['bankAccount']).bankAccount,
        };
      });
      this.setState({
        bankAccountList,
        createFormData: values,
      });
      return;
    }
    this.setState({
      createFormData: values,
    });
  };

  public render() {
    return (
      <PageHeaderWrapper>
        <SourceTable
          rowKey="uuid"
          columnDefs={TABLE_COL_DEFS}
          loading={this.state.loading}
          dataSource={this.state.dataSource}
          searchable={true}
          resetable={true}
          onResetButtonClick={this.onReset}
          searchFormControls={SEARCH_FORM_CONTROLS}
          searchFormData={this.state.searchFormData}
          onSearchButtonClick={this.fetchTable}
          onSearchFormChange={this.onSearchFormChange}
          header={
            <ModalButton
              key="import"
              type="primary"
              style={{ marginBottom: VERTICAL_GUTTER }}
              modalProps={{
                title: '出入金录入',
                visible: this.state.visible,
                onCancel: this.onCancel,
                onOk: this.onOk,
                confirmLoading: this.state.confirmLoading,
              }}
              content={
                <Form
                  ref={node => (this.$form = node)}
                  dataSource={this.state.createFormData}
                  controls={CREATE_FORM_CONTROLS(this.state.bankAccountList)}
                  onValueChange={this.createFormChange}
                  footer={false}
                />
              }
              onClick={this.switchModal}
            >
              出入金录入
            </ModalButton>
          }
        />
      </PageHeaderWrapper>
    );
  }
}

export default ClientManagementDiscrepancyManagement;
