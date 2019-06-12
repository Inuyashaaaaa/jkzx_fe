import { TRNORS_OPTS } from '@/constants/model';
import { Form2, Select, SmartTable } from '@/containers';
import { PureStateComponent } from '@/containers/Components';
import Page from '@/containers/Page';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import ModalButton from '@/containers/_ModalButton2';
import { getCanUsedTranorsOtions } from '@/services/common';
import { queryModelName, queryModelRiskFreeCurve, saveModelRiskFreeCurve } from '@/services/model';
import { Button, Divider, message, Modal, Popconfirm, Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import React from 'react';
import uuidv4 from 'uuid/v4';
import { GROUP_KEY } from './constants';
import Action from './Action';

class PricingSettingsRiskFreeCurve extends PureStateComponent {
  public $modalButton: ModalButton = null;

  public state = {
    tableFormData: {},
    tableDataSource: [],
    tableLoading: false,
    editings: {},
    saveLoading: false,
    options: [],
    searchFormData: {},
    insertFormData: {},
    visible: [],
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

  public onInsertConfirm = data => {
    this.setState({
      tableDataSource: this.sortDataSource(data),
      insertFormData: {},
    });
  };

  public sortDataSource = dataSource => {
    const a = dataSource.map(item => {
      item.id = _.get(item, 'id.value') ? _.get(item, 'id.value') : item.id;
      return item;
    });
    const c = a.map(record => {
      const tenor = record.tenor.value || record.tenor;
      return {
        record,
        days: (TRNORS_OPTS.find(item => item.name === tenor) || {}).days,
      };
    });
    const b = c.sort((a, b) => a.days - b.days).map(item => item.record);
    return b;
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
          visible: false,
        },
      ];
    } else {
      tableDataSource = this.sortDataSource(
        dataSource.map(item => {
          return { ...item, visible: false };
        })
      );
    }
    this.setState({
      tableDataSource: tableDataSource.map(item => Form2.createFields(item, ['id', 'visible'])),
    });
  };

  public saveTableData = async () => {
    const { tableDataSource } = this.state;
    const searchFormData = Form2.getFieldsValue(this.state.searchFormData);
    const { error } = await saveModelRiskFreeCurve({
      dataSource: tableDataSource.map(item => _.omit(Form2.getFieldsValue(item), 'visible')),
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
  };

  public onRemove = rowIndex => {
    const clone = [...this.state.tableDataSource];
    clone.splice(rowIndex, 1);
    this.setState({
      tableDataSource: clone,
    });

    message.success('删除成功');
  };

  public onClick = record => {
    this.setState({
      tableDataSource: this.state.tableDataSource.map(item => {
        if (item.id === record.id) {
          return {
            ...item,
            visible: true,
          };
        }
        return item;
      }),
      insertFormData: {
        quote: Form2.createField(0),
      },
    });
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

  public onInsertCancel = record => {
    this.setState({
      tableDataSource: this.state.tableDataSource.map(item => {
        if (item.id === record.id) {
          return { ...item, visible: false };
        }
        return item;
      }),
    });
  };

  public onInsertFormChange = (props, changedFields) => {
    this.setState({
      insertFormData: {
        ...this.state.insertFormData,
        ...changedFields,
      },
    });
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
    return (
      <Page>
        <Form2
          layout="inline"
          dataSource={this.state.searchFormData}
          submitText="搜索"
          submitButtonProps={{
            icon: 'search',
          }}
          onSubmitButtonClick={this.fetchTableData}
          onValuesChange={this.onSearchFormChange}
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
        <SmartTable
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
              align: 'right',
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
                  <Action
                    value={value}
                    record={record}
                    index={index}
                    onRemove={this.onRemove}
                    tableDataSource={this.state.tableDataSource}
                    onClick={this.onClick}
                    insertFormData={this.state.insertFormData}
                    onInsertFormChange={this.onInsertFormChange}
                    onInsertCancel={this.onInsertCancel}
                    onInsertConfirm={this.onInsertConfirm}
                  />
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
