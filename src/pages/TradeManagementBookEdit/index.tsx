import {
  LCM_EVENT_TYPE_MAP,
  LCM_EVENT_TYPE_OPTIONS,
  LCM_EVENT_TYPE_ZHCN_MAP,
  LEG_FIELD,
  LEG_NAME_FIELD,
  LEG_PRICING_FIELD,
  LEG_TYPE_FIELD,
  LEG_TYPE_MAP,
} from '@/constants/common';
import { VERTICAL_GUTTER } from '@/constants/global';
import { allLegTypes } from '@/constants/legColDefs';
import { orderLegColDefs } from '@/constants/legColDefs/common/order';
import { ComputedColDefs } from '@/constants/legColDefs/computedColDefs/ComputedColDefs';
import {
  TradesColDefs,
  TRADESCOLDEFS_LEG_FIELD_MAP,
} from '@/constants/legColDefs/computedColDefs/TradesColDefs';
import { AlUnwindNotionalAmount, InitialNotionalAmount } from '@/constants/legColDefs/extraColDefs';
import Form from '@/design/components/Form';
import { IFormControl } from '@/design/components/Form/types';
import SourceTable from '@/design/components/SourceTable';
import { IColDef } from '@/design/components/Table/types';
import ModalButton from '@/lib/components/_ModalButton2';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { convertObservetions } from '@/services/common';
import { trdTradeGet } from '@/services/general-service';
import {
  bookingTableFormControls,
  convertTradeApiData2PageData,
  convertTradePageData2ApiData,
  createLegDataSourceItem,
  getAddLegItem,
} from '@/services/pages';
import {
  trdPositionLCMEventTypes,
  trdTradeLCMEventProcess,
  trdTradeLCMUnwindAmountGet,
} from '@/services/trade-service';
import { getMoment } from '@/utils';
import { MenuItemDef } from 'ag-grid-community';
import { Button, Col, message, Row } from 'antd';
import { connect } from 'dva';
import produce from 'immer';
import _ from 'lodash';
import moment from 'moment';
import React, { PureComponent } from 'react';
import router from 'umi/router';
import ExportModal from './ExportModal';
import AsianExerciseModal from './modals/AsianExerciseModal';
import BarrierIn from './modals/BarrierIn';
import ExerciseModal from './modals/ExerciseModal';
import ExpirationModal from './modals/ExpirationModal';
import FixingModal from './modals/FixingModal';
import KnockOutModal from './modals/KnockOutModal';
import SettleModal from './modals/SettleModal';
import UnwindModal from './modals/UnwindModal';
import { modalFormControls } from './services';
import { filterObDays } from './utils';

class TradeManagementBookEdit extends PureComponent<any, any> {
  public rowKey: string = 'id';

  public $souceTable: SourceTable = null;

  public $modelButton: ModalButton = null;

  public cacheTyeps = [];

  public activeRowData: any = {};

  public $unwindModal: UnwindModal;

  public $exerciseModal: ExerciseModal;

  public $expirationModal: ExpirationModal;

  public $knockOutModal: KnockOutModal;

  public $fixingModal: FixingModal;

  public $asianExerciseModal: AsianExerciseModal;

  public $barrierIn: BarrierIn;

  public $settleModal: SettleModal;

  public unEditDir = [
    LEG_FIELD.UNDERLYER_MULTIPLIER,
    LEG_FIELD.TERM,
    LEG_FIELD.EFFECTIVE_DATE,
    LEG_FIELD.EXPIRATION_DATE,
    LEG_FIELD.NOTIONAL_AMOUNT_TYPE,
    LEG_FIELD.NOTIONAL_AMOUNT,
  ];

  constructor(props) {
    super(props);
    this.state = {
      unwindModalState: {
        visible: false,
      },
      columnDefs: [],
      dataSource: [],
      loading: false,
      tableFormData: {},
      bookList: [],
      eventTypes: {},
      markets: {},
      visible: false,
      editable: false,
      editablePositionId: '',
      buttonDisable: true,
    };
  }

