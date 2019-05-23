import {
  ASSET_CLASS_ZHCN_MAP,
  INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  INPUT_NUMBER_DIGITAL_CONFIG,
  INPUT_NUMBER_LOT_CONFIG,
  INSTRUMENT_TYPE_ZHCN_MAP,
} from '@/constants/common';
import DownloadExcelButton from '@/containers/DownloadExcelButton';
import RangeNumberInput from '@/containers/RangeNumberInput';
import Form from '@/containers/Form';
import SourceTable from '@/containers/SourceTable';
import { IColDef } from '@/containers/Table/types';
import Page from '@/containers/Page';
import {
  countDelta,
  countDeltaCash,
  countGamaCash,
  countGamma,
  countPnlValue,
  countRhoR,
  countTheta,
  countVega,
} from '@/services/cash';
import { mktInstrumentInfo } from '@/services/market-data-service';
import { prcSpotScenarios } from '@/services/pricing-service';
import { trdBookListBySimilarBookName, trdInstrumentListByBook } from '@/services/trade-service';
import { Card, Empty, Tabs } from 'antd';
import BigNumber from 'bignumber.js';
import _ from 'lodash';
import React, { PureComponent } from 'react';

const { TabPane } = Tabs;

class Component extends PureComponent<
  any,
  {
    instruments: any[];
    searchFormData: any;
    tableColumnDefs: IColDef[];
    loading: boolean;
    underlyersOptions: any[];
  }
