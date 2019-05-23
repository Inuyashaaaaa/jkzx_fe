import { INPUT_NUMBER_DIGITAL_CONFIG } from '@/constants/common';
import { TRNORS_OPTS } from '@/constants/model';
import MarketSourceTable from '@/containers/MarketSourceTable';
import { IFormControl } from '@/containers/_Form2';
import InputButton from '@/containers/_InputButton';
import ModalButton from '@/containers/_ModalButton2';
import SourceTable from '@/containers/_SourceTable';
import Page from '@/containers/Page';
import {
  getCanUsedTranors,
  getCanUsedTranorsOtions,
  getCanUsedTranorsOtionsNotIncludingSelf,
} from '@/services/common';
import { queryAllModelNameVol, queryModelVolSurface, saveModelVolSurface } from '@/services/model';
// import { queryModelName, queryModelVolSurface, saveModelVolSurface } from '@/services/model';
import { Col, message, notification, Row } from 'antd';
import produce from 'immer';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import uuidv4 from 'uuid/v4';
import {
  GROUP_KEY,
  INSTANCE_KEY,
  MARKET_KEY,
  SEARCH_FORM_CONTROLS,
  TABLE_COLUMN_DEFS,
} from './constants';

class PricingSettingVolSurface extends PureComponent {
  public lastFetchedDataSource = null;

  public $sourceTable: SourceTable = null;

  public underlyer = null;

  public selectedRowNodes = [];

  public selectedColumns = [];

  public state = {
    tableFormData: {},
    searchFormData: {
      [INSTANCE_KEY]: 'INTRADAY',
    },
    tableLoading: false,
    tableDataSource: [],
    tableColumnDefs: [],
    groups: [],
    groupLoading: false,
  };

  constructor(props) {
    super(props);
  }

  public fetchGroup = async underlyer => {
    // const rsp = await queryModelName({
    //   modelType: 'vol_surface',
    //   underlyer,
    // });
    // const { error } = rsp;
    // let { data } = rsp;
    // if (error) return;
    // if (!data || data.length === 0) {
    //   const { error: _error, data: _data } = await queryAllModelNameVol();
    //   if (_error) return;
    //   data = _data.map(item => {
    //     return {
    //       modelName: item,
    //     };
    //   });
    // }
    const { error, data } = await queryAllModelNameVol();
    if (error) return;
    const dataGroup = data.map(item => {
      return {
        modelName: item,
      };
    });
    this.setState(
      produce((state: any) => {
        state.searchFormData[GROUP_KEY] = undefined;
        state.groups = _.unionBy<any>(dataGroup, item => item.modelName).map(item => {
          const { modelName } = item;
          return {
            label: modelName,
            value: modelName,
          };
        });
      })
    );
  };

  public sortDataSource = dataSource => {
    return dataSource
      .map(record => {
        const day = TRNORS_OPTS.find(item => item.name === record.tenor);
        return {
          days: day && day.days,
          record,
        };
      })
      .sort((a, b) => a.days - b.days)
      .map(item => item.record);
  };

  public fetchTableData = async () => {
    const { searchFormData } = this.state;
    this.setState({ tableLoading: true });
    console.log(this.state.searchFormData);
    const rsp = await queryModelVolSurface(
      {
        underlyer: searchFormData[MARKET_KEY],
        modelName: searchFormData[GROUP_KEY],
        instance: searchFormData[INSTANCE_KEY],
      },
      true
    );

    const { error } = rsp;
    let { data } = rsp;
    this.setState({ tableLoading: false });

    // if (error) return;
    if (error) {
      const { message } = error;
      if (message.includes('failed to find model data for ')) {
        data = {
          dataSource: [
            {
              tenor: '1D',
              '80% SPOT': 0,
              '90% SPOT': 0,
              '95% SPOT': 0,
              '100% SPOT': 0,
              '105% SPOT': 0,
              '110% SPOT': 0,
              '120% SPOT': 0,
              id: uuidv4(),
            },
          ],
          underlyer: {
            field: 'LAST',
            instance: 'INTRADAY',
            instrumentId: searchFormData[MARKET_KEY],
            quote: 1,
          },
          columns: TABLE_COLUMN_DEFS,
        };
      } else {
        notification.error({
          message: '请求失败',
          description: message,
        });
        return;
      }
    }

    const { columns, dataSource, underlyer } = data;

    const tableDataSource = this.sortDataSource(dataSource);
    const tableSelfFormData = {
      quote: underlyer.quote,
    };
    this.underlyer = underlyer;

    this.lastFetchedDataSource = tableDataSource;

    this.setState({
      tableColumnDefs: columns.map(col => {
        if (col.input && col.input.type === 'select') {
          return {
            ...col,
            input: record => {
              return {
                ...col.input,
                type: 'select',
                options: getCanUsedTranorsOtions(this.$sourceTable.getTableDataSource(), record),
              };
            },
          };
        }
        return col;
      }),
      tableDataSource,
      tableFormData: tableSelfFormData,
    });
  };

  public onSearchFormChange = event => {
    this.setState(
      {
        searchFormData: event.formData,
      },
      () => {
        console.log(this.state.searchFormData);
        this.fetchTableData();
      }
    );
  };

  public handleSaveTable = async () => {
    const { error } = await saveModelVolSurface({
      columns: this.state.tableColumnDefs,
      dataSource: this.state.tableDataSource,
      underlyer: this.underlyer,
      newQuote: (this.state.tableFormData as any).quote,
      modelName: this.state.searchFormData[GROUP_KEY],
      instance: this.state.searchFormData[INSTANCE_KEY],
    });

    return !error;
  };