  public componentDidMount = () => {
    this.loadData();
  };

  public loadData = async (reset = false) => {
    if (!this.props.location.query.id) {
      return message.warn('查看 id 不存在');
    }

    this.setState({ loading: true });

    const { error, data } = await trdTradeGet({
      tradeId: this.props.location.query.id,
    });

    if (error) return;

    const { tableDataSource, tableFormData } = convertTradeApiData2PageData(data);

    const composeTableDataSource = await Promise.all(
      tableDataSource.map(item => {
        return trdTradeLCMUnwindAmountGet({
          tradeId: tableFormData.tradeId,
          positionId: item.id,
        }).then(rsp => {
          const { error, data } = rsp;
          if (error) return item;
          return {
            ...item,
            [LEG_FIELD.INITIAL_NOTIONAL_AMOUNT]: data.initialValue,
            [LEG_FIELD.ALUNWIND_NOTIONAL_AMOUNT]: data.historyValue,
          };
        });
      })
    );

    this.setState({ loading: false });

    if (reset) {
      this.cacheTyeps = [];
      return this.setState(
        {
          dataSource: [],
          columnDefs: [],
        },
        () => {
          this.loadCommon(composeTableDataSource, tableFormData, reset);
        }
      );
    }

    this.loadCommon(composeTableDataSource, tableFormData, reset);
  };

  public loadCommon = (tableDataSource, tableFormData, reset) => {
    // 找到每条腿有的生命周期事件
    if (!allLegTypes.length) return;
    tableDataSource.forEach(item => {
      const leg = allLegTypes.find(it => {
        if (!it) {
          return false;
        }
        return it.type === item.productType;
      });
      trdPositionLCMEventTypes({
        positionId: item.id,
      }).then(rsp => {
        if (rsp.error) return;
        this.setState({
          eventTypes: {
            ...this.state.eventTypes,
            [item.id]: item.id === this.state.editablePositionId ? [] : rsp.data,
          },
        });
      });
      this.addLegData(leg, this.makeData(leg, item));
    });
    this.setState({
      tableFormData,
      loading: false,
    });
  };

  public makeData(leg, data) {
    // data是rowData
    return {
      ...createLegDataSourceItem(leg),
      ...data,
    };
  }

  public addLegData = (leg, rowData) => {
    if (this.cacheTyeps.indexOf(leg.type) === -1) {
      this.cacheTyeps.push(leg.type);
    }
    const index = this.state.dataSource.findIndex(iitem => iitem.positionId === rowData.positionId);
    this.setState(
      produce((state: any) => {
        if (this.cacheTyeps.indexOf(leg.type) !== -1) {
          state.columnDefs = orderLegColDefs(
            _.unionBy<IColDef>(
              [
                {
                  headerName: '持仓ID',
                  field: 'positionId',
                  editable: false,
                },
                {
                  headerName: '状态',
                  field: LEG_FIELD.LCM_EVENT_TYPE,
                  oldEditable: false,
                  editable: false,
                  input: {
                    type: 'select',
                    options: LCM_EVENT_TYPE_OPTIONS,
                  },
                },
                ...state.columnDefs.concat(
                  leg.getColumnDefs('editing').map(col => {
                    return {
                      ...col,
                      oldEditable: col.editable,
                      suppressMenu: true,
                      editable: rowData => {
                        if (rowData.data.positionId === this.state.editablePositionId) {
                          if (this.unEditDir.find(item => item === col.field)) {
                            return false;
                          }
                          return true;
                        }
                        return false;
                      },
                      exsitable: params => {
                        const { colDef, data } = params;
                        return this.judgeLegTypeExsit(colDef, data);
                      },
                    };
                  })
                ),
                {
                  ...InitialNotionalAmount,
                  editable: false,
                },
                {
                  ...AlUnwindNotionalAmount,
                  editable: false,
                },
              ],
              item => item.field
            )
          );
        }
        state.dataSource.splice(index, 0, rowData);
      })
    );
  };

