import {
  LCM_EVENT_TYPE_MAP,
  LCM_EVENT_TYPE_OPTIONS,
  LCM_EVENT_TYPE_ZHCN_MAP,
  LEG_FIELD,
  LEG_NAME_FIELD,
  LEG_TYPE_FIELD,
  LEG_TYPE_MAP,
} from '@/constants/common';
import { allLegTypes } from '@/constants/legColDefs';
import { orderLegColDefs } from '@/constants/legColDefs/common/order';
import { AlUnwindNotionalAmount, InitialNotionalAmount } from '@/constants/legColDefs/extraColDefs';
import { IFormControl } from '@/design/components/Form/types';
import SourceTable from '@/design/components/SourceTable';
import { IColDef } from '@/design/components/Table/types';
import ModalButton from '@/lib/components/_ModalButton2';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { convertObservetions } from '@/services/common';
import { trdBookList, trdTradeGet } from '@/services/general-service';
import {
  bookingTableFormControls,
  convertTradeApiData2PageData,
  createLegDataSourceItem,
} from '@/services/pages';
import {
  trdPositionLCMEventTypes,
  trdTradeLCMEventProcess,
  trdTradeLCMUnwindAmountGet,
} from '@/services/trade-service';
import { GetContextMenuItemsParams, MenuItemDef } from 'ag-grid-community';
import { message } from 'antd';
import { connect } from 'dva';
import produce from 'immer';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import uuidv4 from 'uuid/v4';
import ExportModal from './ExportModal';
import AsianExerciseModal from './modals/AsianExerciseModal';
import ExerciseModal from './modals/ExerciseModal';
import FixingModal from './modals/FixingModal';
import UnwindModal from './modals/UnwindModal';
import { modalFormControls } from './services';

class TradeManagementBookEdit extends PureComponent<any, any> {
  public rowKey: string = 'id';

  public $souceTable: SourceTable = null;

  public $modelButton: ModalButton = null;

  public cacheTyeps = [];

  public activeRowData: any = {};

  public $unwindModal: UnwindModal;

  public $exerciseModal: ExerciseModal;

  public $fixingModal: FixingModal;

