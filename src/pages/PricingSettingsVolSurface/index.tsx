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
import { Form2, Select, InputNumber, Table2, Input } from '@/containers';
import { UnitInputNumber } from '@/containers/UnitInputNumber';

class PricingSettingVolSurface extends PureComponent {
  public lastFetchedDataSource = null;

  public $sourceTable: SourceTable = null;

  public $insertForm: Form2 = null;

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
        const day = TRNORS_OPTS.find(item => item.name === record.tenor) || {};
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
        const dataSource = [
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
        ];
        data = {
          dataSource,
          underlyer: {
            field: 'LAST',
            instance: 'INTRADAY',
            instrumentId: searchFormData[MARKET_KEY],
            quote: 1,
          },
          columns: TABLE_COLUMN(dataSource),
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
          if (item.field === 'tenor') {
            return {
              title: '期限',
              dataIndex: 'tenor',
              defaultEditing: false,
              editable: record => {
                return true;
              },
              render: (val, record, index, { form, editing }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({})(
                      <Select
                        style={{ minWidth: 180 }}
                        editing={editing}
                        autoSelect={true}
                        defaultOpen={true}
                        options={getCanUsedTranorsOtionsNotIncludingSelf(
                          dataSource.map(item => Form2.getFieldsValue(item))
                        )}
                      />
                    )}
                  </FormItem>
                );
              },
            };
          }
          return {
            title: item.headerName,
            dataIndex: item.field,
            defaultEditing: false,
            percent: item.percent,
            editable: record => {
              return true;
            },
            render: (val, record, index, { form, editing }) => {
              return (
                <FormItem>
                  {form.getFieldDecorator({})(
                    <UnitInputNumber autoSelect={true} editing={editing} unit={'%'} />
                  )}
                </FormItem>
              );
            },
          };
        });
    let tableDataSource = this.sortDataSource(dataSource);
    tableDataSource = tableDataSource.map(item => {
      return Form2.createFields(item);
    });
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
    const { tableDataSource } = this.state;
    const searchFormData = Form2.getFieldsValue(this.state.searchFormData);
    const { error } = await saveModelVolSurface({
      columns: this.state.tableColumnDefs,
      dataSource: tableDataSource.map(item => Form2.getFieldsValue(item)),
      underlyer: this.underlyer,
      newQuote: (this.state.tableFormData as any).quote,
      modelName: searchFormData[GROUP_KEY],
      instance: searchFormData[INSTANCE_KEY],
    });

    if (error) return;

    message.success('保存成功');
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

  public onRemove = (event, rowIndex, param) => {
    const clone = [...this.state.tableDataSource];
    clone.splice(rowIndex, 1);
    this.setState({
      tableDataSource: clone,
    });

    message.success('删除成功');
  };

  public onConfirm = async (event, rowIndex, param) => {
    const validateRsp = await this.$insertForm.validate();
    if (validateRsp.error) return;

    const clone = [...this.state.tableDataSource];
    const { insertFormData } = this.state;
    clone.splice(rowIndex + 1, 0, {
      ...param,
      ...insertFormData,
      id: Math.random(),
    });
    this.setState({
      insertVisible: false,
      tableDataSource: this.sortDataSource(clone),
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

  public onClick = (e, tableDataSource = {}) => {
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
          options: getCanUsedTranorsOtionsNotIncludingSelf(this.state.tableDataSource),
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

  public handleCellValueChanged = params => {
    this.setState({
      tableDataSource: this.state.tableDataSource.map(item => {
        if (item.id === params.record.id) {
          return params.record;
        }
        return item;
      }),
    });
  };

  public render() {
    const columns = this.state.tableColumnDefs.concat({
      title: '操作',
      render: (text, record, index) => {
        return (
          <p>
            <a style={{ color: 'red' }} onClick={e => this.onRemove(e, index, record)}>
              删除
            </a>
            <Divider type="vertical" />
            <a onClick={e => this.onClick(e, text)}>插入</a>
            <Modal
              visible={this.state.insertVisible}
              onOk={e => this.onConfirm(e, index, record)}
              onCancel={() => {
                this.setState({ insertVisible: false });
              }}
              closable={false}
            >
              <Form2
                ref={node => (this.$insertForm = node)}
                dataSource={this.state.insertFormData}
                footer={false}
                onFieldsChange={this.onInsertFormChange}
                columns={[
                  {
                    title: '期限',
                    dataIndex: 'tenor',
                    render: (val, record, index, { form }) => {
                      return (
                        <FormItem>
                          {form.getFieldDecorator({
                            rules: [
                              {
                                required: true,
                                message: '期限必填',
                              },
                            ],
                          })(
                            <Select
                              style={{ minWidth: 180 }}
                              options={getCanUsedTranorsOtionsNotIncludingSelf(
                                this.state.tableDataSource.map(item => Form2.getFieldsValue(item))
                              )}
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

            <Table2
              dataSource={this.state.tableDataSource}
              columns={columns}
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
              }}
              onCellFieldsChange={this.handleCellValueChanged}
              loading={this.state.tableLoading}
              rowKey="id"
              size="middle"
              style={{ marginTop: 20 }}
            />
          </Col>
        </Row>
      </Page>
    );
  }
}

export default PricingSettingVolSurface;
