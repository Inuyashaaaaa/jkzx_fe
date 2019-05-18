import { INPUT_NUMBER_PERCENTAGE_CONFIG } from '@/constants/common';
import { TRNORS_OPTS } from '@/constants/model';
import MarketSourceTable from '@/containers/MarketSourceTable';
import { IFormControl } from '@/components/_Form2';
import ModalButton from '@/components/_ModalButton2';
import SourceTable from '@/components/_SourceTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {
  getCanUsedTranorsOtions,
  getCanUsedTranorsOtionsNotIncludingSelf,
} from '@/services/common';
import {
  queryAllModelName,
  queryModelDividendCurve,
  queryModelName,
  saveModelDividendCurve,
} from '@/services/model';
import { Col, message, notification, Row } from 'antd';
import produce from 'immer';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import uuidv4 from 'uuid/v4';

const GROUP_KEY = 'modelName';

const MARKET_KEY = 'quote';

class PricingSettingsDividendCurve extends PureComponent {
  public $sourceTable: SourceTable = null;

  public state = {
    tableDataSource: [],
    searchFormData: {},
    groups: [],
    tableLoading: false,
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
    this.setState({
      tableLoading: true,
    });

    const rsp = await queryModelDividendCurve(
      {
        modelName: event.searchFormData[GROUP_KEY],
        underlyer: event.searchFormData[MARKET_KEY],
      },
      true
    );

    const { error } = rsp;
    let { data } = rsp;

    // if (error) return;

    this.setState({
      tableLoading: false,
    });

    if (error) {
      const { message } = error;
      if (message.includes('failed to find model data for ')) {
        data = {
          dataSource: [
            {
              expiry: null,
              quote: 0,
              tenor: '1D',
              use: true,
              id: uuidv4(),
            },
          ],
        };
      } else {
        notification.error({
          message: `请求失败`,
          description: message,
        });
        return;
      }
    }

    const { dataSource } = data;

    const tableDataSource = this.sortDataSource(dataSource);

    this.setState({ tableDataSource });
  };

  public saveTableData = async event => {
    const { tableDataSource, searchFormData } = this.state;
    const { error } = await saveModelDividendCurve({
      dataSource: tableDataSource,
      modelName: searchFormData[GROUP_KEY],
      underlyer: searchFormData[MARKET_KEY],
    });
    return !error;
  };

  public fetchGroup = async underlyer => {
    // const rsp = await queryModelName({
    //   modelType: 'dividend_curve',
    //   underlyer,
    // });

    // const { error } = rsp;
    // let { data } = rsp;

    // if (error) return;

    // if (!data || data.length === 0) {
    //   const alls = await queryAllModelName();
    //   if (alls.error) return;
    //   data = alls.data.map(item => {
    //     return {
    //       modelName: item,
    //     };
    //   });
    // }

    const { error, data } = await queryAllModelName();
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

  public onSearchFormChange = event => {
    this.setState({
      searchFormData: event.formData,
    });
    this.fetchTableData(event);
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
      <PageHeaderWrapper>
        <Row gutter={16 + 8}>
          <Col xs={24} sm={4}>
            <MarketSourceTable
              marketType={'dividendInstruments'}
              {...{
                onSelect: market => {
                  this.setState(
                    produce((state: any) => {
                      state.searchFormData[MARKET_KEY] = market;
                      state.tableDataSource = [];
                      state.searchFormData[GROUP_KEY] = undefined;
                    }),
                    () => market && this.fetchGroup(market)
                  );
                },
              }}
            />
          </Col>
          <Col xs={24} sm={20}>
            <SourceTable
              rowKey="id"
              pagination={false}
              loading={this.state.tableLoading}
              ref={node => (this.$sourceTable = node)}
              resetable={false}
              removeable={true}
              onRemove={this.onRemove}
              searchFormData={this.state.searchFormData}
              dataSource={this.state.tableDataSource}
              onSearchFormChange={this.onSearchFormChange}
              onSave={this.saveTableData}
              onSearch={this.fetchTableData}
              searchFormProps={{
                wrapperSpace: 14,
                labelSpace: 4,
                controlNumberOneRow: 2,
              }}
              rowActions={[
                <ModalButton key="insert" onConfirm={this.onConfirm} onClick={this.onClick}>
                  插入
                </ModalButton>,
              ]}
              searchFormControls={[
                {
                  control: {
                    label: '标的',
                    required: true,
                  },
                  dataIndex: MARKET_KEY,
                  input: {
                    disabled: true,
                    placeholder: '请选择左侧标的物',
                    type: 'input',
                    subtype: 'show',
                    hoverIcon: 'lock',
                  },
                  options: {
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  },
                },
                {
                  dataIndex: GROUP_KEY,
                  control: {
                    label: '分组',
                  },
                  input: {
                    type: 'select',
                    options: this.state.groups,
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
            />
          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}

export default PricingSettingsDividendCurve;