> {
  constructor(props) {
    super(props);
    this.state = {
      underlyersOptions: [],
      loading: false,
      searchFormData: this.getInitialSearchFormData(),
      instruments: [],
      tableColumnDefs: [
        {
          headerName: '标的物价格',
          field: 'underlyerPrice',
          input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
        },
        {
          headerName: '价格',
          field: 'price',
          input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
        },
        {
          headerName: 'PNL变动',
          field: 'pnlChange',
          input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
        },
        {
          headerName: 'DELTA',
          field: 'delta',
          input: INPUT_NUMBER_LOT_CONFIG,
        },
        {
          headerName: 'DELTA CASH',
          field: 'deltaCash',
          input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
        },
        {
          headerName: 'GAMMA',
          field: 'gamma',
          input: INPUT_NUMBER_DIGITAL_CONFIG,
        },
        {
          headerName: 'GAMMA CASH',
          field: 'gammaCash',
          input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
        },
        {
          headerName: 'VEGA',
          field: 'vega',
          input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
        },
        {
          headerName: 'THETA',
          field: 'theta',
          input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
        },
        {
          headerName: 'RHO_R',
          field: 'rhoR',
          input: INPUT_NUMBER_DIGITAL_CONFIG,
        },
      ],
    };
  }

  public fetch = async () => {
    this.setState({
      loading: true,
    });
    const { error, data } = await prcSpotScenarios(
      this.convertSearchFormData(this.state.searchFormData)
    );

    if (error) return;

    const instruments = this.convertInstruments(data);

    let nextInstruments: any[] = await this.fetchAssets(instruments);

    nextInstruments = nextInstruments.map(item => {
      const multiplier = item.multiplier;
      return {
        ...item,
        tableDataSource: item.tableDataSource.map((dataItem, key) => {
          return {
            ...dataItem,
            pnlChange: countPnlValue(dataItem.pnlChange),
            delta: countDelta(dataItem.delta, multiplier),
            deltaCash: countDeltaCash(dataItem.delta, dataItem.underlyerPrice),
            gamma: countGamma(dataItem.gamma, multiplier, dataItem.underlyerPrice),
            gammaCash: countGamaCash(dataItem.gamma, dataItem.underlyerPrice),
            theta: countTheta(dataItem.theta),
            vega: countVega(dataItem.vega),
            rhoR: countRhoR(dataItem.rhoR),
          };
        }),
      };
    });

    this.setState({
      loading: false,
    });

    this.setState({ instruments: nextInstruments });
  };

  public fetchAssets = instruments => {
    return Promise.all(
      instruments.map((item, index) => {
        return mktInstrumentInfo({
          instrumentId: item.underlyerInstrumentId,
        }).then(result => {
          const { error, data } = result;
          if (error) return item;
          return {
            ...item,
            assetClass: ASSET_CLASS_ZHCN_MAP[data.assetClass],
            instrumentType: INSTRUMENT_TYPE_ZHCN_MAP[data.instrumentType],
            multiplier: data.instrumentInfo.multiplier,
          };
        });
      })
    );
  };

  public convertSearchFormData = formData => {
    return {
      books: [formData.bookId],
      min: new BigNumber(formData.priceRange[0]).dividedBy(100).toNumber(),
      max: new BigNumber(formData.priceRange[1]).dividedBy(100).toNumber(),
      underlyers: formData.underlyers,
      num: formData.num,
      isPercentage: true,
    };
  };

  public convertInstruments = result => {
    const allUnderlyerInstruments = (result || []).reduce((container, next) => {
      return container.concat({
        ...next,
        ...next.scenarioResult,
      });
    }, []);

    const unionUnderlyerInstruments = _.union(
      allUnderlyerInstruments.map(item => item.underlyerInstrumentId)
    ).map(id => {
      return allUnderlyerInstruments.filter(item => item.underlyerInstrumentId === id);
    });

    return unionUnderlyerInstruments.map(array => {
      const item = array[0];

      const dataSource = array;

      const groups = _.groupBy(dataSource, 'scenarioId');
      const groupObj = _.mapValues(groups, (group, scenarioId) => {
        return group.reduce((dist, next) => {
          Object.keys(next).forEach(key => {
            const value = next[key];
            dist[key] =
              [
                'pnlChange',
                'delta',
                'deltaCash',
                'gamma',
                'gammaCash',
                'q',
                'r',
                'rhoQ',
                'rhoR',
                'theta',
                'vega',
                'vol',
                'price',
              ].indexOf(key) > -1
                ? new BigNumber(value).plus(dist[key] || 0).toNumber()
                : value;
          });
          return dist;
        }, {});
      });

      const tableDataSource = _.values(groupObj).map(item => _.omitBy(item, _.isNull));

      return {
        underlyerInstrumentId: item.underlyerInstrumentId,
        tableDataSource,
      };
    });
  };

  public getInitialSearchFormData = () => {
    return {
      priceRange: [80, 120],
      num: 5,
    };
  };

  public getHorizontalrColumnDef = params => {
    const { rowData } = params;
    return {
      headerName: `${rowData.scenarioId}`,
      width: 200,
    };
  };

  public onSearchFormChange = params => {
    this.setState(
      {
        searchFormData: params.values,
      },
      () => {
        if (params.changedValues.bookId) {
          this.setState({
            searchFormData: _.omit(this.state.searchFormData, ['underlyers']),
          });
          this.fetchUnderlyers();
        }
      }
    );
  };

  public fetchUnderlyers = async () => {
    const { error, data = [] } = await trdInstrumentListByBook({
      bookName: this.state.searchFormData.bookId,
    });
    if (error) return;
    this.setState({
      underlyersOptions: _.union(data).map(item => ({
        label: item,
        value: item,
      })),
    });
  };

  public handleData = (instruments, cols, headers) => {
    const json = instruments.map(item => {
      const data = [];
      data.push(headers);
      const length = data.length;
      item.tableDataSource.forEach((ds, index) => {
        const _data = [];
        Object.keys(ds).forEach(key => {
          const dsIndex = _.findIndex(cols, k => k === key);
          if (dsIndex >= 0) {
            _data[dsIndex] = ds[key];
          }
        });
        data.push(_data);
      });
      return data;
    });
    return json;
  };

  public render() {
    const headers = this.state.tableColumnDefs.map(item => item.headerName);
    headers.unshift('');
    const cols = this.state.tableColumnDefs.map(item => item.field);
    cols.unshift('scenarioId');
    const _data = this.handleData(this.state.instruments, cols, headers);
    return (
      <Page title="标的物情景分析" card={false}>
        <Card>
          <Form
            layout="inline"
            onValueChange={this.onSearchFormChange}
            dataSource={this.state.searchFormData}
            submitText="分析"
            resetable={false}
            onSubmitButtonClick={this.fetch}
            controls={[
              {
                field: 'bookId',
                control: {
                  label: '交易簿',
                },
                input: {
                  type: 'select',
                  showSearch: true,
                  placeholder: '请输入内容搜索',
                  options: async (value: string = '') => {
                    const { data, error } = await trdBookListBySimilarBookName({
                      similarBookName: value,
                    });
                    if (error) return [];
                    return _.union(data).map(item => ({
                      label: item,
                      value: item,
                    }));
                  },
                },
                decorator: {
                  rules: [
                    {
                      required: true,
                    },
                  ],
                },
              },
              {
                field: 'underlyers',
                control: {
                  label: '标的物',
                },
                input: {
                  type: 'select',
                  mode: 'multiple',
                  placeholder: '全部',
                  showSearch: true,
                  options: this.state.underlyersOptions,
                  formatValue: val => val,
                },
              },
              {
                field: 'priceRange',
                control: {
                  label: '价格范围(%)',
                },
                input: {
                  type: RangeNumberInput,
                },
              },
              {
                field: 'num',
                control: {
                  label: '情景个数',
                },
                input: {
                  type: 'number',
                },
              },
            ]}
          />
        </Card>
        <Card style={{ marginTop: 15 }} loading={this.state.loading}>
          <DownloadExcelButton
            style={{ margin: '10px 0' }}
            key="export"
            type="primary"
            data={{
              dataSource: _data,
              cols: headers,
              name: '标的物情景分析',
            }}
            tabs={this.state.instruments.map(item => item.underlyerInstrumentId)}
          >
            导出Excel
          </DownloadExcelButton>
          {this.state.instruments && !!this.state.instruments.length ? (
            <Tabs animated={false}>
              {this.state.instruments.map(item => {
                return (
                  <TabPane tab={item.underlyerInstrumentId} key={item.underlyerInstrumentId}>
                    <SourceTable
                      vertical={true}
                      getHorizontalrColumnDef={this.getHorizontalrColumnDef}
                      tableFormData={_.pick(item, [
                        'underlyerInstrumentId',
                        'assetClass',
                        'instrumentType',
                      ])}
                      tableFormControls={[
                        {
                          control: {
                            label: '标的物名称',
                          },
                          field: 'underlyerInstrumentId',
                          input: {
                            type: 'input',
                            subtype: 'static',
                          },
                        },
                        {
                          control: {
                            label: '资产类别',
                          },
                          field: 'assetClass',
                          input: {
                            type: 'input',
                            subtype: 'static',
                          },
                        },
                        {
                          control: {
                            label: '合约类型',
                          },
                          field: 'instrumentType',
                          input: {
                            type: 'input',
                            subtype: 'static',
                          },
                        },
                      ]}
                      pagination={false}
                      rowKey="scenarioId"
                      dataSource={item.tableDataSource}
                      columnDefs={this.state.tableColumnDefs}
                      autoSizeColumnsToFit={false}
                    />
                  </TabPane>
                );
              })}
            </Tabs>
          ) : (
            <Empty style={{ padding: 100 }} description={<span>暂无分析结果</span>} />
          )}
        </Card>
      </Page>
    );
  }
}

export default Component;
