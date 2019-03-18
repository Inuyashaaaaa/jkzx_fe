import { LCM_EVENT_TYPE_OPTIONS } from '@/constants/common';
import SourceTable from '@/design/components/SourceTable';
import Form, { IFormControl } from '@/lib/components/_Form2';
import { IColumnDef } from '@/lib/components/_Table2';
import {
  clientChangeCredit,
  clientSaveAccountOpRecord,
  clientTradeCashFlow,
  cliMmarkTradeTaskProcessed,
  cliTasksGenerateByTradeId,
  cliUnProcessedTradeTaskListByTradeId,
} from '@/services/reference-data-service';
import { Button, message, Modal, Tabs } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import _ from 'lodash';
import { isMoment } from 'moment';
import React, { PureComponent } from 'react';

const TabPane = Tabs.TabPane;

const TABLE_COL_DEFS: IColumnDef[] = [
  {
    headerName: '交易对手',
    field: 'legalName',
    pinned: 'left',
  },
  {
    headerName: '交易编号',
    field: 'tradeId',
  },
  {
    headerName: '账户编号',
    field: 'accountId',
  },
  {
    headerName: '现金流',
    field: 'cashFlow',
  },
  {
    headerName: '生命周期事件',
    field: 'lcmEventType',
    input: {
      type: 'select',
      options: LCM_EVENT_TYPE_OPTIONS,
    },
  },
  {
    headerName: '处理状态',
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

const OUR_CREATE_FORM_CONTROLS: IFormControl[] = [
  {
    options: {
      rules: [
        {
          required: true,
        },
      ],
    },
    control: {
      label: '客户名称',
    },
    dataIndex: 'legalName',
  },
  {
    options: {
      rules: [
        {
          required: true,
        },
      ],
    },
    control: {
      label: '资金类型',
    },
    input: {
      showSearch: true,
      type: 'select',
      options: [
        {
          label: '期权费扣除',
          value: '期权费扣除',
        },
        {
          label: '期权费收入',
          value: '期权费收入',
        },
        {
          label: '授信扣除',
          value: '授信扣除',
        },
        {
          label: '授信恢复',
          value: '授信恢复',
        },
        {
          label: '保证金冻结',
          value: '保证金冻结',
        },
        {
          label: '保证金释放',
          value: '保证金释放',
        },
      ],
    },
    dataIndex: 'cashType',
  },
  {
    options: {
      rules: [
        {
          required: true,
        },
      ],
    },
    control: {
      label: '交易ID',
    },
    dataIndex: 'tradeId',
  },
  {
    options: {
      rules: [
        {
          required: true,
        },
      ],
    },
    control: {
      label: '金额',
    },
    dataIndex: 'cashFlow',
  },
];

const TOOUR_CREATE_FORM_CONTROLS: IFormControl[] = [
  {
    options: {
      rules: [
        {
          required: true,
        },
      ],
    },
    control: {
      label: '客户名称',
    },
    dataIndex: 'legalName',
  },
  {
    options: {
      rules: [
        {
          required: true,
        },
      ],
    },
    control: {
      label: '交易ID',
    },
    dataIndex: 'tradeId',
  },
  {
    options: {
      rules: [
        {
          required: true,
        },
      ],
    },
    control: {
      label: '可用资金变化',
    },
    dataIndex: 'counterPartyFundChange',
  },
  {
    options: {
      rules: [
        {
          required: true,
        },
      ],
    },
    control: {
      label: '剩余授信总额变化',
    },
    dataIndex: 'counterPartyCreditBalanceChange',
  },
  {
    options: {
      rules: [
        {
          required: true,
        },
      ],
    },
    control: {
      label: '授信总额变化',
    },
    dataIndex: 'counterPartyCreditChange',
  },
  {
    options: {
      rules: [
        {
          required: true,
        },
      ],
    },
    control: {
      label: '冻结保证金变化',
    },
    dataIndex: 'counterPartyMarginChange',
  },
];

class ExportModal extends PureComponent<any, any> {
  public $unCreateSourceTable: SourceTable = null;

  public $sourceTable: SourceTable = null;

  public $ourForm: WrappedFormUtils = null;

  public $toOurForm: WrappedFormUtils = null;

  constructor(props) {
    super(props);
    this.state = {
      entryVisible: false,
      createModalDataSource: [],
      activeKey: 'our',
      ourDataSource: [],
      toOurDataSource: [],
    };
  }

  public componentWillReceiveProps = async nextProps => {
    if (nextProps.visible) {
      const { error, data } = await cliTasksGenerateByTradeId({
        tradeId: this.props.trade.tradeId,
        legalName: this.props.trade.counterPartyCode,
      });

      if (error) return false;
      const { error: _error, data: _data } = await cliUnProcessedTradeTaskListByTradeId({
        tradeId: this.props.trade.tradeId,
      });
      if (_error) return false;
      this.setState({
        createModalDataSource: _data,
      });
      return;
    }
  };

  public onFetch = async () => {
    const { error, data } = await cliUnProcessedTradeTaskListByTradeId({
      tradeId: this.modalFormData.tradeId,
    });
    if (error) return false;
    this.setState({
      createModalDataSource: data,
    });
  };

  public handleA = async (uuidList, values, resolve) => {
    const clientTradeCashFlowRsp = await clientTradeCashFlow({
      accountId: this.modalFormData
        ? this.modalFormData.accountId
        : this.state.selectedRows[0].accountId,
      tradeId: values.tradeId,
      cashFlow: String(values.cashFlow),
      marginFlow: String(0),
    });

    if (clientTradeCashFlowRsp.error) {
      return resolve(false);
    }
    if (!clientTradeCashFlowRsp.data.status) {
      message.error(clientTradeCashFlowRsp.data.information);
      return resolve(false);
    }
    const cliMmarkTradeTaskProcessedRsp = await cliMmarkTradeTaskProcessed({
      uuidList,
    });
    if (cliMmarkTradeTaskProcessedRsp.error) {
      return resolve(false);
    }
    resolve(true);
    this.onFetch();
    message.success('录入成功');
  };

  public handleB = async (uuidList, values, resolve) => {
    const clientChangeCreditRsp = await clientChangeCredit({
      accountId: this.modalFormData
        ? this.modalFormData.accountId
        : this.state.selectedRows[0].accountId,
      amount: String(values.cashFlow),
      information: '',
    });

    if (clientChangeCreditRsp.error) {
      return resolve(false);
    }
    if (!clientChangeCreditRsp.data.status) {
      message.error(clientChangeCreditRsp.data.information);
      return resolve(false);
    }
    const cliMmarkTradeTaskProcessedRsp = await cliMmarkTradeTaskProcessed({
      uuidList,
    });
    if (cliMmarkTradeTaskProcessedRsp.error) {
      return resolve(false);
    }
    resolve(true);
    this.onFetch();
    message.success('录入成功');
  };

  public handleC = async (uuidList, values, resolve) => {
    const clientTradeCashFlowRsp = await clientTradeCashFlow({
      accountId: this.modalFormData
        ? this.modalFormData.accountId
        : this.state.selectedRows[0].accountId,
      tradeId: values.tradeId,
      cashFlow: String(0),
      marginFlow: String(values.cashFlow),
    });

    if (clientTradeCashFlowRsp.error) {
      return resolve(false);
    }
    if (!clientTradeCashFlowRsp.data.status) {
      message.error(clientTradeCashFlowRsp.data.information);
      return resolve(false);
    }
    const cliMmarkTradeTaskProcessedRsp = await cliMmarkTradeTaskProcessed({
      uuidList,
    });
    if (cliMmarkTradeTaskProcessedRsp.error) {
      return resolve(false);
    }
    resolve(true);
    this.onFetch();
    message.success('录入成功');
  };

  public createOur = () => {
    const uuidList = [];
    uuidList.push(this.modalFormData ? this.modalFormData.uuid : null);
    return new Promise(resolve => {
      this.$ourForm.validateFields((error, values) => {
        if (error) return resolve(false);
        switch (values.cashType) {
          case '期权费扣除':
            values.cashFlow = '-' + values.cashFlow;
          case '期权费收入':
            return this.handleA(uuidList, values, resolve);
          case '授信扣除':
            values.cashFlow = '-' + values.cashFlow;
          case '授信恢复':
            return this.handleB(uuidList, values, resolve);
          case '保证金释放':
            values.cashFlow = '-' + values.cashFlow;
          case '保证金冻结':
            return this.handleC(uuidList, values, resolve);
          default:
            break;
        }
      });
    });
  };

  public createToOur = () => {
    return new Promise(resolve => {
      this.$toOurForm.validateFields(async (error, values) => {
        if (error) return resolve(false);
        const formatValues = _.mapValues(values, (val, key) => {
          if (isMoment(val)) {
            return val.format('YYYY-MM-DD');
          }
          return val;
        });

        const distValues = {
          ...formatValues,
          accountId: this.modalFormData.accountId,
          event: 'COUNTER_PARTY_CHANGE',
          uuid: '',
          marginChange: '',
          cashChange: '',
          premiumChange: '',
          creditUsedChange: '',
          debtChange: '',
          netDepositChange: '',
          realizedPnLChange: '',
          creditChange: '',
        };

        const clientSaveAccountOpRecordRsp = await clientSaveAccountOpRecord({
          accountOpRecord: distValues,
        });

        if (clientSaveAccountOpRecordRsp.error) return resolve(false);

        const cliMmarkTradeTaskProcessedRsp = await cliMmarkTradeTaskProcessed({
          uuidList: [(this.modalFormData as any).uuid],
        });

        if (cliMmarkTradeTaskProcessedRsp.error) {
          return resolve(false);
        }

        this.onFetch();

        resolve(true);
        message.success('录入成功');
      });
    });
  };

  public handleOk = () => {
    this.setState({
      visible: false,
    });
  };

  public handleCancel = () => {
    this.props.convertVisible();
    this.props.loadData(true);
  };

  public handleEntryOk = () => {
    this.setState(
      {
        entryVisible: false,
      },
      () => {
        if (this.state.activeKey === 'our') {
          return this.createOur();
        } else {
          return this.createToOur();
        }
      }
    );
  };

  public handleChangeValueOur = values => {
    this.setState({
      ourDataSource: values,
    });
  };

  public handleChangeValueToOur = values => {
    this.setState({
      toOurDataSource: values,
    });
  };

  public onChangeTabs = activeKey => {
    this.setState({ activeKey });
  };

  public handleEntryCancel = () => {
    this.setState({
      entryVisible: false,
    });
  };

  public switchModal = async event => {
    this.modalFormData = event.rowData;
    const ourDataSource = {
      legalName: event.rowData.legalName,
      tradeId: event.rowData.tradeId,
      cashFlow: event.rowData.cashFlow,
    };
    const toOurDataSource = {
      legalName: event.rowData.legalName,
      tradeId: event.rowData.tradeId,
      counterPartyFundChange: event.rowData.cashFlow,
      counterPartyCreditBalanceChange: 0,
      counterPartyCreditChange: 0,
      counterPartyMarginChange: 0,
    };
    this.setState({
      entryVisible: true,
      ourDataSource,
      toOurDataSource,
    });
  };

  public render() {
    return (
      <>
        <Modal
          visible={this.props.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={1300}
          footer={false}
        >
          <SourceTable
            rowKey="uuid"
            dataSource={this.state.createModalDataSource}
            ref={node => (this.$unCreateSourceTable = node)}
            columnDefs={TABLE_COL_DEFS}
            rowActions={[
              <Button key="资金录入" type="primary" onClick={this.switchModal}>
                资金录入
              </Button>,
            ]}
            pagination={false}
          />
        </Modal>
        <Modal
          visible={this.state.entryVisible}
          onOk={this.handleEntryOk}
          onCancel={this.handleEntryCancel}
          width={800}
        >
          <Tabs activeKey={this.state.activeKey} onChange={this.onChangeTabs}>
            <TabPane tab="客户资金变动" key="our">
              <Form
                wrappedComponentRef={element => {
                  if (element) {
                    this.$ourForm = element.props.form;
                  }
                  return;
                }}
                dataSource={this.state.ourDataSource}
                controls={OUR_CREATE_FORM_CONTROLS}
                onChangeValue={this.handleChangeValueOur}
                controlNumberOneRow={1}
                footer={false}
              />
            </TabPane>
            <TabPane tab="我方资金变动" key="toOur">
              <Form
                wrappedComponentRef={element => {
                  if (element) {
                    this.$toOurForm = element.props.form;
                  }
                  return;
                }}
                dataSource={this.state.toOurDataSource}
                controls={TOOUR_CREATE_FORM_CONTROLS}
                onChangeValue={this.handleChangeValueToOur}
                controlNumberOneRow={1}
                footer={false}
              />
            </TabPane>
          </Tabs>
        </Modal>
      </>
    );
  }
}

export default ExportModal;
