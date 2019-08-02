import DataSet from '@antv/data-set';
import { Col, Row } from 'antd';
import { scaleLinear } from 'd3-scale';
import { connect } from 'dva';
import ReactEcharts from 'echarts-for-react';
import 'echarts-gl';
import _ from 'lodash';
import moment from 'moment';
import React, { memo, useEffect, useRef, useState } from 'react';
import { getInstrumentRealizedVol, getInstrumentVolCone } from '@/services/terminal';
import { mktInstrumentWhitelistSearch } from '@/services/market-data-service';
import ThemeTable from '@/containers/ThemeTable';
import { Loading } from '@/containers';
import PosCenter from '@/containers/PosCenter';
import ThemeButton from '@/containers/ThemeButton';
import ThemeDatePicker from '@/containers/ThemeDatePicker';
import ThemeRadio from '@/containers/ThemeRadio';
import ThemeSelect from '@/containers/ThemeSelect';
import { delay } from '@/utils';

const debug = true;

const LATEST_PER = 'latest';

const colorMap = {
  0: 'l(100) 0:#0FB299 0.2:#52D0CC 1:#52D0CC',
  10: 'l(100) 0:#0F14CA 0.2:#494DE8 1:#494DE8',
  25: 'l(100) 0:#7715C3 0.2:#AD5AEE 1:#AD5AEE',
  50: 'l(100) 0:#9D60E2 0.2:#BE8AF9 1:#BE8AF9',
  75: 'l(100) 0:#8E1F7B 0.2:#C516B3 1:#C516B3',
  90: 'l(100) 0:#AC1212 0.2:#D33C3C 1:#D33C3C',
  100: 'l(100) 0:#FF4200 0.2:#FFC000 1:#FFC000',
  [LATEST_PER]: 'l(100) 0:#BFBFBF 0.2:#EFEFEF 1:#EFEFEF',
};

const lengedMap = {
  0: 'Min',
  10: '10分位',
  25: '25分位',
  50: '50分位',
  75: '75分位',
  90: '90分位',
  100: 'Max',
  [LATEST_PER]: 'Latest Vol',
};

const windows = [1, 3, 5, 10, 22, 44, 66, 132];

const STATUS = {
  CHART: 'chart',
  TABLE: 'table',
};

