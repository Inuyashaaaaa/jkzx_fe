import { INPUT_NUMBER_PERCENTAGE_CONFIG } from '@/constants/common';
import { TRNORS_OPTS } from '@/constants/model';
import { PureStateComponent } from '@/containers/Components';
import { IFormControl } from '@/containers/_Form2';
import ModalButton from '@/containers/_ModalButton2';
import SourceTable from '@/containers/_SourceTable';
import Page from '@/containers/Page';
import {
  getCanUsedTranorsOtions,
  getCanUsedTranorsOtionsNotIncludingSelf,
} from '@/services/common';
import { queryModelName, queryModelRiskFreeCurve, saveModelRiskFreeCurve } from '@/services/model';
import { message, Divider, Table, Modal, Row, Button } from 'antd';
import _ from 'lodash';
import React from 'react';
import { GROUP_KEY } from './constants';
import { Form2, Input, Select } from '@/containers';
import FormItem from 'antd/lib/form/FormItem';

class PricingSettingsRiskFreeCurve extends PureStateComponent {
  public $modalButton: ModalButton = null;

  public $sourceTable: SourceTable = null;

  public state = {
    tableFormData: {},
    tableDataSource: [],
    tableLoading: false,
    editings: {},
    saveLoading: false,
    options: [],
    insertVisible: false,
    searchFormData: {},
    insertFormData: {},
  };

  public lastFetchedDataSource = null;

  public confirmPromise: Promise<any> = null;

  public resolve: any;

  public reject: any;

  public componentDidMount = () => {
    this.loadGroups();
  };

  public loadGroups = async () => {
    const { error, data } = await queryModelName({
      modelType: 'risk_free_curve',
    });

    if (error) return this.setState({ options: [] });

    return this.setState({
      options: _.unionBy<any>(
        data.map(item => {
          const { modelName } = item;
          return {
            label: modelName,
            value: modelName,
          };
        }),
        item => item.value
      ),
    });
  };

  public sortDataSource = dataSource => {
    return dataSource
      .map(record => {
        return {
          days: TRNORS_OPTS.find(item => item.name === record.tenor).days,
          record,
        };
      })
      .sort((a, b) => a.days - b.days)
      .map(item => item.record);
  };

  public fetchTableData = async () => {
    const searchFormData = Form2.getFieldsValue(this.state.searchFormData);
    const { error, data } = await queryModelRiskFreeCurve({
      modelName: searchFormData[GROUP_KEY],
    });
    if (error) return;
    const { dataSource } = data;
    let tableDataSource;
    if (!dataSource.length) {
      tableDataSource = [
        {
          tenor: '1D',
          quote: 0,
          use: true,
          expiry: null,
          id: uuidv4(),
        },
      ];
    } else {
      tableDataSource = this.sortDataSource(dataSource);
    }
    this.setState({ tableDataSource });
  };

  public saveTableData = async () => {
    const { tableDataSource } = this.state;
    const searchFormData = Form2.getFieldsValue(this.state.searchFormData);
    const { error } = await saveModelRiskFreeCurve({
      dataSource: tableDataSource,
      modelName: searchFormData[GROUP_KEY],
    });

    if (error) return;

    message.success('保存成功');
  };

  public onSearchFormChange = (props, changedFields, allFields) => {
    const { searchFormData } = this.state;
    this.setState(
      {
        searchFormData: {
          ...searchFormData,
          ...changedFields,
        },
      },
      () => {
        this.fetchTableData();
      }
    );
    // this.fetchTableData({
    //   ...this.state.searchFormData,
    //   ...Form2.getFieldsValue(allFields)
    // });
  };

