import Section from '@/components/Section';
import Form from '@/design/components/Form';
import SourceTable from '@/lib/components/_SourceTable';
import {
  clientAccountOpRecordList,
  clientChangeCredit,
  clientSaveAccountOpRecord,
  clientTradeCashFlow,
  cliMmarkTradeTaskProcessed,
  cliTradeTaskListByLegalNames,
} from '@/services/reference-data-service';
import { Button, message, Modal, Tabs } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import _ from 'lodash';
import { isMoment } from 'moment';
import React, { PureComponent } from 'react';
import {
  IOGLOD_COL_DEFS,
  OUR_CREATE_FORM_CONTROLS,
  TOOUR_CREATE_FORM_CONTROLS,
  UNCREATE_TABLE_COL_DEFS,
} from './constants/ioglod';
const TabPane = Tabs.TabPane;

export interface IOGlodProps {
  selectedRows: any[];
}

class IOGlod extends PureComponent<IOGlodProps> {
  public $ourForm: WrappedFormUtils = null;

  public $toOurForm: WrappedFormUtils = null;

  public $unCreateSourceTable: SourceTable = null;

  public $IOGlodSourceTable: SourceTable = null;

  public modalFormData: {};

  public $ourForm2: WrappedFormUtils = null;

  public $toOurForm2: WrappedFormUtils = null;

  public state = {
    visible: false,
    activeKey: 'our',
    unCreateDataSource: [],
    entryVisible: false,
    item: true,
    legalNamesList: [],
    selectedRows: [],
    ioGoldDataSource: [],
    ourDataSource: {},
    toOurDataSource: {},
    ourDataSource2: {},
    toOurDataSource2: {},
    IOGlodSourceTableLoading: false,
    accountId: '',
    margin: true,
    entryMargin: true,
  };

  public componentDidMount = () => {
    this.onFetch();
  };

  public onFetch = async () => {
    const legalNamesList = this.props.selectedRows.map((val, key) => {
      return _.pick(val, ['legalName']).legalName;
    });

    const accountIdList = this.props.selectedRows.map((val, key) => {
      return _.pick(val, ['accountId']).accountId;
    });

    const markets = legalNamesList.map(item => ({
      label: item,
      value: item,
    }));
    this.setState({
      legalNamesList: markets,
    });
    this.setState({
      IOGlodSourceTableLoading: true,
    });
    const { error, data } = await clientAccountOpRecordList({
      accountIds: accountIdList,
    });
    this.setState({
      IOGlodSourceTableLoading: false,
    });
    if (error) return false;
    this.setState({
      ioGoldDataSource: data,
    });
  };

  public onFetchUnCreate = async () => {
    const legalNamesList = this.props.selectedRows.map((val, key) => {
      return _.pick(val, ['legalName']).legalName;
    });

    const { error, data } = await cliTradeTaskListByLegalNames({
      legalNames: legalNamesList,
    });

    if (error) return false;
    return data;
  };

  public switchModal = event => {
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
    this.$unCreateSourceTable.search();
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
    this.$unCreateSourceTable.search();
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
    this.$unCreateSourceTable.search();
    message.success('录入成功');
  };

  public handleAIO = async (uuidList, values, resolve) => {
    const clientTradeCashFlowRsp = await clientTradeCashFlow({
      accountId: this.state.accountId,
      tradeId: values.tradeId,
      cashFlow: String(values.cashFlow),
      marginFlow: String(0),
    });

    if (clientTradeCashFlowRsp.error) {
      message.error(clientTradeCashFlowRsp.data.information);
      return resolve(false);
    }

    if (!clientTradeCashFlowRsp.data.status) {
      return resolve(false);
    }

    this.onFetch();
    return resolve({
      message: '录入成功',
    });
  };

  public handleBIO = async (uuidList, values, resolve) => {
    const clientChangeCreditRsp = await clientChangeCredit({
      accountId: this.state.accountId,
      amount: String(values.cashFlow),
      information: '',
    });

    if (clientChangeCreditRsp.error) {
      return resolve(false);
    }
    if (!clientChangeCreditRsp.data.status) {
      message.error(clientTradeCashFlowRsp.data.information);
      return resolve(false);
    }

    this.onFetch();
    return resolve({
      message: '录入成功',
    });
  };

