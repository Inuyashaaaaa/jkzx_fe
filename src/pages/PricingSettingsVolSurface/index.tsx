/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable react/no-access-state-in-setstate */
import { Col, message, notification, Row, Divider, Modal, Popconfirm } from 'antd';
import produce from 'immer';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import uuidv4 from 'uuid/v4';
import FormItem from 'antd/lib/form/FormItem';
import { INPUT_NUMBER_DIGITAL_CONFIG } from '@/constants/common';
import { TRNORS_OPTS } from '@/constants/model';
import MarketSourceTable from '@/containers/MarketSourceTable';
import { IFormControl } from '@/containers/_Form2';
import InputButton from '@/containers/_InputButton';
import ModalButton from '@/containers/_ModalButton2';
import Page from '@/containers/Page';
import {
  getCanUsedTranors,
  getCanUsedTranorsOtions,
  getCanUsedTranorsOtionsNotIncludingSelf,
} from '@/services/common';
import { queryAllModelNameVol, queryModelVolSurface } from '@/services/model';
import { GROUP_KEY, INSTANCE_KEY, MARKET_KEY, OPERATION, TENOR_KEY } from './constants';
import { SEARCH_FORM, TABLE_COLUMN } from './tools';

import { Form2, Select } from '@/containers';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import ActiveTable from './ActiveTable';

class PricingSettingVolSurface extends PureComponent {
  public lastFetchedDataSource = null;

  public $sourceForm: Form2 = null;

  public $insertForm: Form2 = null;

  public underlyer = null;

  public selectedRowNodes = [];

  public selectedColumns = [];

  constructor(props) {
    super(props);
    this.state = {
      tableFormData: {},
      searchFormData: {
        ...Form2.createFields({ [INSTANCE_KEY]: 'INTRADAY' }),
      },
      tableDataSource: [],
      tableColumnDefs: [],
      groups: [],
      insertVisible: false,
      insertFormData: {},
      record: {},
      rowIndex: 0,
    };
  }

