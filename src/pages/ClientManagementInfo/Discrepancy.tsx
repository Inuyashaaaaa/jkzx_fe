import Section from '@/components/Section';
import { INPUT_NUMBER_CURRENCY_CNY_CONFIG, INPUT_NUMBER_DIGITAL_CONFIG } from '@/constants/common';
import { VERTICAL_GUTTER } from '@/constants/global';
import Form from '@/design/components/Form';
import { IFormControl } from '@/design/components/Form/types';
import ModalButton from '@/design/components/ModalButton';
import SourceTable from '@/design/components/SourceTable';
import { IColumnDef } from '@/design/components/Table/types';
import {
  cliFundEventListByClientIds,
  cliFundEventSave,
  refBankAccountSearch,
} from '@/services/reference-data-service';
import { Button, Col, message, Row } from 'antd';
import produce from 'immer';
import _ from 'lodash';
import moment, { isMoment } from 'moment';
import React, { PureComponent } from 'react';

const DISCREPANCY_COL_DEFS: IColumnDef[] = [
  {
    headerName: '交易对手',
    field: 'clientId',
    pinned: 'left',
  },
  {
    headerName: '交易对手银行账号',
    field: 'bankAccount',
  },
  {
    headerName: '序列号',
    field: 'serialNumber',
  },
  {
    headerName: '出入金额',
    field: 'paymentAmount',
    input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  },
  {
    headerName: '方向',
    field: 'paymentDirection',
    input: {
      formatValue: value => {
        if (value === 'IN') {
          return '入金';
        }
        return '出金';
      },
    },
  },
  {
    headerName: '账户类型',
    field: 'accountDirection',
    input: {
      formatValue: value => {
        if (value === 'PARTY') {
          return '客户资金';
        }
        return '我方资金';
      },
    },
  },
  {
    headerName: '支付日期',
    field: 'paymentDate',
    input: {
      type: 'date',
      range: 'day',
    },
  },
  {
    headerName: '状态',
    field: 'processStatus',
    input: {
      formatValue: value => {
        if (value === 'PROCESSED') {
          return '已处理';
        }
        return '未处理';
      },
    },
  },
];

const CREATE_FORM_CONTROLS: (legalNamesList, bankAccountList) => IFormControl[] = (
  legalNamesList,
  bankAccountList
) => [
  {
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
    control: {
      label: '交易对手',
    },
    field: 'clientId',
    input: {
      type: 'select',
      options: legalNamesList,
    },
  },
  {
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
    control: {
      label: '交易对手银行账号',
    },
    input: {
      type: 'select',
      options: bankAccountList,
    },
    field: 'bankAccount',
  },
  {
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
    control: {
      label: '出入金金额',
    },
    field: 'paymentAmount',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
    control: {
      label: '出入金日期',
    },
    field: 'paymentDate',
    input: {
      type: 'date',
      range: 'day',
    },
  },
  {
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
    control: {
      label: '出入金方向',
    },
    input: {
      showSearch: true,
      type: 'select',
      options: [
        {
          label: '入金',
          value: 'IN',
        },
        {
          label: '出金',
          value: 'OUT',
        },
      ],
    },
    field: 'paymentDirection',
  },
  {
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
    control: {
      label: '账户类型',
    },
    input: {
      showSearch: true,
      type: 'select',
      options: [
        {
          label: '我方资金',
          value: 'COUNTER_PARTY',
        },
        {
          label: '客户资金',
          value: 'PARTY',
        },
      ],
    },
    field: 'accountDirection',
  },
];
class Discrepancy extends PureComponent<
  {
    selectedRows: any[];
  },
  {
    discrepancyCreateData: any;
    bankAccountList: any[];
    legalNamesList: any[];
    tableDataSource: any[];
    modalVisible: boolean;
    modalConfirmLoading: boolean;
    loading: boolean;
  }
> {
  public $form: Form;

  constructor(props) {
    super(props);
    this.state = {
      tableDataSource: [],
      legalNamesList: [],
      bankAccountList: [],
      discrepancyCreateData: {},
      modalVisible: false,
      modalConfirmLoading: false,
      loading: false,
    };
  }

  public componentDidMount = () => {
    this.setState(
      {
        discrepancyCreateData: {
          paymentDate: moment(),
        },
      },
      () => this.onFetch()
    );
  };

  public onFetch = async () => {
    const legalNamesList = this.props.selectedRows.map((val, key) => {
      return _.pick(val, ['legalName']).legalName;
    });

    const markets = legalNamesList.map(item => ({
      label: item,
      value: item,
    }));

    this.setState({
      legalNamesList: markets,
    });

    this.setState({
      loading: true,
    });
    const { error, data } = await cliFundEventListByClientIds({
      clientIds: legalNamesList,
    });

    this.setState({
      loading: false,
    });

    if (error) return;

    this.setState({
      tableDataSource: data,
    });
  };

  public onCreate = async () => {
    if (this.$form) {
      const { error } = await this.$form.validate();
      if (error) return;
    }

    const { discrepancyCreateData } = this.state;
    const formatValues = _.mapValues(discrepancyCreateData, (val, key) => {
      if (isMoment(val)) {
        return val.format('YYYY-MM-DD');
      }
      return val;
    });
    this.setState({
      modalConfirmLoading: true,
    });
    const { error, data } = await cliFundEventSave({
      ...formatValues,
    });
    this.setState({
      modalConfirmLoading: false,
    });
    if (error) return;
    this.setState(
      produce((state: any) => {
        state.tableDataSource = state.tableDataSource.concat(data);
        state.discrepancyCreateData = {
          paymentDate: moment(),
        };
        state.modalVisible = false;
      }),
      () => {
        message.success('资金录入成功');
      }
    );
  };

  public onCreateFormChange = async params => {
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
        discrepancyCreateData: values,
      });
      return;
    }
    this.setState({
      discrepancyCreateData: values,
    });
  };

  public onSwitchModal = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    });
  };

  public render() {
    return (
      <>
        <Section>财务出入金管理</Section>
        <SourceTable
          loading={this.state.loading}
          header={
            <Row type="flex" justify="start" style={{ marginBottom: VERTICAL_GUTTER }}>
              <Col>
                <ModalButton
                  type="primary"
                  modalProps={{
                    width: 800,
                    visible: this.state.modalVisible,
                    confirmLoading: this.state.modalConfirmLoading,
                    onOk: this.onCreate,
                    onCancel: this.onSwitchModal,
                    title: '资金录入',
                  }}
                  onClick={this.onSwitchModal}
                  content={
                    <Form
                      ref={node => (this.$form = node)}
                      onValueChange={this.onCreateFormChange}
                      dataSource={this.state.discrepancyCreateData}
                      footer={false}
                      controls={CREATE_FORM_CONTROLS(
                        this.state.legalNamesList,
                        this.state.bankAccountList
                      )}
                    />
                  }
                >
                  资金录入
                </ModalButton>
              </Col>
            </Row>
          }
          rowKey="uuid"
          columnDefs={DISCREPANCY_COL_DEFS}
          dataSource={this.state.tableDataSource}
        />
      </>
    );
  }
}

export default Discrepancy;