  public judgeLegTypeExsit = (colDef, data) => {
    const legType = allLegTypes.find(it => {
      if (!it) {
        return false;
      }
      return it.type === data[LEG_TYPE_FIELD];
    });

    if (!legType) return false;

    return !!legType.getColumnDefs('editing').find(item => item.field === colDef.field);
  };

  public getHorizontalrColumnDef = params => {
    return {
      headerName: params.rowData[LEG_NAME_FIELD],
      suppressMenu: true,
    };
  };

  public getContextMenuItems = (params): Array<MenuItemDef | string> => {
    return [
      ...(this.state.eventTypes[params.rowData.id] &&
        this.state.eventTypes[params.rowData.id].map(eventType => {
          return {
            name: LCM_EVENT_TYPE_ZHCN_MAP[eventType],
            action: this.bindEventAction(eventType, params),
          };
        })),
      'separator',
      'copy',
      'paste',
    ];
  };

  public handleEditable = rowData => {
    const leg = allLegTypes.find(item => item.type === rowData.productType);
    const dataSource = [...this.state.dataSource];
    this.setState(
      {
        editablePositionId: rowData.positionId,
        dataSource: [],
        buttonDisable: false,
      },
      () => {
        this.loadData();
      }
    );
  };

  public bindEventAction = (eventType, params) => () => {
    const legType = params.rowData[LEG_TYPE_FIELD];

    // 每次操作后及时更新，并保证数据一致性
    this.activeRowData = params.rowData;

    if (eventType === LCM_EVENT_TYPE_MAP.EXPIRATION) {
      return this.$expirationModal.show(
        this.activeRowData,
        this.state.tableFormData,
        this.props.currentUser,
        () => this.loadData(true)
      );
    }

    if (eventType === LCM_EVENT_TYPE_MAP.KNOCK_IN) {
      return this.$barrierIn.show(
        this.activeRowData,
        this.state.tableFormData,
        this.props.currentUser,
        () => this.loadData(true)
      );
    }

    if (eventType === LCM_EVENT_TYPE_MAP.OBSERVE) {
      return this.$fixingModal.show(
        this.activeRowData,
        this.state.tableFormData,
        this.props.currentUser,
        () => this.loadData(true)
      );
    }

    if (eventType === LCM_EVENT_TYPE_MAP.EXERCISE) {
      if (legType === LEG_TYPE_MAP.ASIAN_ANNUAL || legType === LEG_TYPE_MAP.ASIAN_UNANNUAL) {
        const convertedData = filterObDays(convertObservetions(params.rowData));
        if (convertedData.some(item => !item.price)) {
          return message.warn('请先完善观察日价格');
        }

        return this.$asianExerciseModal.show(
          this.activeRowData,
          this.state.tableFormData,
          this.props.currentUser,
          () => this.loadData(true)
        );
      }

      return this.$exerciseModal.show(
        this.activeRowData,
        this.state.tableFormData,
        this.props.currentUser,
        () => this.loadData(true)
      );
    }

    if (eventType === LCM_EVENT_TYPE_MAP.UNWIND) {
      if (this.activeRowData[LEG_FIELD.LCM_EVENT_TYPE] === LCM_EVENT_TYPE_MAP.UNWIND) {
        return message.warn(
          `${LCM_EVENT_TYPE_ZHCN_MAP.UNWIND}状态下无法继续${LCM_EVENT_TYPE_ZHCN_MAP.UNWIND}`
        );
      }

      this.$unwindModal.show(
        this.activeRowData,
        this.state.tableFormData,
        this.props.currentUser,
        () => this.loadData(true)
      );
    }

    if (eventType === LCM_EVENT_TYPE_MAP.ROLL) {
      this.$modelButton.click({
        formControls: modalFormControls({
          info: 'expirationDate',
          name: '到期日',
          input: { type: 'date', startDate: params.rowData.expirationDate },
        }),
        extra: {
          ...params,
          eventType,
        },
      });
    }

    if (eventType === LCM_EVENT_TYPE_MAP.SNOW_BALL_EXERCISE) {
      this.$expirationModal.show(
        this.activeRowData,
        this.state.tableFormData,
        this.props.currentUser,
        () => this.loadData(true)
      );
    }

    if (eventType === LCM_EVENT_TYPE_MAP.KNOCK_OUT) {
      this.$knockOutModal.show(
        this.activeRowData,
        this.state.tableFormData,
        this.props.currentUser,
        () => this.loadData(true)
      );
    }

    if (eventType === LCM_EVENT_TYPE_MAP.SETTLE) {
      return this.$settleModal.show(
        this.activeRowData,
        this.state.tableFormData,
        this.props.currentUser,
        () => this.loadData(true)
      );
    }
  };

