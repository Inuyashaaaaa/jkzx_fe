import Section from '@/components/Section';
import { VERTICAL_GUTTER } from '@/constants/global';
import { ModalButton } from '@/design/components';
import Form from '@/design/components/Form';
import SourceTable from '@/design/components/SourceTable';
import {
  clientAccountOpRecordList,
  clientChangeCredit,
  clientSaveAccountOpRecord,
  clientTradeCashFlow,
  cliMmarkTradeTaskProcessed,
  cliTradeTaskListByLegalNames,
} from '@/services/reference-data-service';
import { Button, message, Modal, Row, Tabs } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import BigNumber from 'bignumber.js';
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
    confirmLoading: false,
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
    unCreateTableDataSource: [],
    unCreateLoading: false,
  };

  public componentDidMount = () => {
    this.onFetch();
    this.onFetchUnCreate();
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
      IOGlodSourceTableLoading: true,
    });
    const { error, data } = await clientAccountOpRecordList({
      accountIds: accountIdList,
    });
    this.setState({
      IOGlodSourceTableLoading: false,
    });
    if (error) return;
    this.setState({
      ioGoldDataSource: data,
    });
  };

  public onFetchUnCreate = async () => {
    const legalNamesList = this.props.selectedRows.map((val, key) => {
      return _.pick(val, ['legalName']).legalName;
    });

    this.setState({ unCreateLoading: true });
    const { error, data } = await cliTradeTaskListByLegalNames({
      legalNames: legalNamesList,
    });
    this.setState({ unCreateLoading: false });

    if (error) return;
    this.setState({
      unCreateTableDataSource: data,
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
    this.onFetchUnCreate();
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
    this.onFetchUnCreate();
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
    this.onFetchUnCreate();
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
            values.cashFlow = new BigNumber(values.cashFlow).negated().toNumber();
          case '期权费收入':
            return this.handleAIO(uuidList, values, resolve);
          case '授信扣除':
            values.cashFlow = new BigNumber(values.cashFlow).negated().toNumber();
          case '授信恢复':
            return this.handleBIO(uuidList, values, resolve);
          case '保证金释放':
            values.cashFlow = new BigNumber(values.cashFlow).negated().toNumber();
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
            values.cashFlow = new BigNumber(values.cashFlow).negated().toNumber();
          case '期权费收入':
            return this.handleA(uuidList, values, resolve);
          case '授信扣除':
            values.cashFlow = new BigNumber(values.cashFlow).negated().toNumber();
          case '授信恢复':
            return this.handleB(uuidList, values, resolve);
          case '保证金释放':
            values.cashFlow = new BigNumber(values.cashFlow).negated().toNumber();
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

        this.onFetchUnCreate();
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

  public handleEntryOk = async () => {
    this.setState({ confirmLoading: true });
    const success = await (this.state.activeKey === 'our' ? this.createOur() : this.createToOur());
    this.setState({ confirmLoading: false });

    if (success) {
      this.setState({
        entryVisible: false,
      });
    }
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
        <Section>待处理任务</Section>
        <SourceTable
          rowKey="uuid"
          loading={this.state.unCreateLoading}
          dataSource={this.state.unCreateTableDataSource}
          ref={node => (this.$unCreateSourceTable = node)}
          columnDefs={UNCREATE_TABLE_COL_DEFS}
          height={undefined}
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
          columnDefs={IOGLOD_COL_DEFS}
          height={undefined}
          autoSizeColumnsToFit={false}
          dataSource={this.state.ioGoldDataSource}
          header={
            <Row style={{ marginBottom: VERTICAL_GUTTER }}>
              <ModalButton
                onClick={this.onSwitchIOCreateModal}
                modalProps={{
                  onOk: this.onCreateIo,
                  width: 650,
                }}
                content={
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
                        controls={OUR_CREATE_FORM_CONTROLS(
                          this.state.legalNamesList,
                          this.state.margin
                        )}
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
              >
                资金录入
              </ModalButton>
            </Row>
          }
        />
        <Modal
          visible={this.state.entryVisible}
          onOk={this.handleEntryOk}
          onCancel={this.handleEntryCancel}
          width={800}
          confirmLoading={this.state.confirmLoading}
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