  public fetchGroup = async underlyer => {
    const { error, data } = await queryAllModelNameVol();
    if (error) return;
    const dataGroup = data.map(item => ({
      modelName: item,
    }));
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
      }),
    );
  };

  public sortDataSource = dataSource =>
    dataSource
      .map(record => {
        const day = TRNORS_OPTS.find(item => item.name === record.tenor.value) || {};
        return {
          days: day && day.days,
          record,
        };
      })
      .sort((a, b) => a.days - b.days)
      .map(item => item.record);

  public fetchTableData = async () => {
    const searchFormData = Form2.getFieldsValue(this.state.searchFormData);
    const rsp = await queryModelVolSurface(
      {
        underlyer: searchFormData[MARKET_KEY],
        modelName: searchFormData[GROUP_KEY],
        instance: searchFormData[INSTANCE_KEY],
      },
      true,
    );
    const { error } = rsp;
    let { data } = rsp;

    if (error) {
      if (error.message.includes('failed to find model data for ')) {
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
            // id: uuidv4(),
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
          description: error.message,
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
              dataIndex: TENOR_KEY,
              defaultEditing: false,
              width: 120,
              editable: record => true,
              render: (val, record, index, { form, editing }) => (
                <FormItem>
                  {form.getFieldDecorator({
                    rules: [
                      {
                        required: true,
                        message: '必填',
                      },
                    ],
                  })(
                    <Select
                      style={{ minWidth: 180 }}
                      editing={editing}
                      autoSelect
                      defaultOpen
                      options={getCanUsedTranorsOtions(dataSource, Form2.getFieldsValue(record))}
                    />,
                  )}
                </FormItem>
              ),
            };
          }
          return {
            title: item.headerName,
            dataIndex: item.field,
            defaultEditing: false,
            percent: item.percent,
            strike: item.strike,
            width: 150,
            editable: record => true,
            render: (val, record, index, { form, editing }) => (
              <FormItem>
                {form.getFieldDecorator({
                  rules: [
                    {
                      required: true,
                      message: '必填',
                    },
                  ],
                })(<UnitInputNumber autoSelect editing={editing} unit="%" min={0} />)}
              </FormItem>
            ),
          };
        });
    let tableDataSource = this.sortDataSource(dataSource);
    tableDataSource = tableDataSource.map(item => ({ ...Form2.createFields(item), id: uuidv4() }));
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
      },
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

  public onSetConstantsButtonClick = event => {
    if (!this.$sourceForm) return;
    if (_.filter(this.selectedColumns, { colId: 'tenor' }).length) {
      this.selectedColumns = _.drop(this.selectedColumns);
    }
    this.setRangeSelectionCellValue(event.inputValue);
  };

  public setRangeSelectionCellValue = value => {
    this.selectedRowNodes.map(rowNode => {
      this.selectedColumns.map(column => {
        (this.$sourceForm.$baseSourceTable.$table.$baseTable.gridApi as any).valueService.setValue(
          rowNode,
          column.getColId(),
          value,
        );
      });
    });
  };

  public onRemove = (rowIndex, param) => {
    const clone = [...this.state.tableDataSource];
    clone.splice(rowIndex, 1);
    this.setState({
      tableDataSource: clone,
    });

    message.success('删除成功');
  };

  public onConfirm = async (rowIndex, param) => {
    const validateRsp = await this.$insertForm.validate();
    if (validateRsp.error) return;
    const data = {
      ...param,
      ...this.state.insertFormData,
      id: uuidv4(),
    };
    const clone = _.concat(this.state.tableDataSource, data);
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
    const { gridApi, props } = this.$sourceForm.$baseSourceTable.$table.$baseTable;

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

  public onClick = (record, index) => {
    this.setState({
      insertVisible: true,
      record,
      rowIndex: index,
    });
  };

  public handleCellValueChanged = params => {
    this.setState(pre => ({
      ...pre,
      tableDataSource: pre.tableDataSource.map(item => {
        if (item.id === params.record.id) {
          return params.record;
        }
        return item;
      }),
    }));
  };

  public render() {
    const { tableColumnDefs } = this.state;
    const columns = tableColumnDefs.length
      ? tableColumnDefs.concat({
          title: '操作',
          dataIndex: OPERATION,
          width: 150,
          render: (text, record, index) => (
            <>
              <a onClick={() => this.onClick(record, index)}>插入</a>
              <Divider type="vertical" />
              <Popconfirm title="确定要删除吗？" onConfirm={() => this.onRemove(index, record)}>
                <a style={{ color: 'red' }}>删除</a>
              </Popconfirm>
            </>
          ),
        })
      : [];
    const tableDataSource = this.state.tableDataSource.map(item => ({
      ...item,
      id: _.get(item, 'id.value') ? _.get(item, 'id.value') : item.id,
    }));
    const durationMap = { W: 7, D: 1, M: 30, Y: 365 };
    const tds = _.sortBy(tableDataSource, o => {
      const { value } = o.tenor;
      return durationMap[value.substring(value.length - 1)] * Number.parseInt(value, 10) * 7;
    });

    return (
      <Page>
        <Row type="flex" justify="space-between" align="top" gutter={16 + 8}>
          <Col xs={24} sm={4}>
            <MarketSourceTable
              marketType="volInstrumnent"
              {...{
                onSelect: market => {
                  this.lastFetchedDataSource = null;
                  const { searchFormData } = this.state;
                  this.setState(
                    {
                      tableDataSource: [],
                      tableFormData: {},
                      tableColumnDefs: [],
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
                    },
                  );
                },
              }}
            />
          </Col>
          <Col xs={24} sm={20}>
            <Form2
              ref={node => {
                this.$sourceForm = node;
              }}
              layout="inline"
              dataSource={this.state.searchFormData}
              submitText="搜索"
              submitButtonProps={{
                icon: 'search',
              }}
              onSubmitButtonClick={this.fetchTableData}
              resetable={false}
              onFieldsChange={this.onSearchFormChange}
              columns={SEARCH_FORM(this.state.groups, this.state.searchFormData)}
            />
            <Divider type="horizontal" />
            <ActiveTable
              searchFormData={this.state.searchFormData}
              dataSource={tds}
              columns={columns}
              handleCellValueChanged={this.handleCellValueChanged}
              underlyer={this.underlyer}
              onTableFormChange={this.onTableFormChange}
              tableFormData={this.state.tableFormData}
            />
          </Col>
        </Row>
        <Modal
          visible={this.state.insertVisible}
          onOk={() => this.onConfirm(this.state.rowIndex, this.state.record)}
          onCancel={() => {
            this.setState({ insertVisible: false });
          }}
          closable={false}
          maskClosable={false}
        >
          <Form2
            ref={node => {
              this.$insertForm = node;
            }}
            dataSource={this.state.insertFormData}
            footer={false}
            onFieldsChange={this.onInsertFormChange}
            columns={[
              {
                title: '期限',
                dataIndex: 'tenor',
                render: (val, record, index, { form }) => (
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
                          this.state.tableDataSource.map(item => Form2.getFieldsValue(item)),
                        )}
                      />,
                    )}
                  </FormItem>
                ),
              },
            ]}
          />
        </Modal>
      </Page>
    );
  }
}

export default PricingSettingVolSurface;
