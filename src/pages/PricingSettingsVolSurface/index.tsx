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
import { Col, message, notification, Row, Table, Divider, Button, Modal } from 'antd';
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
  SEARCH_FORM,
  TABLE_COLUMN,
} from './constants';
import FormItem from 'antd/lib/form/FormItem';
import { Form2, Select, InputNumber } from '@/containers';

class PricingSettingVolSurface extends PureComponent {
  public lastFetchedDataSource = null;

  public $sourceTable: SourceTable = null;

  public $insertTable: Form2 = null;

  public underlyer = null;

  public selectedRowNodes = [];

  public selectedColumns = [];

  public state = {
    tableFormData: {},
    searchFormData: {
      ...Form2.createFields({ [INSTANCE_KEY]: 'INTRADAY' }),
    },
    tableLoading: false,
    tableDataSource: [],
    tableColumnDefs: [],
    groups: [],
    groupLoading: false,
    insertVisible: false,
    insertFormData: {},
    quoteData: {},
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
        state.searchFormData[GROUP_KEY].value = undefined;
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
    const searchFormData = Form2.getFieldsValue(this.state.searchFormData);
    this.setState({ tableLoading: true });
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
            dataIndex: 'LAST',
            instance: 'INTRADAY',
            instrumentId: searchFormData[MARKET_KEY],
            quote: 1,
          },
          columns: TABLE_COLUMN,
          failed: true,
        };
      } else {
        notification.error({
          message: '请求失败',
          description: message,
        });
        return;
      }
    }

    const { columns, dataSource, underlyer, failed } = data;
    const tableColumnDefs = failed
      ? columns
      : columns.map(item => {
          item.title = item.headerName;
          item.dataIndex = item.field;
          if (item.input && item.input.type === 'select') {
            item.record = (text, record, index) => {
              return text;
            };
          }
          return item;
        });

    const tableDataSource = this.sortDataSource(dataSource);
    const tableSelfFormData = {
      quote: underlyer.quote,
    };
    this.underlyer = underlyer;

    this.lastFetchedDataSource = tableDataSource;
    this.setState({
      tableColumnDefs,
      tableDataSource,
      tableFormData: tableSelfFormData,
    });
  };

  public onSearchFormChange = (props, changedFields, allFields) => {
    this.setState(
      {
        searchFormData: allFields,
      },
      () => {
        this.fetchTableData();
      }
    );
  };

  public onTableFormChange = (props, changedFields, allFields) => {
    this.setState({
      tableFormData: {
        ...Form2.getFieldsValue(allFields),
      },
    });
  };

  public onInsertFormChange = (props, changedFields, allFields) => {
    this.setState({
      insertFormData: allFields,
    });
  };

  public handleSaveTable = async () => {
    const searchFormData = Form2.getFieldsValue(this.state.searchFormData);
    const { error } = await saveModelVolSurface({
      columns: this.state.tableColumnDefs,
      dataSource: this.state.tableDataSource,
      underlyer: this.underlyer,
      newQuote: (this.state.tableFormData as any).quote,
      modelName: searchFormData[GROUP_KEY],
      instance: searchFormData[INSTANCE_KEY],
    });

    return !error;
  };

  public onSetConstantsButtonClick = event => {
    console.log(event);
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

  public onRemove = (event, rowIndex, param) => {
    const clone = [...this.state.tableDataSource];
    clone.splice(rowIndex, 1);
    this.setState({
      tableDataSource: clone,
    });

    message.success('删除成功');
  };

  public onConfirm = (event, rowIndex, param) => {
    const clone = [...this.state.tableDataSource];
    const { insertFormData } = this.state;
    clone.splice(rowIndex + 1, 0, {
      ...param,
      ...Form2.getFieldsValue(insertFormData),
      id: Math.random(),
    });
    this.setState({
      tableDataSource: this.sortDataSource(clone),
    });

    this.setState({
      insertVisible: false,
      insertFormData: {},
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

  public onClick = (tableDataSource = {}) => {
    console.log(tableDataSource);

    this.setState({
      insertVisible: true,
    });

    const formControls: IFormControl[] = [
      {
        dataIndex: 'tenor',
        control: {
          label: '期限',
        },
        input: {
          type: 'select',
          options: getCanUsedTranorsOtionsNotIncludingSelf([tableDataSource]),
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
    console.log(this.underlyer);
    const columns = this.state.tableColumnDefs.concat({
      title: '操作',
      render: (text, record, index) => {
        return (
          <p>
            <a style={{ color: 'red' }} onClick={e => this.onRemove(e, index, text)}>
              删除
            </a>
            <Divider type="vertical" />
            <a onClick={tetx => this.onClick(text)}>插入</a>
            <Modal
              visible={this.state.insertVisible}
              onOk={e => this.onConfirm(e, index, text)}
              onCancel={() => {
                this.setState({ insertVisible: false });
              }}
            >
              <Form2
                ref={node => (this.$insertTable = node)}
                layout="inline"
                dataSource={this.state.insertFormData}
                submitable={false}
                resetable={false}
                onFieldsChange={this.onInsertFormChange}
                columns={[
                  {
                    title: '期限',
                    dataIndex: 'tenor',
                    render: (value, record, index, { form, editing }) => {
                      return (
                        <FormItem>
                          {form.getFieldDecorator({
                            rules: [
                              {
                                required: true,
                              },
                            ],
                          })(
                            <Select
                              style={{ minWidth: 280 }}
                              placeholder="请选择左侧标的物"
                              options={getCanUsedTranorsOtionsNotIncludingSelf([text])}
                            />
                          )}
                        </FormItem>
                      );
                    },
                  },
                ]}
              />
            </Modal>
          </p>
        );
      },
    });
    return (
      <Page>
        <Row type="flex" justify="space-between" align="top" gutter={16 + 8}>
          <Col xs={24} sm={4}>
            <MarketSourceTable
              marketType={'volInstrumnent'}
              {...{
                onSelect: market => {
                  this.lastFetchedDataSource = null;
                  const { searchFormData } = this.state;
                  this.setState(
                    {
                      tableDataSource: [],
                      tableFormData: {},
                      searchFormData: {
                        ...searchFormData,
                        ...Form2.createFields({
                          [MARKET_KEY]: market,
                          [GROUP_KEY]: undefined,
                        }),
                      },
                    },
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
            <Form2
              ref={node => (this.$sourceTable = node)}
              layout="inline"
              dataSource={this.state.searchFormData}
              submitText={'搜索'}
              submitButtonProps={{
                icon: 'search',
              }}
              onSubmitButtonClick={this.fetchTableData}
              resetable={false}
              onFieldsChange={this.onSearchFormChange}
              columns={SEARCH_FORM(this.state.groups, this.state.searchFormData)}
            />
            <Divider type="horizontal" />
            <div style={{ display: 'flex' }}>
              <Button type="primary" onClick={this.handleSaveTable}>
                保存
              </Button>
              {/* <InputButton
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
                </InputButton> */}
            </div>
            <Divider type="horizontal" />
            {this.underlyer ? (
              <Form2
                // ref={node => (this.$source = node)}
                layout="inline"
                dataSource={Form2.createFields(this.state.tableFormData)}
                submitable={false}
                resetable={false}
                onFieldsChange={this.onTableFormChange}
                columns={[
                  {
                    dataIndex: 'quote',
                    title: '标的物价格',
                    render: (value, record, index, { form, editing }) => {
                      return (
                        <FormItem>
                          {form.getFieldDecorator({
                            rules: [
                              {
                                required: true,
                              },
                            ],
                          })(<InputNumber style={{ width: 200 }} />)}
                        </FormItem>
                      );
                    },
                  },
                ]}
              />
            ) : null}

            <Table
              dataSource={this.state.tableDataSource}
              columns={columns}
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
              }}
              loading={this.state.loading}
              rowKey="id"
              size="middle"
              style={{ marginTop: 20 }}
            />
            {/* <SourceTable
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
            /> */}
          </Col>
        </Row>
      </Page>
    );
  }
}

export default PricingSettingVolSurface;
