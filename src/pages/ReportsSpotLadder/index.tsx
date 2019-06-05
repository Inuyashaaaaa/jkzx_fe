import { ITableColDef } from '@/components/type';
// import SourceTable from '@/containers/SourceTable';
import { ASSET_CLASS_ZHCN_MAP, INSTRUMENT_TYPE_ZHCN_MAP } from '@/constants/common';
import { VERTICAL_GUTTER } from '@/constants/global';
import { Form2, SmartTable } from '@/containers';
import SpotLadderExcelButton from '@/containers/DownloadExcelButton/SpotLadderExcelButton';
import Form from '@/containers/Form';
import Page from '@/containers/Page';
import RangeNumberInput from '@/containers/RangeNumberInput';
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
import { Card, Divider, Empty, Tabs } from 'antd';
import BigNumber from 'bignumber.js';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import { TABLE_COL_DEFS, TABLE_FORM_CONTROLS } from './constants';

const { TabPane } = Tabs;

class Component extends PureComponent<
  any,
  {
    instruments: any[];
    searchFormData: any;
    tableColumnDefs: ITableColDef[];
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
      tableColumnDefs: TABLE_COL_DEFS,
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
    const headers = this.state.tableColumnDefs.map(item => item.title);
    // headers.unshift('');
    const cols = this.state.tableColumnDefs.map(item => item.dataIndex);
    // cols.unshift('scenarioId');
    const _data = this.handleData(this.state.instruments, cols, headers);
    return (
      <Page title="标的物情景分析">
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
        <Divider />
        <Card loading={this.state.loading} bordered={false}>
          {this.state.instruments && !!this.state.instruments.length ? (
            <>
              <SpotLadderExcelButton
                style={{ marginBottom: VERTICAL_GUTTER }}
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
              </SpotLadderExcelButton>
              <Tabs animated={false}>
                {this.state.instruments.map(item => {
                  return (
                    <TabPane tab={item.underlyerInstrumentId} key={item.underlyerInstrumentId}>
                      <Form2
                        columns={TABLE_FORM_CONTROLS}
                        style={{ marginBottom: VERTICAL_GUTTER }}
                        dataSource={Form2.createFields(
                          _.pick(item, ['underlyerInstrumentId', 'assetClass', 'instrumentType'])
                        )}
                        footer={false}
                        layout="inline"
                      />
                      <SmartTable
                        vertical={true}
                        pagination={false}
                        rowKey="scenarioId"
                        bordered={true}
                        dataSource={item.tableDataSource}
                        columns={TABLE_COL_DEFS}
                      />
                    </TabPane>
                  );
                })}
              </Tabs>
            </>
          ) : (
            <Empty style={{ padding: 100 }} description={<span>暂无分析结果</span>} />
          )}
        </Card>
      </Page>
    );
  }
}

export default Component;
