import { LEG_NAME_FIELD, LEG_PRICING_FIELD, LEG_TYPE_FIELD } from '@/constants/common';
import { VERTICAL_GUTTER } from '@/constants/global';
import { allLegTypes } from '@/constants/legColDefs';
import { orderLegColDefs } from '@/constants/legColDefs/common/order';
import { COMPUTED_LEG_FIELDS } from '@/constants/legColDefs/computedColDefs/ComputedColDefs';
import { TRADESCOL_FIELDS } from '@/constants/legColDefs/computedColDefs/TradesColDefs';
import { LEG_MAP } from '@/constants/legType';
import { PRICING_FROM_TAG } from '@/constants/trade';
import MultilLegCreateButton from '@/containers/MultiLegsCreateButton';
import Form from '@/design/components/Form';
import SourceTable from '@/design/components/SourceTable';
import { IColDef } from '@/design/components/Table/types';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { trdBookList } from '@/services/general-service';
import { mktInstrumentWhitelistListPaged } from '@/services/market-data-service';
import {
  convertTradePageData2ApiData,
  createLegDataSourceItem,
  getAddLegItem,
} from '@/services/pages';
import {
  cliAccountListByLegalNames,
  clientChangeCredit,
  clientSaveAccountOpRecord,
  clientTradeCashFlow,
  cliMmarkTradeTaskProcessed,
  cliTasksGenerateByTradeId,
  cliUnProcessedTradeTaskListByTradeId,
  refSalesGetByLegalName,
} from '@/services/reference-data-service';
import { refPartyGetByLegalName, trdTradeCreate } from '@/services/trade-service';
import { GetContextMenuItemsParams, MenuItemDef } from 'ag-grid-community';
import { Button, message, Modal, Row, Tabs } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import BigNumber from 'bignumber.js';
import { connect } from 'dva';
import produce from 'immer';
import _ from 'lodash';
import { isMoment } from 'moment';
import React, { PureComponent } from 'react';
import uuidv4 from 'uuid/v4';
import { OUR_CREATE_FORM_CONTROLS, TABLE_COL_DEFS, TOOUR_CREATE_FORM_CONTROLS } from './constants';
import { bookingTableFormControls } from './services';

const ButtonGroup = Button.Group;

const TabPane = Tabs.TabPane;
class BookCreate extends PureComponent<any> {
  public $unCreateSourceTable: SourceTable = null;

  public $sourceTable: SourceTable = null;

  public $ourForm: WrappedFormUtils = null;

  public $toOurForm: WrappedFormUtils = null;

  public cacheTyeps = [];

  public rowKey = 'id';

  public state = {
    columnDefs: [],
    ourDataSource: [],
    toOurDataSource: [],
    dataSource: [],
    bookList: [],
    mktInstrumentIds: [],
    visible: false,
    entryVisible: false,
    dataSourceEntry: [],
    activeKey: 'our',
    createModalDataSource: [],
    bookTableFormData: {},
    createTradeLoading: false,
    tradeTableData: [],
    tadeInfo: {},
    modalVisible: false,
    entryMargin: true,
  };

  public modalFormData: any;

  constructor(props) {
    super(props);
  }

  public componentDidMount = () => {
    this.loadBookList();
    this.loadInstrumentIds();
    this.initialFromPricingPage();
  };

  public initialFromPricingPage = () => {
    const { location } = this.props;
    const { query } = location;
    const { from } = query;
    if (from === PRICING_FROM_TAG) {
      const dataSource = this.props.pricingData.dataSource.map(item => {
        const leg = LEG_MAP[item[LEG_TYPE_FIELD]];
        return {
          ...leg.getDefault({}, false),
          ..._.omit(item, [...TRADESCOL_FIELDS, ...COMPUTED_LEG_FIELDS]),
          [LEG_PRICING_FIELD]: false,
        };
      });
      this.setState({
        dataSource,
        columnDefs: orderLegColDefs(
          _.unionBy(
            _.reject(
              this.props.pricingData.columnDefs,
              item => [...TRADESCOL_FIELDS, ...COMPUTED_LEG_FIELDS].indexOf(item.field) !== -1
            ).concat(
              dataSource.reduce((container, item) => {
                const leg = LEG_MAP[item[LEG_TYPE_FIELD]];
                return container.concat(leg.columnDefs);
              }, [])
            ),
            item => item.field
          )
        ),
      });
    }
  };

  public loadBookList = () => {
    trdBookList().then(rsp => {
      if (rsp.error) return;
      this.setState({
        bookList: rsp.data,
      });
    });
  };

  public loadInstrumentIds = () => {
    mktInstrumentWhitelistListPaged().then(rsp => {
      if (rsp.error) return;
      this.setState({
        mktInstrumentIds: rsp.data.page,
      });
    });
  };