  public onSetConstantsButtonClick = event => {
    if (!this.$sourceTable) return;
    if (_.filter(this.selectedColumns, { colId: 'tenor' }).length) {
      this.selectedColumns = _.drop(this.selectedColumns);
    }
    this.setRangeSelectionCellValue(event.inputValue);
  };

  public setRangeSelectionCellValue = value => {
    this.selectedRowNodes.map(rowNode => {
      this.selectedColumns.map(column => {
        (this.$sourceTable.$baseSourceTable.$table.$baseTable.gridApi as any).valueService.setValue(
          rowNode,
          column.getColId(),
          value
        );
      });
    });
  };

  public onTableFormChange = event => {
    this.setState({
      tableFormData: event.formData,
    });
  };

  public onRemove = event => {
    const clone = [...this.state.tableDataSource];
    clone.splice(event.rowIndex, 1);
    this.setState({
      tableDataSource: clone,
    });

    message.success('删除成功');
  };

  public onConfirm = event => {
    const clone = [...this.state.tableDataSource];
    clone.splice(event.extra.rowIndex + 1, 0, {
      ...event.extra.rowData,
      ...event.formData,
      id: Math.random(),
    });
    this.setState({
      tableDataSource: this.sortDataSource(clone),
    });

    message.success('插入成功');
  };

  public onRowEdited = (event: TableRowDataChangedEvent) => {
    if (event.params.context.rowActions[0].key === 'insert') {
      const tenors = getCanUsedTranors(event.oldTableData);
      if (tenors.length === 0) {
        message.info('当前期限选择项目已满');
        return false;
      }
    }
  };

  public onRangeSelectionChanged = value => {
    const { gridApi, props } = this.$sourceTable.$baseSourceTable.$table.$baseTable;

    const rangeSelections = gridApi.getRangeSelections();
    if (!rangeSelections) return;
    const [{ columns, end, start }] = rangeSelections;
    const max = start.rowIndex > end.rowIndex ? start.rowIndex : end.rowIndex;
    const min = start.rowIndex < end.rowIndex ? start.rowIndex : end.rowIndex;
    const rowIds = props.rowData.slice(min, max + 1).map(record => record[props.rowKey]);

    const rowNodes = rowIds.map(id => gridApi.getRowNode(id));

    this.selectedRowNodes = rowNodes;
    this.selectedColumns = columns;
  };

  public onClick = event => {
    const { tableDataSource = [] } = event.state;

    const formControls: IFormControl[] = [
      {
        dataIndex: 'tenor',
        control: {
          label: '期限',
        },
        input: {
          type: 'select',
          options: getCanUsedTranorsOtionsNotIncludingSelf(tableDataSource),
        },
        options: {
          rules: [
            {
              required: true,
            },
          ],
        },
      },
    ];

    return {
      formControls,
      formData: {},
      extra: event,
    };
  };

  public render() {
    return (
      <Page>
        <Row type="flex" justify="space-between" align="top" gutter={16 + 8}>
          <Col xs={24} sm={4}>
            <MarketSourceTable
              marketType={'volInstrumnent'}
              {...{
                onSelect: market => {
                  this.lastFetchedDataSource = null;

                  this.setState(
                    produce((state: any) => {
                      state.searchFormData[MARKET_KEY] = market;
                      state.searchFormData[GROUP_KEY] = undefined;
                      state.tableDataSource = [];
                      state.tableFormData = {};
                    }),
                    () => {
                      if (market) {
                        this.fetchGroup(market);
                      }
                    }
                  );
                },
              }}
            />
          </Col>
          <Col xs={24} sm={20}>
            <SourceTable
              editable={true}
              removeable={true}
              pagination={false}
              rowKey="id"
              resetable={false}
              onRemove={this.onRemove}
              ref={node => (this.$sourceTable = node)}
              loading={this.state.tableLoading}
              searchFormControls={SEARCH_FORM_CONTROLS(
                this.state.groups,
                this.state.searchFormData
              )}
              searchFormProps={{
                controlNumberOneRow: 3,
              }}
              searchFormData={this.state.searchFormData}
              onSearchFormChange={this.onSearchFormChange}
              tableColumnDefs={this.state.tableColumnDefs}
              tableProps={{
                onRangeSelectionChanged: this.onRangeSelectionChanged,
              }}
              onSearch={this.fetchTableData}
              dataSource={this.state.tableDataSource}
              tableFormData={this.state.tableFormData}
              onTableFormChange={this.onTableFormChange}
              onSave={this.handleSaveTable}
              searchButtonProps={{
                disabled: !this.lastFetchedDataSource,
              }}
              extraActions={[
                <InputButton
                  // disabled={!this.lastFetchedDataSource}
                  key="快捷设置常数"
                  type="primary"
                  onClick={this.onSetConstantsButtonClick}
                  input={{
                    type: 'number',
                    formatter: value => `${value}%`,
                    parser: value => value.replace('%', ''),
                  }}
                >
                  快捷设置常数
                </InputButton>,
              ]}
              rowActions={[
                <ModalButton key="insert" onConfirm={this.onConfirm} onClick={this.onClick}>
                  插入
                </ModalButton>,
              ]}
              tableFormProps={{
                labelSpace: 5,
                style: {
                  marginTop: 30,
                },
              }}
              tableFormControls={
                this.lastFetchedDataSource
                  ? [
                      {
                        dataIndex: 'quote',
                        control: {
                          label: '标的物价格',
                          labelSpace: 8,
                        },
                        input: INPUT_NUMBER_DIGITAL_CONFIG,
                      },
                    ]
                  : undefined
              }
            />
          </Col>
        </Row>
      </Page>
    );
  }
}

export default PricingSettingVolSurface;
