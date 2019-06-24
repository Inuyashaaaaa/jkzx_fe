import { VERTICAL_GUTTER } from '@/constants/global';
import { Form2, SmartTable } from '@/containers';
import Page from '@/containers/Page';
import { createApprovalProcess } from '@/services/approval';
import { cliFundEventSearch, refBankAccountSearch } from '@/services/reference-data-service';
import { message, Button, Modal, Divider, Row } from 'antd';
import produce from 'immer';
import _ from 'lodash';
import moment, { isMoment } from 'moment';
import React, { PureComponent } from 'react';
import { SEARCH_FORM_CONTROLS, TABLE_COL_DEFS } from './constants';
import { CREATE_FORM_CONTROLS } from './tools';
import router from 'umi/router';
import DownloadExcelButton from '@/containers/DownloadExcelButton';
import SmartForm from '@/containers/SmartForm';
import { formatMoney } from '@/tools';
import {
  PAYMENT_DIRECTION_TYPE_ZHCN_MAP,
  ACCOUNT_DIRECTION_TYPE_ZHCN_MAP,
  PROCESS_STATUS_TYPES_ZHCN_MAPS,
} from '@/constants/common';

class ClientManagementDiscrepancyManagement extends PureComponent {
  public $searchForm: Form2 = null;

  public $createForm: Form2 = null;

  public state = {
    dataSource: [],
    searchFormData: {
      processStatus: Form2.createField('all'),
    },
    loading: false,
    visible: false,
    confirmLoading: false,
    bankAccountList: [],
    createFormData: {
      paymentDate: Form2.createField(moment()),
      accountDirection: Form2.createField('PARTY'),
    },
  };

  public componentDidMount = () => {
    this.fetchTable();
  };

  public handleSearchForm = () => {
    const searchFormData = Form2.getFieldsValue(this.state.searchFormData);
    return {
      ..._.omit(searchFormData, ['paymentDate', 'processStatus']),
      ...(searchFormData.paymentDate
        ? {
            startDate: moment(searchFormData.paymentDate[0]).format('YYYY-MM-DD'),
            endDate: moment(searchFormData.paymentDate[1]).format('YYYY-MM-DD'),
          }
        : null),
      ...(searchFormData.processStatus && searchFormData.processStatus === 'all'
        ? null
        : { processStatus: searchFormData.processStatus }),
    };
  };

  public fetchTable = async () => {
    this.setState({
      loading: true,
    });
    const { error, data } = await cliFundEventSearch(this.handleSearchForm());
    this.setState({
      loading: false,
    });
    if (error) return;
    this.setState({
      dataSource: data,
    });
    return;
  };

  public onSearchFormChange = (props, fields, allFields) => {
    this.setState({
      searchFormData: allFields,
    });
  };

  public onReset = () => {
    this.setState(
      {
        searchFormData: {
          processStatus: Form2.createField('all'),
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
    if (this.$createForm) {
      const { error } = await this.$createForm.validate();
      if (error) return;
    }
    this.setState({
      visible: false,
      confirmLoading: true,
    });
    const { createFormData } = this.state;
    const formatValues = _.mapValues(Form2.getFieldsValue(createFormData), (val, key) => {
      if (isMoment(val)) {
        return val.format('YYYY-MM-DD');
      }
      return val;
    });
    const { error, data } = await createApprovalProcess({
      processName: '财务出入金',
      processData: { ...formatValues },
    });
    this.setState({
      confirmLoading: false,
    });
    if (error) return;
    this.setState(
      produce((state: any) => {
        state.createFormData = {};
      }),
      () => {
        message.success(data.processInstanceId ? '已进入流程' : '资金录入成功');
        if (data.processInstanceId) {
          router.push('/approval-process/process-manangement');
        }
      }
    );
  };

  public createFormChange = async (props, fields, allFields) => {
    const changedValues = fields;
    const values = allFields;
    if (changedValues.clientId) {
      const { error, data } = await refBankAccountSearch({
        legalName: Form2.getFieldValue(values.clientId),
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

  public showModal = () => {
    this.setState({ visible: !this.state.visible });
  };

  public handleDataSource = data => {
    return data.map(item => {
      item.paymentAmount = formatMoney(item.paymentAmount);
      item.paymentDirection =
        PAYMENT_DIRECTION_TYPE_ZHCN_MAP[item.paymentDirection] || item.paymentDirection;
      item.accountDirection =
        ACCOUNT_DIRECTION_TYPE_ZHCN_MAP[item.accountDirection] || item.accountDirection;
      item.processStatus = PROCESS_STATUS_TYPES_ZHCN_MAPS[item.processStatus] || item.processStatus;
      return item;
    });
  };

  public render() {
    return (
      <Page>
        <SmartForm
          spread={3}
          ref={node => (this.$searchForm = node)}
          dataSource={this.state.searchFormData}
          columns={SEARCH_FORM_CONTROLS}
          layout="inline"
          submitText="搜索"
          onResetButtonClick={this.onReset}
          onFieldsChange={this.onSearchFormChange}
          onSubmitButtonClick={this.fetchTable}
        />
        <Divider />
        <Row style={{ marginBottom: '20px' }} type="flex" justify="space-between">
          <Button type="primary" style={{ marginBottom: VERTICAL_GUTTER }} onClick={this.showModal}>
            出入金录入
          </Button>
          <DownloadExcelButton
            style={{ margin: '10px 0' }}
            key="export"
            type="primary"
            data={{
              searchMethod: cliFundEventSearch,
              argument: {
                searchFormData: this.handleSearchForm(),
              },
              cols: TABLE_COL_DEFS,
              name: '财务出入金管理',
              colSwitch: [],
              handleDataSource: this.handleDataSource,
            }}
          >
            导出Excel
          </DownloadExcelButton>
        </Row>

        <SmartTable
          rowKey="uuid"
          columns={TABLE_COL_DEFS}
          loading={this.state.loading}
          dataSource={this.state.dataSource}
        />
        <Modal
          visible={this.state.visible}
          confirmLoading={this.state.confirmLoading}
          title={'出入金录入'}
          onOk={this.onOk}
          onCancel={this.onCancel}
          maskClosable={false}
        >
          <Form2
            ref={node => (this.$createForm = node)}
            dataSource={this.state.createFormData}
            columns={CREATE_FORM_CONTROLS(this.state.bankAccountList)}
            footer={false}
            onFieldsChange={this.createFormChange}
          />
        </Modal>
      </Page>
    );
  }
}

export default ClientManagementDiscrepancyManagement;