  public $asianExerciseModal: AsianExerciseModal;

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
    };
  }

  public componentDidMount = () => {
    trdBookList().then(rsp => {
      if (rsp.error) return;
      this.setState({
        bookList: rsp.data,
      });
    });

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
          // setTimeout(() => {
          //   this.computeCellValues();
          // }, 0);
        }
      );
    }

    this.loadCommon(composeTableDataSource, tableFormData, reset);
    // setTimeout(() => {
    //   this.computeCellValues();
    // }, 0);
  };

  public getDepends = (getValue, data, colDef) => {
    if (colDef.oldEditable) return [];
    if (!getValue) return [];
    if (typeof getValue === 'function') {
      const result = getValue({ data, colDef }) || {};
      return result.depends || [];
    }
    return getValue.depends || [];
  };

  public computeCellValues = () => {
    const dependeds = _.flatten(
      this.state.dataSource.map(dataSourceItem => {
        return _.union<string>(
          this.state.columnDefs.reduce((arr, item) => {
            return arr.concat(this.getDepends(item.getValue, dataSourceItem, item));
          }, [])
        );
      })
    );

    this.state.dataSource.forEach(rowData => {
      const rowId = rowData[this.rowKey];
      dependeds.forEach(colField => {
        const value = rowData[colField];
        this.$souceTable.$baseSourceTable.$table.$baseTable.setCellValue(rowId, colField, value);
      });
    });
  };

  public loadCommon = (tableDataSource, tableFormData, reset) => {
    tableDataSource.forEach(item => {
      const leg = allLegTypes.find(it => it.type === item.productType);

      trdPositionLCMEventTypes({
        positionId: item.id,
      }).then(rsp => {
        if (rsp.error) return;
        this.setState({
          eventTypes: {
            ...this.state.eventTypes,
            [item.id]: rsp.data,
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
    return {
      ...createLegDataSourceItem(leg),
      ...data,
    };
  }

  public judgeLegTypeExsit = (colDef, data) => {
    const legType = allLegTypes.find(item => item.type === data[LEG_TYPE_FIELD]);

    if (!legType) return false;

    return !!legType.columnDefs.find(item => item.field === colDef.field);
  };

  public handleAddLeg = event => {
    const leg = allLegTypes.find(item => item.type === event.key);

    if (!leg) return;

    const id = uuidv4();
    this.addLegData(leg, { id, [LEG_TYPE_FIELD]: leg.type });
  };

  public addLegData = (leg, rowData) => {
    if (this.cacheTyeps.indexOf(leg.type) === -1) {
      this.cacheTyeps.push(leg.type);
    }

    this.setState(
      produce((state: any) => {
        if (this.cacheTyeps.indexOf(leg.type) !== -1) {
          state.columnDefs = orderLegColDefs(
            _.unionBy<IColDef>(
              [
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
                  leg.columnDefs.map(col => {
                    return {
                      ...col,
                      oldEditable: col.editable,
                      suppressMenu: true,
                      editable: false,
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

  public getContextMenuItems = (params): Array<MenuItemDef | string> => {
    return [
      ...(this.state.eventTypes[params.rowData.id] &&
        this.state.eventTypes[params.rowData.id]
          .filter(item => item !== LCM_EVENT_TYPE_MAP.EXPIRATION)
          .map(eventType => {
            return {
              name: LCM_EVENT_TYPE_ZHCN_MAP[eventType],
              action: this.bindEventAction(eventType, params),
            };
          })),
      'separator',
      'copy',
      'paste',
      'export',
    ];
  };

  public bindEventAction = (eventType, params) => () => {
    const legType = params.rowData[LEG_TYPE_FIELD];

    // 每次操作后及时更新，并保证数据一致性
    this.activeRowData = params.rowData;

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
        if (convertObservetions(params.rowData).some(item => !item.price)) {
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
  };

  public removeLegData = (params: GetContextMenuItemsParams) => {
    if (!params.column) return;

    const colId = params.column.getColDef().field;
    this.setState(
      produce((state: any) => {
        const index = state.dataSource.findIndex(item => item[LEG_TYPE_FIELD] === colId);
        state.dataSource.splice(index - 1, 1);
      })
    );
  };

  public copyLegData = (params: GetContextMenuItemsParams) => {
    if (!params.column) return;

    const colId = params.column.getColDef().field;
    const leg = this.getLeyByColId(colId);

    if (!leg) return;

    this.addLegData(leg, {
      ...this.getDataItemByColId(colId),
      id: uuidv4(),
    });
  };

  public getLeyByColId = colId => {
    const legType = this.getLegTypeByColId(colId);
    return allLegTypes.find(item => item.type === legType);
  };

  public getLegTypeByColId = colId => {
    return _.get(this.getDataItemByColId(colId), LEG_TYPE_FIELD);
  };

  public getDataItemByColId = colId => {
    return this.state.dataSource.find(item => item.id === colId);
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
      this.setState({
        visible: true,
      });
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
  public render() {
    return (
      <PageHeaderWrapper back={true}>
        <SourceTable
          loading={this.state.loading}
          tableFormControls={bookingTableFormControls().map<IFormControl>(item => ({
            ...item,
            input: {
              ...item.input,
              type: 'input',
              subtype: 'show',
            },
          }))}
          tableFormData={this.state.tableFormData}
          ref={node => (this.$souceTable = node)}
          rowKey={this.rowKey}
          pagination={false}
          vertical={true}
          autoSizeColumnsToFit={false}
          enableSorting={false}
          getHorizontalrColumnDef={this.getHorizontalrColumnDef}
          getContextMenuItems={this.getContextMenuItems}
          dataSource={this.state.dataSource}
          columnDefs={this.state.columnDefs}
        />
        <ModalButton ref={node => (this.$modelButton = node)} onConfirm={this.onConfirm} />
        <UnwindModal ref={node => (this.$unwindModal = node)} />
        <ExerciseModal
          ref={node => {
            this.$exerciseModal = node;
          }}
        />
        <ExportModal
          visible={this.state.visible}
          trade={this.state.tableFormData}
          convertVisible={this.convertVisible}
          loadData={this.loadData}
        />
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
      </PageHeaderWrapper>
    );
  }
}

export default connect(state => ({
  currentUser: (state.user as any).currentUser,
}))(TradeManagementBookEdit);
