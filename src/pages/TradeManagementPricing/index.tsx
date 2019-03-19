import {
  BIG_NUMBER_CONFIG,
  LEG_ANNUALIZED_FIELD,
  LEG_FIELD,
  LEG_NAME_FIELD,
  LEG_TYPE_FIELD,
  NOTIONAL_AMOUNT_TYPE_MAP,
} from '@/constants/common';
import { VERTICAL_GUTTER } from '@/constants/global';
import { allTryPricingLegTypes } from '@/constants/legColDefs';
import { AssetClassOptions } from '@/constants/legColDefs/common/common';
import { orderLegColDefs } from '@/constants/legColDefs/common/order';
import {
  COMPUTED_LEG_FIELD_MAP,
  COMPUTED_LEG_FIELDS,
  ComputedColDefs,
} from '@/constants/legColDefs/computedColDefs/ComputedColDefs';
import {
  TRADESCOL_FIELDS,
  TradesColDefs,
  TRADESCOLDEFS_LEG_FIELD_MAP,
} from '@/constants/legColDefs/computedColDefs/TradesColDefs';
import MultilLegCreateButton from '@/containers/MultiLegsCreateButton';
import SourceTable from '@/design/components/SourceTable';
import { IColDef } from '@/design/components/Table/types';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { countDeltaCash, countGamaCash, countRhoR } from '@/services/cash';
import { trdBookList } from '@/services/general-service';
import { mktInstrumentWhitelistListPaged } from '@/services/market-data-service';
import { convertTradePositions, createLegDataSourceItem, getAddLegItem } from '@/services/pages';
import { prcTrialPositionsService } from '@/services/pricing';
import { GetContextMenuItemsParams, MenuItemDef } from 'ag-grid-community';
import { Button, message, notification, Row } from 'antd';
import BigNumber from 'bignumber.js';
import { connect } from 'dva';
import produce from 'immer';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import uuidv4 from 'uuid/v4';

class TradeManagementPricing extends PureComponent<any> {
  public $sourceTable: SourceTable = null;

  public cacheTyeps = [];

  public rowKey = 'id';

  public nextTradesColDefs: IColDef[];

  public computedAllLegTypes: IColDef[];

  public state = {
    columnDefs: [],
    dataSource: [],
    bookList: [],
    mktInstrumentIds: [],
    createTradeLoading: false,
  };

  constructor(props) {
    super(props);
    this.nextTradesColDefs = TradesColDefs.map(item => ({
      ...item,
      totalable: false,
    }));

    this.computedAllLegTypes = allTryPricingLegTypes.map(item => {
      return {
        ...item,
        columnDefs: item.columnDefs
          .map(item => ({
            ...item,
            totalable: false,
          }))
          .concat(this.nextTradesColDefs)
          .concat(ComputedColDefs),
      };
    });
  }

  public componentDidMount = () => {
    trdBookList().then(rsp => {
      if (rsp.error) return;
      this.setState({
        bookList: rsp.data,
      });
    });

    this.loadInstrumentIds();
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

    const legType = this.computedAllLegTypes.find(item => item.type === data[LEG_TYPE_FIELD]);

    if (!legType) return false;

    return !!legType.columnDefs.find(item => item.field === colDef.field);
  };