  public onRemove = (e, rowIndex) => {
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
    if (!Form2.getFieldsValue(insertFormData).tenor) return;
    clone.splice(rowIndex + 1, 0, {
      ...param,
      ...Form2.getFieldsValue(insertFormData),
      id: Math.random(),
    });

    this.setState({
      insertVisible: false,
      tableDataSource: this.sortDataSource(clone),
      insertFormData: {},
    });

    message.success('插入成功');
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

  public createPromise = () => {
    this.confirmPromise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
    return this.confirmPromise;
  };

  public onCancel = () => {
    return {
      formData: {},
    };
  };

  public onInsertFormChange = (props, changedFields, allFields) => {
    console.log(allFields);
    this.setState({
      insertFormData: allFields,
    });
  };

  public render() {
    console.log(this.state.insertFormData);
    return (
      <Page>
        <Form2
          ref={node => (this.$sourceTable = node)}
          layout="inline"
          dataSource={this.state.searchFormData}
          submitText="搜索"
          submitButtonProps={{
            icon: 'search',
          }}
          onSubmitButtonClick={this.fetchTableData}
          onFieldsChange={this.onSearchFormChange}
          resetable={false}
          columns={[
            {
              title: '分组',
              dataIndex: GROUP_KEY,
              render: (value, record, index, { form, editing }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      rules: [{ required: true }],
                    })(
                      <Select
                        {...{
                          editing,
                          style: {
                            width: 280,
                          },
                          placeholder: '请输入内容搜索',
                          showSearch: true,
                          allowClear: true,
                          fetchOptionsOnSearch: true,
                          options: this.state.options,
                        }}
                      />
                    )}
                  </FormItem>
                );
              },
            },
          ]}
        />
        <Divider type="horizontal" />
        <Row>
          {this.state.tableDataSource.length > 0 ? (
            <Button type="primary" style={{ marginBottom: 10 }} onClick={this.saveTableData}>
              保存
            </Button>
          ) : null}
        </Row>
        <Table
          size="middle"
          rowKey="id"
          dataSource={this.state.tableDataSource}
          columns={[
            {
              title: '期限',
              dataIndex: 'tenor',
              // input: record => {
              //   return {
              //     type: 'select',
              //     // columnDefs 的函数字段不会被 diff 判断，如果加上一个 key 会影响动效，所以命令获取
              //     options: getCanUsedTranorsOtions(
              //       this.$sourceTable.getTableDataSource(),
              //       record
              //     ),
              //   };
              // },
            },
            {
              title: '利率(%)',
              dataIndex: 'quote',
              // input: INPUT_NUMBER_PERCENTAGE_CONFIG,
            },
            {
              title: '操作',
              render: (value, record, index) => {
                return (
                  <>
                    <a
                      style={{ color: 'red' }}
                      onClick={e => {
                        this.onRemove(e, index);
                      }}
                    >
                      删除
                    </a>
                    <Divider type="vertical" />
                    <a onClick={e => this.onClick(e, value)}>插入</a>
                    <Modal
                      visible={this.state.insertVisible}
                      onOk={e => this.onConfirm(e, index, value)}
                      onCancel={() => {
                        this.setState({ insertVisible: false });
                      }}
                    >
                      <Form2
                        layout="inline"
                        dataSource={this.state.insertFormData}
                        submitable={false}
                        resetable={false}
                        onFieldsChange={this.onInsertFormChange}
                        columns={[
                          {
                            title: '期限',
                            dataIndex: 'tenor',
                            render: (val, record, index, { form, editing }) => {
                              console.log(value);
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
                                      options={getCanUsedTranorsOtionsNotIncludingSelf(
                                        this.state.tableDataSource
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
                  </>
                );
              },
            },
          ]}
          pagination={false}
        />
        {/* <SourceTable
          ref={node => (this.$sourceTable = node)}
          rowKey="id"
          removeable={true}
          pagination={false}
          onRemove={this.onRemove}
          fetchAfterSearchFormChanged={true}
          autoFetch={false}
          resetable={false}
          onSearch={this.fetchTableData}
          dataSource={this.state.tableDataSource}
          onSave={this.saveTableData}
          searchFormProps={{
            wrapperSpace: 18,
            labelSpace: 4,
            controlNumberOneRow: 3,
          }}
          searchFormControls={[
            {
              dataIndex: GROUP_KEY,
              control: {
                label: '分组',
              },
              options: {
                rules: [
                  {
                    required: true,
                  },
                ],
              },
              input: {
                type: 'select',
                options: this.state.options,
              },
            },
          ]}
          tableColumnDefs={event => {
            return event.tableDataSource.length
              ? [
                {
                  headerName: '期限',
                  field: 'tenor',
                  editable: true,
                  input: record => {
                    return {
                      type: 'select',
                      // columnDefs 的函数字段不会被 diff 判断，如果加上一个 key 会影响动效，所以命令获取
                      options: getCanUsedTranorsOtions(
                        this.$sourceTable.getTableDataSource(),
                        record
                      ),
                    };
                  },
                },
                {
                  headerName: '利率(%)',
                  editable: true,
                  field: 'quote',
                  input: INPUT_NUMBER_PERCENTAGE_CONFIG,
                },
              ]
              : [];
          }}
          rowActions={[
            <ModalButton
              key="insert"
              ref={node => (this.$modalButton = node)}
              onConfirm={this.onConfirm}
              onClick={this.onClick}
              onCancel={this.onCancel}
            >
              插入
            </ModalButton>,
          ]}
        /> */}
      </Page>
    );
  }
}

export default PricingSettingsRiskFreeCurve;
