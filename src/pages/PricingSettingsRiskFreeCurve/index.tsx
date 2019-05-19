import { INPUT_NUMBER_PERCENTAGE_CONFIG } from '@/constants/common';
import { TRNORS_OPTS } from '@/constants/model';
import { PureStateComponent } from '@/components/Components';
import { IFormControl } from '@/components/_Form2';
import ModalButton from '@/components/_ModalButton2';
import SourceTable from '@/components/_SourceTable';
import Page from '@/containers/Page';
import {
  getCanUsedTranorsOtions,
  getCanUsedTranorsOtionsNotIncludingSelf,
} from '@/services/common';
import { queryModelName, queryModelRiskFreeCurve, saveModelRiskFreeCurve } from '@/services/model';
import { message } from 'antd';
import _ from 'lodash';
import React from 'react';
import { GROUP_KEY } from './constants';

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

  public fetchTableData = async event => {
    const { searchFormData } = event;
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
    // return tableDataSource;
  };

  public saveTableData = async event => {
    const { searchFormData, tableDataSource } = event;
    const { error } = await saveModelRiskFreeCurve({
      dataSource: tableDataSource,
      modelName: searchFormData[GROUP_KEY],
    });

    return !error;
  };

  public onSearchFormChange = values => {
    this.fetchTableData(values);
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
    if (!event.formData.tenor) return;

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

  public render() {
    return (
      <Page>
        <SourceTable
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
        />
      </Page>
    );
  }
}

export default PricingSettingsRiskFreeCurve;