  public judgeLegTypeExsit = (colDef, data) => {
    // 纵向表格，删除一行数据时，已删除 colDef 会执行一次 render ？
    if (!data) return false;

    const legType = allLegTypes.find(item => item.type === data[LEG_TYPE_FIELD]);

    if (!legType) return false;

    return !!legType.columnDefs.find(item => item.field === colDef.field);
  };

  public handleAddLeg = event => {
    const leg = allLegTypes.find(item => item.type === event.key);

    if (!leg) return;

    if (this.cacheTyeps.indexOf(leg.type) === -1) {
      this.cacheTyeps.push(leg.type);
    }

    this.addLegData(leg, getAddLegItem(leg, createLegDataSourceItem(leg)));
  };

  public handleJudge = params => {
    const { colDef, data } = params;
    return this.judgeLegTypeExsit(colDef, data);
  };

  public addLegData = (leg, rowData) => {
    this.setState(
      produce((state: any) => {
        if (this.cacheTyeps.indexOf(leg.type) !== -1) {
          state.columnDefs = orderLegColDefs(
            _.unionBy<IColDef>(
              state.columnDefs.concat(
                leg.columnDefs.map(col => {
                  return {
                    ...col,
                    suppressMenu: true,
                    editable: col.editable
                      ? params => {
                          if (typeof col.editable === 'function') {
                            if (col.editable(params)) {
                              return this.handleJudge(params);
                            } else {
                              return false;
                            }
                          }
                          return this.handleJudge(params);
                        }
                      : false,
                    exsitable: params => {
                      const legExsitable = this.handleJudge(params);
                      if (!legExsitable) return false;
                      if (typeof col.exsitable === 'function') {
                        return col.exsitable(params);
                      }
                      return col.exsitable === undefined ? true : col.exsitable;
                    },
                  };
                })
              ),
              item => item.field
            )
          );
        }
        state.dataSource.push(rowData);
      })
    );
  };

  public getHorizontalrColumnDef = params => {
    return {
      headerName: params.rowData[LEG_NAME_FIELD],
      suppressMenu: true,
    };
  };

  public getContextMenuItems = (params: GetContextMenuItemsParams): Array<MenuItemDef | string> => {
    return [
      {
        name: '复制该腿',
        action: () => this.copyLegData(params),
      },
      {
        name: '删除该腿',
        action: () => this.removeLegData(params),
      },
      'separator',
      'copy',
      'paste',
    ];
  };

  public removeLegData = (params: GetContextMenuItemsParams) => {
    if (!params.column) return;

    const id = params.column.getColDef().field;
    this.setState(
      produce((state: any) => {
        const index = state.dataSource.findIndex(item => item[this.rowKey] === id);
        state.dataSource.splice(index, 1);

        if (state.dataSource.length === 0) {
          state.columnDefs = [];
        }
      })
    );
  };

  public copyLegData = (params: GetContextMenuItemsParams) => {
    if (!params.column) return;

    const colField = params.column.getColDef().field;
    const leg = this.getLeyByCoField(colField);

    if (!leg) return;

    this.addLegData(leg, {
      ...this.getDataItemByColField(colField),
      id: uuidv4(),
    });
  };

  public getLeyByCoField = colField => {
    const legType = this.getLegTypeByColField(colField);
    return allLegTypes.find(item => item.type === legType);
  };

  public getLegTypeByColField = colField => {
    return _.get(this.getDataItemByColField(colField), LEG_TYPE_FIELD);
  };

  public getDataItemByColField = colField => {
    return this.state.dataSource.find(item => item.id === colField);
  };

  public createTrade = async () => {
    const tableDataSource = this.state.dataSource;

    const trade = convertTradePageData2ApiData(
      tableDataSource,
      _.mapValues(this.state.bookTableFormData, (val, key) => {
        if (key === 'tradeId') {
          return val && (val as string).replace('.', '-');
        }
        return val;
      }),
      this.props.currentUser.userName
    );

    const { error } = await trdTradeCreate({
      trade,
      validTime: '2018-01-01T10:10:10',
    });

    if (error) return;

    const { error: _error, data: _data } = await cliTasksGenerateByTradeId({
      tradeId: trade.tradeId,
      legalName: trade.positions[0].counterPartyCode,
    });

    if (_error) return;

    this.setState({
      dataSource: [],
      createModalDataSource: _data,
      visible: true,
      bookTableFormData: {},
    });
  };