  public handleEventType = eventType => {
    switch (eventType) {
      case 'EXERCISE':
        return '行权成功';
      case 'UNWIND':
        return '平仓成功';
      case 'ROLL':
        return '展期成功';
      default:
        break;
    }
  };

  public onConfirm = params => {
    return trdTradeLCMEventProcess({
      positionId: params.extra.rowData.id,
      tradeId: this.state.tableFormData.tradeId,
      eventType: params.extra.eventType,
      userLoginId: this.props.currentUser.userName,
      eventDetail: {
        underlyerPrice: params.formData.underlyerPrice,
        cashFlow: params.formData.cashFlow,
        expirationDate: params.formData.expirationDate
          ? params.formData.expirationDate.format('YYYY-MM-DD')
          : undefined,
      },
    }).then(rsp => {
      if (rsp.error) return;
      setTimeout(() => {
        message.success(this.handleEventType(params.extra.eventType));
        // this.loadData(true);
      }, 100);
      return {
        formData: {},
      };
    });
  };

  public convertVisible = () => {
    this.setState({
      visible: false,
    });
  };

  public abandonModify = () => {
    this.setState(
      {
        buttonDisable: true,
        editablePositionId: '',
        dataSource: [],
      },
      () => {
        this.loadData();
      }
    );
  };

  public onConvertPricing = () => {
    const nextTradesColDefs = TradesColDefs.map(item => ({
      ...item,
      totalable: false,
    }));

    const computedAllLegTypes = allLegTypes.map(item => {
      return {
        ...item,
        columnDefs: item
          .getColumnDefs('pricing')
          .map(item => ({
            ...item,
            totalable: false,
          }))
          .concat(nextTradesColDefs)
          .concat(ComputedColDefs),
      };
    });

    const cacheTyeps = [];

    this.props.dispatch({
      type: 'pricingData/clean',
    });

    this.state.dataSource.forEach(record => {
      const computedLeg = computedAllLegTypes.find(item => item.type === record[LEG_TYPE_FIELD]);

      if (!computedLeg) return;

      if (cacheTyeps.indexOf(computedLeg.type) === -1) {
        cacheTyeps.push(computedLeg.type);
      }

      const legData = getAddLegItem(
        computedLeg,
        createLegDataSourceItem(computedLeg, {
          [LEG_PRICING_FIELD]: true,
        }),
        true
      );

      const rowData = _.mapValues(
        {
          ...legData,
          ..._.pick(record, computedLeg.getColumnDefs('pricing').map(item => item.field)),
          [TRADESCOLDEFS_LEG_FIELD_MAP.UNDERLYER_PRICE]: record[LEG_FIELD.INITIAL_SPOT],
        },
        (val, key) => {
          if (key === LEG_FIELD.EXPIRATION_DATE) {
            return getMoment(record[LEG_FIELD.EXPIRATION_DATE]);
          }
          if (key === LEG_FIELD.EFFECTIVE_DATE) {
            return getMoment(record[LEG_FIELD.EFFECTIVE_DATE]);
          }
          return val;
        }
      );

      this.props.dispatch({
        type: 'pricingData/addLegData',
        payload: {
          cacheTyeps,
          computedLeg,
          computedAllLegTypes,
          nextTradesColDefs,
          rowData,
        },
      });
    });
    router.push({
      pathname: '/trade-management/pricing',
      query: {
        fromEdit: true,
      },
    });
  };