const Vol = props => {
  const { instrumentId } = props;
  const chartRef = useRef(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState([moment().subtract(30, 'd'), moment()]);
  const [status, setStatus] = useState(STATUS.CHART);
  const [strikePercentage, setStrikePercentage] = useState();

  const generateGradualColorStr = fdv => {
    const { rows } = fdv;
    const values = rows.map(item => item.value);
    const min = _.min<number>(values);
    const max = _.max<number>(values);
    const color = scaleLinear<string, number>()
      .domain([min, (max - min) / 2 + min, max])
      .range(['#77A786', '#FF4200', '#FFC000'])
      .clamp(true);
    const colorStrs = rows
      .map((item, index) => `${item.value / max}:${color(item.value)}`)
      .join(' ');
    return `l(270) ${colorStrs}`;
  };

  const fetch = async () => {
    setLoading(true);

    const [rsp, realRsp] = await Promise.all([
      getInstrumentVolCone({
        instrumentId,
        start_date: dates[0].format('YYYY-MM-DD'),
        end_date: dates[1].format('YYYY-MM-DD'),
        windows,
        percentiles: [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1],
      }),
      getInstrumentRealizedVol({
        instrumentId,
        tradeDate: dates[1].format('YYYY-MM-DD'),
      }),
    ]);
    if (rsp.error) {
      setLoading(false);
      return;
    }

    let fdata = _.flatten(
      rsp.data.map(item =>
        item.vols.map(iitem => ({
          percentile: _.toString(iitem.percentile),
          window: _.toString(item.window),
          value: iitem.vol,
          pname: lengedMap[iitem.percentile],
        })),
      ),
    );

    if (!realRsp.error) {
      fdata = fdata.concat(
        realRsp.data.map(item => ({
          percentile: LATEST_PER,
          window: _.toString(item.window),
          value: item.vol,
          pname: lengedMap[LATEST_PER],
        })),
      );
    }

    const dv = new DataSet.View().source(fdata);

    const gradualColorStr = generateGradualColorStr(dv);
    setLoading(false);
    setMeta({
      gradualColorStr,
      dv,
      tableData: [
        {
          strike_percentage: 'strike_percentage',
          '1天': '1天',
          '2天': '2天',
          '3天': '3天',
          '4天': '4天',
          '5天': '5天',
        },
        {
          strike_percentage: 'strike_percentage',
          '1天': '1天',
          '2天': '2天',
          '3天': '3天',
          '4天': '4天',
          '5天': '5天',
        },
        {
          strike_percentage: 'strike_percentage',
          '1天': '1天',
          '2天': '2天',
          '3天': '3天',
          '4天': '4天',
          '5天': '5天',
        },
        {
          strike_percentage: 'strike_percentage',
          '1天': '1天',
          '2天': '2天',
          '3天': '3天',
          '4天': '4天',
          '5天': '5天',
        },
        {
          strike_percentage: 'strike_percentage',
          '1天': '1天',
          '2天': '2天',
          '3天': '3天',
          '4天': '4天',
          '5天': '5天',
        },
      ],
      option: {
        tooltip: {},
        visualMap: {
          show: false,
          dimension: 2,
          min: -1,
          max: 1,
          inRange: {
            color: ['#dbdcd7', '#C66E8F', '#AF2961', '#3E083F', '#26083c'],
          },
        },
        xAxis3D: {
          type: 'value',
          name: 'strike_percentage',
          nameTextStyle: {
            fontSize: 12,
          },
        },
        yAxis3D: {
          type: 'value',
          name: '期限',
          nameTextStyle: {
            fontSize: 12,
          },
        },
        zAxis3D: {
          type: 'value',
          name: '波动率',
          nameTextStyle: {
            fontSize: 12,
          },
        },
        grid3D: {
          axisPointer: {
            lineStyle: {
              color: '#1692CD',
            },
          },
          axisTick: {
            length: 2,
          },
          axisLine: {
            lineStyle: {
              color: '#1692CD',
            },
          },
          splitLine: {
            show: false,
          },
          viewControl: {
            // projection: 'orthographic',
            distance: 200,
          },
          boxHeight: 100,
          boxWidth: 100,
          boxDepth: 100,
        },
        series: [
          {
            type: 'surface',
            parametric: true,
            // shading: 'albedo',
            wireframe: {
              show: false,
            },
            parametricEquation: {
              u: {
                min: -Math.PI,
                max: Math.PI,
                step: Math.PI / 20,
              },
              v: {
                min: 0,
                max: Math.PI,
                step: Math.PI / 20,
              },
              x(u, v) {
                return Math.sin(v) * Math.sin(u);
              },
              y(u, v) {
                return Math.sin(v) * Math.cos(u);
              },
              z(u, v) {
                return Math.cos(v);
              },
            },
          },
        ],
      },
    });
  };

  useEffect(() => {
    fetch();
  }, []);

  const getCom = () => {
    if (!meta) return null;
    if (status === STATUS.CHART) {
      return (
        <ReactEcharts
          style={{ height: '600px', width: '100%' }}
          // option={meta.option}
          option={{}}
          notMerge
          lazyUpdate
          onChartReady={ec => {
            ec.setOption(meta.option);
          }}
        />
      );
    }
    return (
      <ThemeTable
        pagination={{
          simple: true,
        }}
        dataSource={meta.tableData}
        columns={[
          {
            title: 'strike_percentage/期限',
            dataIndex: 'strike_percentage',
          },
          {
            title: '1天',
            dataIndex: '1天',
          },
          {
            title: '2天',
            dataIndex: '2天',
          },
          {
            title: '3天',
            dataIndex: '3天',
          },
          {
            title: '4天',
            dataIndex: '4天',
          },
          {
            title: '5天',
            dataIndex: '5天',
          },
        ]}
      />
    );
  };

  return (
    <>
      <Row type="flex" justify="space-between" align="middle" style={{ padding: 17 }} gutter={12}>
        <Col>
          <ThemeRadio.Group
            size="small"
            value={status}
            onChange={event => {
              setStatus(event.target.value);
            }}
          >
            <ThemeRadio.Button value={STATUS.CHART}>
              <img
                style={{ width: 12 }}
                src={
                  status === STATUS.CHART
                    ? // eslint-disable-next-line
                      require('@/assets/chart.png')
                    : // eslint-disable-next-line
                      require('@/assets/chart2.png')
                }
                alt=""
              />
            </ThemeRadio.Button>
            <ThemeRadio.Button value={STATUS.TABLE}>
              <img
                style={{ width: 12 }}
                src={
                  status === STATUS.TABLE
                    ? // eslint-disable-next-line
                      require('@/assets/table.png')
                    : // eslint-disable-next-line
                      require('@/assets/table2.png')
                }
                alt=""
              />
            </ThemeRadio.Button>
          </ThemeRadio.Group>
        </Col>
        <Col>
          <Row type="flex" justify="space-between" align="middle" gutter={12}>
            <Col>
              <ThemeDatePicker
                onChange={pDates => setDates(pDates)}
                // value={dates}
                allowClear={false}
              ></ThemeDatePicker>
            </Col>
            <Col>
              <ThemeSelect
                onChange={val => setStrikePercentage(val)}
                value={strikePercentage}
                placeholder="strike_percentage"
                style={{ minWidth: 200 }}
                fetchOptionsOnSearch
                showSearch
                options={async (value: string) => {
                  // const { data, error } = await mktInstrumentSearch({
                  //   instrumentIdPart: value,
                  // });
                  const { data, error } = await mktInstrumentWhitelistSearch({
                    instrumentIdPart: value,
                    excludeOption: true,
                  });
                  if (error) return [];
                  return data.slice(0, 50).map(item => ({
                    label: item,
                    value: item,
                  }));
                }}
              ></ThemeSelect>
            </Col>
            <Col>
              <ThemeButton
                loading={meta && loading}
                onClick={() => {
                  fetch();
                }}
                type="primary"
              >
                绘制
              </ThemeButton>
            </Col>
          </Row>
        </Col>
      </Row>
      {/* <ChartTitle>波动率锥</ChartTitle> */}
      <Row type="flex" justify="start" style={{ padding: 17 }} gutter={12}>
        {meta ? (
          getCom()
        ) : (
          <PosCenter>
            <Loading loading={loading}></Loading>
          </PosCenter>
        )}
      </Row>
    </>
  );
};

export default memo(
  connect(state => ({
    instrumentId: state.chartTalkModel.instrumentId,
  }))(Vol),
);
