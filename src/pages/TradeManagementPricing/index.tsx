import { LEG_NAME_FIELD, LEG_TYPE_FIELD } from '@/constants/common';
import { VERTICAL_GUTTER } from '@/constants/global';
import { allTryPricingLegTypes } from '@/constants/legColDefs';
import { AssetClassOptions } from '@/constants/legColDefs/common/common';
import {
  COMPUTED_LEG_FIELDS,
  ComputedColDefs,
} from '@/constants/legColDefs/computedColDefs/ComputedColDefs';
import {
  TRADESCOL_FIELDS,
  TradesColDefs,
  TRADESCOLDEFS_LEG_FIELD_MAP,
} from '@/constants/legColDefs/computedColDefs/TradesColDefs';
import { PRICING_FROM_TAG } from '@/constants/trade';
import MultilLegCreateButton from '@/containers/MultiLegsCreateButton';
import SourceTable from '@/design/components/SourceTable';
import { IColDef } from '@/design/components/Table/types';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { trdBookList } from '@/services/general-service';
import { mktInstrumentWhitelistListPaged } from '@/services/market-data-service';
import { convertTradePositions, createLegDataSourceItem, getAddLegItem } from '@/services/pages';
import { prcTrialPositionsService } from '@/services/pricing';
import { GetContextMenuItemsParams, MenuItemDef } from 'ag-grid-community';
import { Button, message, notification, Row } from 'antd';
import BigNumber from 'bignumber.js';
import { connect } from 'dva';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import router from 'umi/router';
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
    this.props.dispatch({
      type: 'pricingData/addLegData',
      payload: {
        cacheTyeps: this.cacheTyeps,
        leg,
        computedAllLegTypes: this.computedAllLegTypes,
        nextTradesColDefs: this.nextTradesColDefs,
        rowData,
      },
    });
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
    this.props.dispatch({
      type: 'pricingData/removeLegData',
      payload: { id, rowKey: this.rowKey },
    });
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
    return this.props.pricingData.dataSource.find(item => item.id === colField);
  };

  public switchLoading = loading => {
    this.setState({
      createTradeLoading: loading,
    });
  };

  public onSave = async params => {
    const tableDataSource = this.props.pricingData.dataSource;

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

    this.props.dispatch({
      type: 'pricingData/pricingLegData',
      payload: { rsps },
    });
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
      this.props.pricingData.dataSource.map(dataSourceItem => {
        return _.union<string>(
          this.props.pricingData.columnDefs.reduce((arr, item) => {
            return arr.concat(this.getDepends(item.getValue, dataSourceItem, item));
          }, [])
        );
      })
    );

    this.props.pricingData.dataSource.forEach(rowData => {
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

  public convertBooking = () => {
    router.push({
      pathname: '/trade-management/booking',
      query: {
        from: PRICING_FROM_TAG,
      },
    });
  };

  public render() {
    const getAction = (top = true) => (
      <Row
        type="flex"
        justify="space-between"
        style={{ [top ? 'marginBottom' : 'marginTop']: VERTICAL_GUTTER }}
      >
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
        <Button key="转换簿记" type="primary" onClick={this.convertBooking}>
          转换簿记
        </Button>
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
            this.props.pricingData.dataSource && this.props.pricingData.dataSource.length > 0
              ? getAction(false)
              : undefined
          }
          // extraActions={[<Button key="生成交易确认书">生成交易确认书</Button>]}
          rowKey={this.rowKey}
          autoSizeColumnsToFit={false}
          darkIfDoNotEditable={true}
          enableSorting={false}
          getHorizontalrColumnDef={this.getHorizontalrColumnDef}
          getContextMenuItems={this.getContextMenuItems}
          dataSource={this.props.pricingData.dataSource}
          columnDefs={this.props.pricingData.columnDefs}
          pagination={false}
        />
      </PageHeaderWrapper>
    );
  }
}

export default connect(state => ({
  currentUser: (state.user as any).currentUser,
  pricingData: state.pricingData,
}))(TradeManagementPricing);