  public saveModify = async () => {
    const modifyData = this.state.dataSource.filter(item => {
      return item.positionId === this.state.editablePositionId;
    });
    const tableFormData = {
      ...this.state.tableFormData,
      tradeDate: moment(this.state.tableFormData.tradeDate),
    };

    const trade = convertTradePageData2ApiData(
      modifyData,
      tableFormData,
      this.props.currentUser.userName
    );

    const { error, data } = await trdTradeLCMEventProcess({
      positionId: modifyData[0].positionId,
      tradeId: trade.tradeId,
      eventType: 'AMEND',
      userLoginId: this.props.currentUser.userName,
      eventDetail: {
        asset: _.omit(trade.positions[0].asset, [
          'lcmEventType',
          'positionId',
          'productType',
          'historyValue',
          'initialValue',
        ]),
        productType: trade.positions[0].productType,
      },
    });
    if (error) {
      message.error('修改失败');
      return;
    }
    message.success('修改成功');
    this.setState({
      editablePositionId: '',
      buttonDisable: true,
      dataSource: [],
    });
    this.loadData();
  };

  public render() {
    return (
      <PageHeaderWrapper back={true}>
        <Form
          dataSource={this.state.tableFormData}
          controlNumberOneRow={5}
          footer={false}
          layout="inline"
          controls={bookingTableFormControls().map<IFormControl>(item => ({
            ...item,
            input: {
              ...item.input,
              type: 'input',
              subtype: 'show',
            },
          }))}
        />
        <SourceTable
          loading={this.state.loading}
          ref={node => (this.$souceTable = node)}
          rowKey={this.rowKey}
          pagination={false}
          vertical={true}
          autoSizeColumnsToFit={false}
          enableSorting={false}
          darkIfDoNotEditable={true}
          getHorizontalrColumnDef={this.getHorizontalrColumnDef}
          getContextMenuItems={this.getContextMenuItems}
          dataSource={this.state.dataSource}
          columnDefs={this.state.columnDefs}
          header={
            <Row
              style={{ marginBottom: VERTICAL_GUTTER, marginTop: VERTICAL_GUTTER }}
              type="flex"
              justify="space-between"
              gutter={16}
            >
              <Col>
                <Button
                  type="primary"
                  disabled={this.state.buttonDisable}
                  onClick={this.saveModify}
                >
                  保存修改
                </Button>
                <Button
                  style={{ marginLeft: 10 }}
                  type="primary"
                  disabled={this.state.buttonDisable}
                  onClick={this.abandonModify}
                >
                  放弃修改
                </Button>
              </Col>
              <Col>
                <Button type="primary" onClick={this.onConvertPricing}>
                  转换定价
                </Button>
              </Col>
            </Row>
          }
        />
        <ModalButton ref={node => (this.$modelButton = node)} onConfirm={this.onConfirm} />
        <UnwindModal ref={node => (this.$unwindModal = node)} />
        <ExerciseModal
          ref={node => {
            this.$exerciseModal = node;
          }}
        />
        <ExpirationModal ref={node => (this.$expirationModal = node)} />
        <KnockOutModal ref={node => (this.$knockOutModal = node)} />
        <FixingModal
          ref={node => {
            this.$fixingModal = node;
          }}
        />
        <AsianExerciseModal
          ref={node => {
            this.$asianExerciseModal = node;
          }}
        />
        <BarrierIn
          ref={node => {
            this.$barrierIn = node;
          }}
        />
        <SettleModal
          ref={node => {
            this.$settleModal = node;
          }}
        />
      </PageHeaderWrapper>
    );
  }
}

export default connect(state => ({
  currentUser: (state.user as any).currentUser,
}))(TradeManagementBookEdit);
