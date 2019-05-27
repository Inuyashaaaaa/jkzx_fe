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
import { Form2, Input, Select, Table2 } from '@/containers';
import FormItem from 'antd/lib/form/FormItem';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import uuidv4 from 'uuid/v4';

class PricingSettingsRiskFreeCurve extends PureStateComponent {
  public $modalButton: ModalButton = null;

  public $sourceTable: SourceTable = null;

  public $insertForm: Form2 = null;

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
          days: (TRNORS_OPTS.find(item => item.name === record.tenor) || {}).days,
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
    this.setState({ tableDataSource: tableDataSource.map(item => Form2.createFields(item)) });
  };

  public saveTableData = async () => {
    const { tableDataSource } = this.state;
    const searchFormData = Form2.getFieldsValue(this.state.searchFormData);
    const { error } = await saveModelRiskFreeCurve({
      dataSource: tableDataSource.map(item => Form2.getFieldsValue(item)),
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
    const validateRsp = this.$insertForm.validate();
    if (validateRsp.error) return;

    const { insertFormData } = this.state;

    const data = {
      ...insertFormData,
      id: uuidv4(),
      expiry: Form2.createField(null),
      use: Form2.createField(true),
    };
    const clone = _.concat(this.state.tableDataSource, data);
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
    this.setState({
      insertFormData: allFields,
    });
  };

  public handleCellValueChanged = params => {
    this.setState(
      {
        tableDataSource: this.state.tableDataSource.map(item => {
          if (item.id === params.record.id) {
            return params.record;
          }
          return item;
        }),
      },
      () => {
        console.log(this.state.tableDataSource);
      }
    );
  };

  public render() {
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
        <Table2
          size="middle"
          rowKey="id"
          onCellFieldsChange={this.handleCellValueChanged}
          dataSource={this.state.tableDataSource}
          columns={[
            {
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
                        defaultOpen={true}
                        autoSelect={true}
                        //   style={{ minWidth: 180 }}
                        options={getCanUsedTranorsOtions(
                          this.state.tableDataSource.map(item => Form2.getFieldsValue(item)),
                          Form2.getFieldsValue(record)
                        )}
                        editing={editing}
                      />
                    )}
                  </FormItem>
                );
              },
            },
            {
              title: '利率(%)',
              dataIndex: 'quote',
              editable: record => {
                return true;
              },
              defaultEditing: false,
              render: (val, record, index, { form, editing }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({})(
                      <UnitInputNumber autoSelect={true} editing={editing} unit={'%'} />
                    )}
                  </FormItem>
                );
              },
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
                                        this.state.tableDataSource.map(item =>
                                          Form2.getFieldsValue(item)
                                        )
                                      )}
                                    />
                                  )}
                                </FormItem>
                              );
                            },
                          },
                          {
                            title: '利率(%)',
                            dataIndex: 'quote',
                            render: (val, record, index, { form }) => {
                              return <FormItem>{form.getFieldDecorator({})(<Input />)}</FormItem>;
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
      </Page>
    );
  }
}

export default PricingSettingsRiskFreeCurve;