  public handleAddLeg = event => {
    const leg = this.computedAllLegTypes.find(item => item.type === event.key);

    if (!leg) return;

    if (this.cacheTyeps.indexOf(leg.type) === -1) {
      this.cacheTyeps.push(leg.type);
    }

    const legData = getAddLegItem(leg, createLegDataSourceItem(leg), true);

    this.addLegData(leg, {
      ...legData,
      [TRADESCOLDEFS_LEG_FIELD_MAP.VOL]: 20,
      [TRADESCOLDEFS_LEG_FIELD_MAP.Q]: 0,
      [TRADESCOLDEFS_LEG_FIELD_MAP.R]: 5,
    });
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
                      return this.handleJudge(params);
                    },
                  };
                })
              ),
              item => item.field
            )
          );
        }
        state.columnDefs = _.unionBy<IColDef>(state.columnDefs, item => item.field);
        _.remove(state.columnDefs, (item: any) =>
          [...this.nextTradesColDefs, ...ComputedColDefs].find(iitem => iitem.field === item.field)
        );
        state.columnDefs = state.columnDefs.concat(this.nextTradesColDefs).concat(ComputedColDefs);
        state.dataSource.push(rowData);
      })
    );
  };

  public getHorizontalrColumnDef = ({ rowData }) => {
    return {
      headerName: rowData[LEG_NAME_FIELD],
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
      'export',
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
    return this.computedAllLegTypes.find(item => item.type === legType);
  };

  public getLegTypeByColField = colField => {
    return _.get(this.getDataItemByColField(colField), LEG_TYPE_FIELD);
  };

  public getDataItemByColField = colField => {
    return this.state.dataSource.find(item => item.id === colField);
  };

  public switchLoading = loading => {
    this.setState({
      createTradeLoading: loading,
    });
  };

  public getActualNotionAmountBigNumber = legData => {
    const isAnnualized = legData[LEG_ANNUALIZED_FIELD];

    if (isAnnualized) {
      if (legData[LEG_FIELD.NOTIONAL_AMOUNT_TYPE] === NOTIONAL_AMOUNT_TYPE_MAP.CNY) {
        return new BigNumber(legData[LEG_FIELD.NOTIONAL_AMOUNT])
          .multipliedBy(legData[LEG_FIELD.TERM])
          .dividedBy(365);
      }
      if (legData[LEG_FIELD.NOTIONAL_AMOUNT_TYPE] === NOTIONAL_AMOUNT_TYPE_MAP.LOT) {
        return new BigNumber(legData[LEG_FIELD.NOTIONAL_AMOUNT])
          .multipliedBy(legData[LEG_FIELD.UNDERLYER_MULTIPLIER])
          .multipliedBy(legData[TRADESCOLDEFS_LEG_FIELD_MAP.UNDERLYER_PRICE])
          .multipliedBy(legData[LEG_FIELD.TERM])
          .dividedBy(365);
      }
    }

    if (!isAnnualized) {
      if (legData[LEG_FIELD.NOTIONAL_AMOUNT_TYPE] === NOTIONAL_AMOUNT_TYPE_MAP.CNY) {
        return new BigNumber(legData[LEG_FIELD.NOTIONAL_AMOUNT]);
      }
      if (legData[LEG_FIELD.NOTIONAL_AMOUNT_TYPE] === NOTIONAL_AMOUNT_TYPE_MAP.LOT) {
        return new BigNumber(legData[LEG_FIELD.NOTIONAL_AMOUNT])
          .multipliedBy(legData[LEG_FIELD.UNDERLYER_MULTIPLIER])
          .multipliedBy(legData[TRADESCOLDEFS_LEG_FIELD_MAP.UNDERLYER_PRICE]);
      }
    }

    throw new Error('getActualNotionAmountBigNumber not match!');
  };

  public onSave = async params => {
    const { dataSource: tableDataSource } = this.state;

    if (_.isEmpty(tableDataSource)) {
      message.warn('请添加期权结构');
      return;
    }

    // const validateTableFormRsp: any = await this.$sourceTable.validateTableForm();

    // if (validateTableFormRsp.error) return;

    const validateTableRsp: any = await this.$sourceTable.validateTable();

    if (validateTableRsp.error) return;

    this.switchLoading(true);

    const positions = convertTradePositions(
      tableDataSource.map(item => _.omit(item, [...TRADESCOL_FIELDS, ...COMPUTED_LEG_FIELDS])),
      {},
      true
    );

    const tableDataSourceItem = tableDataSource[0];

    if (!tableDataSourceItem) {
      this.switchLoading(false);
      throw new Error('tableDataSourceItem is undefined');
    }

    const rsps = await Promise.all(
      positions.map((item, index) => {
        return prcTrialPositionsService({
          // 需要计算的值，可选price, delta, gamma, vega, theta, rhoR和rhoQ。若为空数组或null，则计算所有值
          // requests,
          // pricingEnvironmentId,
          // valuationDateTime,
          // timezone,
          positions: [item],
          ..._.mapValues(_.pick(tableDataSource[index], TRADESCOL_FIELDS), (val, key) => {
            if (key === TRADESCOLDEFS_LEG_FIELD_MAP.UNDERLYER_PRICE) {
              return val;
            }
            return val ? new BigNumber(val).multipliedBy(0.01).toNumber() : val;
          }),
        });
      })
    );

    this.switchLoading(false);

    if (
      rsps.some(rsp => {
        const { raw } = rsp;
        if (raw && raw.diagnostics && raw.diagnostics.length) {
          return true;
        }
        return false;
      })
    ) {
      return notification.error({
        message: rsps.map(item => _.get(item.raw.diagnostics, '[0].message', [])).join(','),
      });
    }

    if (rsps.some(rsp => rsp.error) || rsps.some(rsp => _.isEmpty(rsp.data))) return;

    this.setState(
      produce((state: any) => {
        state.dataSource = rsps
          .reduce((pre, next) => {
            return pre.concat(next.data);
          }, [])
          .map((item, index) => {
            const cur = state.dataSource[index];

            return {
              ...cur,
              ..._.mapValues(_.pick(item, TRADESCOL_FIELDS), (val, key) => {
                val = new BigNumber(val).decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES).toNumber();
                if (key === TRADESCOLDEFS_LEG_FIELD_MAP.UNDERLYER_PRICE) {
                  return val;
                }
                return val ? new BigNumber(val).multipliedBy(100).toNumber() : val;
              }),
              [COMPUTED_LEG_FIELD_MAP.PRICE]: new BigNumber(item.price)
                .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
                .toNumber(),
              [COMPUTED_LEG_FIELD_MAP.PRICE_PER]: new BigNumber(item.price)
                .dividedBy(this.getActualNotionAmountBigNumber(cur))
                .multipliedBy(100)
                .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
                .toNumber(),
              [COMPUTED_LEG_FIELD_MAP.STD_DELTA]: new BigNumber(item.delta)
                .dividedBy(new BigNumber(item.quantity).abs())
                .multipliedBy(100)
                .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
                .toNumber(),
              [COMPUTED_LEG_FIELD_MAP.DELTA]: new BigNumber(item.delta)
                .dividedBy(cur[LEG_FIELD.UNDERLYER_MULTIPLIER])
                .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
                .toNumber(),
              [COMPUTED_LEG_FIELD_MAP.DELTA_CASH]: countDeltaCash(item.delta, item.underlyerPrice),
              [COMPUTED_LEG_FIELD_MAP.GAMMA]: new BigNumber(item.gamma)
                .dividedBy(cur[LEG_FIELD.UNDERLYER_MULTIPLIER])
                .multipliedBy(item.underlyerPrice)
                .dividedBy(100)
                .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
                .toNumber(),
              [COMPUTED_LEG_FIELD_MAP.GAMMA_CASH]: countGamaCash(item.gamma, item.underlyerPrice),
              [COMPUTED_LEG_FIELD_MAP.VEGA]: new BigNumber(item.vega)
                .dividedBy(100)
                .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
                .toNumber(),
              [COMPUTED_LEG_FIELD_MAP.THETA]: new BigNumber(item.theta)
                .dividedBy(365)
                .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
                .toNumber(),
              [COMPUTED_LEG_FIELD_MAP.RHO_R]: countRhoR(item.rhoR),
              // [COMPUTED_LEG_FIELD_MAP.RHO]: new BigNumber(item.rho)
              // .multipliedBy(100)
              // .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
              // .toNumber(),
            };
          });
      })
    );
  };

  public getDepends = (getValue, data, colDef) => {
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
        this.$sourceTable.$baseSourceTable.$table.$baseTable.setCellValue(rowId, colField, value);
      });
    });
  };

  public normalLegMenus = () => {
    const allAsset = _.union(
      this.computedAllLegTypes.map(item =>
        AssetClassOptions.find(it => it.value === item.assetClass)
      )
    );
    return allAsset.map(val => ({
      name: val.label,
      children: this.computedAllLegTypes.filter(item => item.assetClass === val.value),
    }));
  };

  public getRef = node => {
    this.$sourceTable = node;
  };

  public onCellValueChanged = params => {
    const { colDef } = params;
    if (
      TradesColDefs.find(item => item.field === colDef.field) ||
      colDef.field === LEG_FIELD.UNDERLYER_INSTRUMENT_ID ||
      colDef.field === LEG_FIELD.UNDERLYER_MULTIPLIER ||
      colDef.field === LEG_FIELD.INITIAL_SPOT
    ) {
      this.setState(
        produce((state: any) => {
          state.dataSource.forEach(item => {
            item[colDef.field] = params.value;
          });
        })
      );
    }
  };

  public render() {
    const getAction = (top = true) => (
      <Row style={{ [top ? 'marginBottom' : 'marginTop']: VERTICAL_GUTTER }}>
        <Button.Group>
          <MultilLegCreateButton isPricing={true} key="create" handleAddLeg={this.handleAddLeg} />
          <Button
            loading={this.state.createTradeLoading}
            key="试定价"
            type="primary"
            onClick={this.onSave}
          >
            试定价
          </Button>
        </Button.Group>
      </Row>
    );
    return (
      <PageHeaderWrapper>
        <SourceTable
          vertical={true}
          totalable={true}
          ref={this.getRef}
          header={getAction()}
          footer={
            this.state.dataSource && this.state.dataSource.length > 0 ? getAction(false) : undefined
          }
          // extraActions={[<Button key="生成交易确认书">生成交易确认书</Button>]}
          rowKey={this.rowKey}
          autoSizeColumnsToFit={false}
          darkIfDoNotEditable={true}
          enableSorting={false}
          getHorizontalrColumnDef={this.getHorizontalrColumnDef}
          getContextMenuItems={this.getContextMenuItems}
          dataSource={this.state.dataSource}
          columnDefs={this.state.columnDefs}
          pagination={false}
        />
      </PageHeaderWrapper>
    );
  }
}

export default connect(state => ({
  currentUser: (state.user as any).currentUser,
}))(TradeManagementPricing);
