import DataSet from '@antv/data-set';
import { Col, Row } from 'antd';
import { scaleLinear } from 'd3-scale';
import { connect } from 'dva';
import ReactEcharts from 'echarts-for-react';
import 'echarts-gl';
import _ from 'lodash';
import moment from 'moment';
import React, { memo, useEffect, useRef, useState } from 'react';
import FormItem from 'antd/lib/form/FormItem';
import {
  getInstrumentRealizedVol,
  getInstrumentVolCone,
  getInstrumentVolSurface,
} from '@/services/terminal';
import ThemeTable from '@/containers/ThemeTable';
import { Loading } from '@/containers';
import PosCenter from '@/containers/PosCenter';
import ThemeButton from '@/containers/ThemeButton';
import ThemeDatePicker from '@/containers/ThemeDatePicker';
import ThemeRadio from '@/containers/ThemeRadio';
import ThemeSelect from '@/containers/ThemeSelect';
import { delay } from '@/utils';
import { STRIKE_TYPE_ENUM } from '@/constants/global';
import FormItemWrapper from '@/containers/FormItemWrapper';
import { formatNumber } from '@/tools';
import { refTradeDateByOffsetGet } from '@/services/volatility';

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
  const { instrumentId, data = {}, dispatch, loading, strikeType } = props;
  const [meta, setMeta] = useState();
  const [valuationDate, setValuationDate] = useState(null);
  const [tradeDate, setTradeDate] = useState(false);
  const [status, setStatus] = useState(STATUS.CHART);
  const [echartInstance, setEchartInstance] = useState();
  const [strikeTypeData, setStrikeTypeData] = useState(strikeType);
  const [typeData, setTypeData] = useState(strikeType);

  const setData = pData => {
    dispatch({
      type: 'centerUnderlying/setState',
      payload: {
        data: pData,
      },
    });
  };

  const setLoading = pLoading => {
    dispatch({
      type: 'centerUnderlying/setState',
      payload: {
        loading: pLoading,
      },
    });
  };

  const setStrikeType = pType => {
    dispatch({
      type: 'centerUnderlying/setState',
      payload: {
        strikeType: pType,
      },
    });
  };

  const setFetchStrikeType = pType => {
    dispatch({
      type: 'centerUnderlying/setState',
      payload: {
        fetchStrikeType: pType,
      },
    });
  };

  const fetch = async param => {
    const searchDates = param || valuationDate;
    setLoading(true);
    const rsp = await getInstrumentVolSurface({
      instrumentId: props.instrumentId,
      valuationDate: searchDates.format('YYYY-MM-DD'),
      strikeType: strikeTypeData,
    });
    setLoading(false);
    if (rsp.error) {
      setData({
        modelInfo: {
          instruments: [],
        },
      });
      return;
    }
    setData(rsp.data);
    setTypeData(strikeTypeData);
  };

  const convert = async () => {
    if (_.isEmpty(data)) return;
    const {
      modelInfo: { instruments = [] },
    } = data;
    const tableColumns = _.map(instruments, val => {
      const { tenor } = val;
      return {
        title: tenor.replace('D', '天'),
        dataIndex: tenor,
        render: (value, record, index) => <span>{formatNumber(_.toNumber(value) * 100, 2)}</span>,
      };
    });

    const rowsData = _.map(instruments, val => {
      const { vols = [], tenor } = val;
      const itemName = strikeType === STRIKE_TYPE_ENUM.STRIKE ? 'strike' : 'percent';
      vols.sort((a, b) => a[itemName] - b[itemName]);
      return vols.map(item => ({
        [tenor]: item.quote,
        percent: item[strikeType === STRIKE_TYPE_ENUM.STRIKE ? 'strike' : 'percent'],
      }));
    });
    const tableData = [];

    rowsData.forEach(arrs => {
      arrs.forEach((item, index) => {
        tableData[index] = {
          ...item,
          ...tableData[index],
        };
      });
    });

    const curData = _.flatten(
      instruments.map(item => {
        const { vols = [], tenor } = item;
        return vols.map(iitem => {
          const { strike, percent, quote } = iitem;
          return [
            strikeType === STRIKE_TYPE_ENUM.STRIKE ? strike : percent,
            Number(tenor.replace('D', '')),
            quote,
          ];
        });
      }),
    );
    setMeta({
      tableColumns,
      tableData,
      option: {
        tooltip: {
          formatter: params => {
            const { data: pData } = params;
            const [x, y, z] = pData;
            return `${strikeType === STRIKE_TYPE_ENUM.STRIKE ? '行权价(￥)' : '行权价(%)'}: ${
              strikeType === STRIKE_TYPE_ENUM.STRIKE ? formatNumber(x, 2) : formatNumber(x * 100, 2)
            }<br/>期限: ${y}<br/>波动率(%): ${formatNumber(z * 100, 2)}`;
          },
        },
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
          name: `${strikeType === STRIKE_TYPE_ENUM.STRIKE ? '行权价(￥)' : '行权价(%)'}`,
          nameTextStyle: {
            fontSize: 14,
            lineHeight: 40,
          },
          axisLabel: {
            formatter: param => {
              if (strikeType === STRIKE_TYPE_ENUM.STRIKE) {
                return param;
              }
              return formatNumber(param * 100, 0);
            },
            fontSize: 14,
          },
          axisPointer: {
            label: {
              formatter: param => {
                if (strikeType === STRIKE_TYPE_ENUM.STRIKE) {
                  return formatNumber(_.toNumber(_.replace(param, ',', '')), 2);
                }
                return formatNumber(param * 100, 2);
              },
            },
          },
        },
        yAxis3D: {
          type: 'value',
          name: '期限(天)',
          nameTextStyle: {
            fontSize: 14,
            lineHeight: 40,
          },
          axisPointer: {
            label: {
              formatter: param => formatNumber(_.toNumber(param), 2),
            },
          },
          axisLabel: {
            fontSize: 14,
          },
        },
        zAxis3D: {
          type: 'value',
          name: '波动率(%)',
          nameTextStyle: {
            fontSize: 14,
            lineHeight: 40,
          },
          axisLabel: {
            formatter: param => formatNumber(param * 100, 0),
            fontSize: 14,
          },
          axisPointer: {
            label: {
              formatter: param => formatNumber(param * 100, 2),
            },
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
            wireframe: {
              show: false,
            },
            data: curData,
          },
        ],
      },
    });
  };

  const getDate = async () => {
    const res = await refTradeDateByOffsetGet({
      offset: -2,
    });
    setTradeDate(true);
    if (res.error) return;
    setValuationDate(moment(res.data));
    fetch(moment(res.data));
  };

  useEffect(() => {
    getDate();
  }, []);

  useEffect(() => {
    if (props.instrumentId && tradeDate) {
      fetch();
      setData({});
    }
  }, [props.instrumentId]);

  useEffect(() => {
    convert();
  }, [data, status]);

  useEffect(() => {
    if (meta && echartInstance && status === STATUS.CHART) {
      echartInstance.setOption(meta.option);
    }
  }, [meta, echartInstance]);

  const getCom = () => {
    if (!meta) return null;
    if (status === STATUS.CHART) {
      return (
        <ReactEcharts
          style={{ height: '400px', width: '100%' }}
          // option={meta.option}
          option={{}}
          notMerge
          lazyUpdate
          onChartReady={ec => {
            setEchartInstance(ec);
          }}
        />
      );
    }

    const ColumnsHead = [
      {
        title: `${typeData === STRIKE_TYPE_ENUM.STRIKE ? '行权价(￥)\\期限' : '行权价(%)\\期限'}`,
        dataIndex: 'percent',
        render: (value, record, index) => {
          if (typeData === STRIKE_TYPE_ENUM.STRIKE) {
            return <span>{formatNumber(_.toNumber(value), 2)}</span>;
          }
          return <span>{formatNumber(_.toNumber(value) * 100, 2)}</span>;
        },
      },
    ];

    return (
      <ThemeTable
        scroll={{ x: 720 }}
        pagination={{
          simple: true,
        }}
        loading={loading}
        dataSource={meta.tableData}
        columns={_.concat(ColumnsHead, ...meta.tableColumns)}
      />
    );
  };

  return (
    <>
      <Row type="flex" justify="start" align="middle" gutter={12} style={{ padding: 17 }}>
        <Col>
          <FormItemWrapper>
            <FormItem label="日期" style={{ fontSize: 16 }}>
              <ThemeDatePicker
                onChange={pDate => setValuationDate(pDate)}
                value={valuationDate}
                allowClear={false}
                disabledDate={current => current && current > moment()}
              ></ThemeDatePicker>
            </FormItem>
          </FormItemWrapper>
        </Col>
        <Col>
          <FormItemWrapper>
            <FormItem label="行权价类型" style={{ fontSize: 16 }}>
              <ThemeSelect
                onChange={val => {
                  setStrikeTypeData(val);
                }}
                value={strikeTypeData}
                placeholder="行权价类型"
                style={{ minWidth: 200 }}
                options={[
                  {
                    label: '行权价(￥)',
                    value: STRIKE_TYPE_ENUM.STRIKE,
                  },
                  {
                    label: '行权价(%)',
                    value: STRIKE_TYPE_ENUM.STRIKE_PERCENTAGE,
                  },
                ]}
              ></ThemeSelect>
            </FormItem>
          </FormItemWrapper>
        </Col>
        <Col>
          <ThemeButton
            loading={meta && loading}
            onClick={() => {
              fetch();
              setFetchStrikeType(strikeTypeData);
              setStrikeType(strikeTypeData);
            }}
            type="primary"
          >
            绘制
          </ThemeButton>
        </Col>
      </Row>
      <Row
        type="flex"
        justify="space-between"
        align="middle"
        style={{ padding: '0px 17px' }}
        gutter={12}
      >
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
      </Row>
      {/* <ChartTitle>波动率锥</ChartTitle> */}
      <Row type="flex" justify="start" style={{ padding: 17 }} gutter={12}>
        {meta ? (
          getCom()
        ) : (
          <PosCenter height={420}>
            <Loading loading={loading}></Loading>
          </PosCenter>
        )}
      </Row>
    </>
  );
};

export default memo(
  connect(state => ({
    instrumentId: state.centerUnderlying.instrumentId,
    loading: state.centerUnderlying.loading,
    data: state.centerUnderlying.data,
    strikeType: state.centerUnderlying.strikeType,
  }))(Vol),
);