  public onCreateTradeButtonClick = async () => {
    const validateTableFormRsp: any = await this.$sourceTable.validateTableForm();

    if (validateTableFormRsp.error) return;

    const validateTableRsp: any = await this.$sourceTable.validateTable();

    if (validateTableRsp.error) return;

    if (!this.state.dataSource.length) {
      return message.warn('请添加期权结构');
    }

    this.setState({
      createTradeLoading: true,
    });
    await this.createTrade();
    this.setState({
      createTradeLoading: false,
    });
  };

  public getRef = node => {
    this.$sourceTable = node;
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
    this.setState({
      visible: false,
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

  public handleChangeValueEntry = value => {
    this.setState({
      dataSourceEntry: value,
    });
  };

  public handleChangeValueOur = params => {
    const values = params.values;
    if (values.cashType === '保证金释放' || values.cashType === '保证金冻结') {
      this.setState({
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

  public onChangeTabs = activeKey => {
    this.setState({ activeKey });
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

  public onTableFormChange = async params => {
    if (params.changedValues.counterPartyCode) {
      this.fetchCounterPartyCode(params.values);

      const refSalesGetByLegalNameRsp = await refSalesGetByLegalName({
        legalName: params.changedValues.counterPartyCode,
      });
      if (refSalesGetByLegalNameRsp.error) return;
      return this.setState({
        bookTableFormData: {
          ...params.values,
          salesCode: refSalesGetByLegalNameRsp.data.salesName,
        },
      });
    }

    this.setState({
      bookTableFormData: {
        ...params.values,
      },
    });
  };

  public fetchCounterPartyCode = async values => {
    const [refPartyGetByLegalNameRsp, cliAccountListByLegalNamesRsp] = await Promise.all([
      refPartyGetByLegalName({
        legalName: values.counterPartyCode,
      }),
      cliAccountListByLegalNames({
        legalNames: [values.counterPartyCode],
      }),
    ]);

    if (!refPartyGetByLegalNameRsp.error) {
      this.setState({
        tadeInfo: refPartyGetByLegalNameRsp.data,
        tradeTableData: !refPartyGetByLegalNameRsp.data.authorizers
          ? []
          : refPartyGetByLegalNameRsp.data.authorizers,
      });
    }

    if (!cliAccountListByLegalNamesRsp.error) {
      this.setState({
        tadeInfo: {
          ...this.state.tadeInfo,
          cash: cliAccountListByLegalNamesRsp.data[0].cash,
        },
      });
    }
  };

  public onSwtichModal = async () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    });
  };

  public onClearCounterPartyCodeButtonClick = () => {
    this.setState(
      {
        modalVisible: false,
      },
      () => {
        this.$sourceTable.$baseSourceTable.$tableForm.setFieldsValue({
          counterPartyCode: undefined,
          salesCode: undefined,
        });
      }
    );
  };

  public render() {
    return (
      <PageHeaderWrapper>
        <SourceTable
          header={
            <Row style={{ marginBottom: VERTICAL_GUTTER }}>
              <ButtonGroup>
                <MultilLegCreateButton
                  isPricing={false}
                  key="create"
                  handleAddLeg={this.handleAddLeg}
                />
                <Button
                  key="完成簿记"
                  type="primary"
                  loading={this.state.createTradeLoading}
                  onClick={this.onCreateTradeButtonClick}
                >
                  完成簿记
                </Button>
              </ButtonGroup>
            </Row>
          }
          tableFormData={this.state.bookTableFormData}
          onTableFormChange={this.onTableFormChange}
          tableFormControls={bookingTableFormControls(
            this.state.bookTableFormData,
            this.state.tadeInfo,
            this.state.tradeTableData,
            this.onSwtichModal,
            this.state.modalVisible,
            this.onClearCounterPartyCodeButtonClick
          ).map(item => {
            if (item.field === 'salesCode') return item;
            return {
              ...item,
              decorator: {
                rules: [
                  {
                    required: true,
                  },
                ],
              },
            };
          })}
          ref={this.getRef}
          rowKey={this.rowKey}
          vertical={true}
          autoSizeColumnsToFit={false}
          darkIfDoNotEditable={true}
          enableSorting={false}
          getHorizontalrColumnDef={this.getHorizontalrColumnDef}
          getContextMenuItems={this.getContextMenuItems}
          dataSource={this.state.dataSource}
          columnDefs={this.state.columnDefs}
          pagination={false}
        />
        <Modal
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={1300}
          footer={false}
          title="现金流管理"
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
                controls={OUR_CREATE_FORM_CONTROLS(this.state.entryMargin)}
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
                controls={TOOUR_CREATE_FORM_CONTROLS}
                onValueChange={this.handleChangeValueToOur}
                controlNumberOneRow={1}
                footer={false}
              />
            </TabPane>
          </Tabs>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default connect(state => ({
  currentUser: (state.user as any).currentUser,
  pricingData: state.pricingData,
}))(BookCreate);