  public handleCIO = async (uuidList, values, resolve) => {
    const clientTradeCashFlowRsp = await clientTradeCashFlow({
      accountId: this.state.accountId,
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

    this.onFetch();
    return resolve({
      message: '录入成功',
    });
  };

  public createOurIo = () => {
    const uuidList = [];
    return new Promise(resolve => {
      this.$ourForm2.validateFields((error, values) => {
        if (error) return resolve(false);
        switch (values.cashType) {
          case '期权费扣除':
            values.cashFlow = '-' + values.cashFlow;
          case '期权费收入':
            return this.handleAIO(uuidList, values, resolve);
          case '授信扣除':
            values.cashFlow = '-' + values.cashFlow;
          case '授信恢复':
            return this.handleBIO(uuidList, values, resolve);
          case '保证金释放':
            values.cashFlow = '-' + values.cashFlow;
          case '保证金冻结':
            return this.handleCIO(uuidList, values, resolve);
          default:
            break;
        }
      });
    });
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

        this.$unCreateSourceTable.search();
        resolve(true);
        message.success('录入成功');
      });
    });
  };

  public createToOurIo = () => {
    return new Promise(resolve => {
      this.$toOurForm2.validateFields(async (error, values) => {
        if (error) return resolve(false);

        const formatValues = _.mapValues(values, (val, key) => {
          if (isMoment(val)) {
            return val.format('YYYY-MM-DD');
          }
          return val;
        });

        const distValues = {
          ...formatValues,
          accountId: this.state.accountId,
          // event: this.modalFormData ? 'COUNTER_PARTY_CHANGE' : 'START_TRADE',
          event: 'START_TRADE',
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

        if (clientSaveAccountOpRecordRsp.error) {
          return resolve(false);
        }

        this.onFetch();
        resolve({
          message: '录入成功',
        });
      });
    });
  };

  public onCreate = event => {
    if (this.state.activeKey === 'our') {
      return this.createOur();
    } else {
      return this.createToOur();
    }
  };

  public onCreateIo = event => {
    if (this.state.activeKey === 'our') {
      return this.createOurIo().then(result => {
        if (result) {
          this.onFetch();
        }
        return result;
      });
    } else {
      return this.createToOurIo().then(result => {
        if (result) {
          this.onFetch();
        }
        return result;
      });
    }
  };

  public handleChangeValueOur = params => {
    const values = params.values;
    if (values.cashType === '保证金释放' || values.cashType === '保证金冻结') {
      this.setState({
        item: false,
        entryMargin: false,
        ourDataSource: values,
      });
      return;
    }

    this.setState({
      entryMargin: true,
      ourDataSource: {
        ...values,
        tradeId: this.modalFormData.tradeId,
      },
    });
  };

  public handleChangeValueToOur = params => {
    const values = params.values;
    this.setState({
      toOurDataSource: values,
    });
  };

  public handleChangeValueOur2 = params => {
    const values = params.values;
    if (values.cashType === '保证金释放' || values.cashType === '保证金冻结') {
      this.setState({
        item: false,
        margin: false,
        ourDataSource2: values,
      });
      return;
    }

    const legalAccountList = this.props.selectedRows.map((val, key) => {
      return _.pick(val, ['legalName', 'accountId']);
    });
    let accountId;
    if (values.legalName) {
      accountId = _.filter(legalAccountList, { legalName: values.legalName })[0].accountId;
      this.setState({
        accountId,
      });
    }
    this.setState({
      margin: true,
      ourDataSource2: values,
    });
  };

  public handleChangeValueToOur2 = params => {
    const values = params.values;
    const legalAccountList = this.props.selectedRows.map((val, key) => {
      return _.pick(val, ['legalName', 'accountId']);
    });
    let accountId;
    if (values.legalName) {
      accountId = _.filter(legalAccountList, { legalName: values.legalName })[0].accountId;
      this.setState({
        accountId,
      });
    }
    this.setState({
      toOurDataSource2: values,
    });
  };

  public onChangeTabs = activeKey => {
    this.setState({
      activeKey,
    });
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

  public handleEntryCancel = () => {
    this.setState({
      entryVisible: false,
    });
  };

  public onSwitchIOCreateModal = () => {
    // const rowData = this.state.selectedRows[0];
    const ourDataSource2 = {
      cashFlow: 0,
    };
    const toOurDataSource2 = {
      counterPartyFundChange: 0,
      counterPartyCreditBalanceChange: 0,
      counterPartyCreditChange: 0,
      counterPartyMarginChange: 0,
    };
    this.setState({
      ourDataSource2,
      toOurDataSource2,
    });
  };

  public render() {
    return (
      <>
        {/* <Modal visible={this.state.visible} onCancel={this.switchModal} closable={false}>
          <Tabs defaultActiveKey="保证金事件">
            <TabPane tab="保证金事件" key="保证金事件">
              <Form
                ref={node => (this.$form = node)}
                controls={MARGIN_FORM_CONTROLS}
                controlNumberOneRow={1}
                footer={false}
              />
            </TabPane>
            <TabPane tab="现金流事件" key="现金流事件">
              <Form
                ref={node => (this.$form = node)}
                controls={CASH_FLOW_FORM_ONTROLS}
                controlNumberOneRow={1}
                footer={false}
              />
            </TabPane>
            <TabPane tab="授信改变事件" key="授信改变事件">
              <Form
                ref={node => (this.$form = node)}
                controls={CREDIT_TO_CHANGE_FORM_CONTROLS}
                controlNumberOneRow={1}
                footer={false}
              />
            </TabPane>
            <TabPane tab="出入金事件" key="出入金事件">
              <Form
                ref={node => (this.$form = node)}
                controls={IO_FORM_CONTROLS}
                controlNumberOneRow={1}
                footer={false}
              />
            </TabPane>
          </Tabs>
        </Modal> */}
        <Section>待处理任务</Section>
        <SourceTable
          rowKey="uuid"
          ref={node => (this.$unCreateSourceTable = node)}
          tableColumnDefs={UNCREATE_TABLE_COL_DEFS}
          tableProps={{
            height: undefined,
          }}
          onSearch={this.onFetchUnCreate}
          rowActions={[
            <Button key="资金录入" type="primary" onClick={this.switchModal}>
              资金录入
            </Button>,
          ]}
        />
        <Section>账户流水</Section>
        <SourceTable
          loading={this.state.IOGlodSourceTableLoading}
          rowKey="uuid"
          ref={node => (this.$IOGlodSourceTable = node)}
          createText="资金录入"
          tableColumnDefs={IOGLOD_COL_DEFS}
          onSearch={this.onFetch}
          tableProps={{
            height: undefined,
            autoSizeColumnsToFit: false,
          }}
          dataSource={this.state.ioGoldDataSource}
          onCreate={this.onCreateIo}
          // createButtonProps={{
          //   disabled: !this.state.selectedRows.length,
          // }}
          onSwitchCreateModal={this.onSwitchIOCreateModal}
          createModalProps={{ width: 650 }}
          createModalContent={
            <Tabs activeKey={this.state.activeKey} onChange={this.onChangeTabs}>
              <TabPane tab="客户资金变动" key="our">
                <Form
                  wrappedComponentRef={element => {
                    if (element) {
                      this.$ourForm2 = element.props.form;
                    }
                    return;
                  }}
                  dataSource={this.state.ourDataSource2}
                  controls={OUR_CREATE_FORM_CONTROLS(this.state.legalNamesList, this.state.margin)}
                  onValueChange={this.handleChangeValueOur2}
                  controlNumberOneRow={1}
                  footer={false}
                />
              </TabPane>
              <TabPane tab="我方资金变动" key="toOur">
                <Form
                  wrappedComponentRef={element => {
                    if (element) {
                      this.$toOurForm2 = element.props.form;
                    }
                    return;
                  }}
                  dataSource={this.state.toOurDataSource2}
                  controls={TOOUR_CREATE_FORM_CONTROLS(this.state.legalNamesList)}
                  onValueChange={this.handleChangeValueToOur2}
                  controlNumberOneRow={1}
                  footer={false}
                />
              </TabPane>
            </Tabs>
          }
          // extraActions={[
          //   <Button key="资金操作" onClick={this.switchModal}>
          //     资金操作
          //   </Button>,
          // ]}
          // extraActions={[<Button key="资金操作">资金操作</Button>]}
          // tableProps={{
          //   autoSizeColumnsToFit: false,
          // }}
        />
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
                controls={OUR_CREATE_FORM_CONTROLS(
                  this.state.legalNamesList,
                  this.state.entryMargin
                )}
                onValueChange={this.handleChangeValueOur}
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
                controls={TOOUR_CREATE_FORM_CONTROLS(this.state.legalNamesList)}
                onValueChange={this.handleChangeValueToOur}
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

export default IOGlod;
