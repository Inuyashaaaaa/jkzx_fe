import { Col, Row } from 'antd';
import { connect } from 'dva';
import 'echarts-gl';
import _ from 'lodash';
import moment from 'moment';
import React, { memo, useEffect, useState } from 'react';
import FormItem from 'antd/lib/form/FormItem';
import { getInstrumentVolSurface } from '@/services/terminal';
import ThemeTable from '@/containers/ThemeTable';
import { Loading } from '@/containers';
import PosCenter from '@/containers/PosCenter';
import ThemeButton from '@/containers/ThemeButton';
import ThemeDatePicker from '@/containers/ThemeDatePicker';
import ThemeRadio from '@/containers/ThemeRadio';
import ThemeSelect from '@/containers/ThemeSelect';
import { STRIKE_TYPE_ENUM } from '@/constants/global';
import FormItemWrapper from '@/containers/FormItemWrapper';
import { formatNumber } from '@/tools';
import { refTradeDateByOffsetGet } from '@/services/volatility';
import ReactEchart from './ReactEchart';

const STATUS = {
  CHART: 'chart',
  TABLE: 'table',
};

const Vol = props => {
  const { data = {}, dispatch, loading, strikeType } = props;
  const [meta, setMeta] = useState();
  const [valuationDate, setValuationDate] = useState(null);
  const [tradeDate, setTradeDate] = useState(false);
  const [status, setStatus] = useState(STATUS.CHART);
  const [strikeTypeData, setStrikeTypeData] = useState(strikeType);
  const [typeData, setTypeData] = useState(strikeType);
  const [optionData, setOptionData] = useState([]);

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
        onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
        render: value => <span>{formatNumber(_.toNumber(value) * 100, 2)}</span>,
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
    setOptionData(curData);
    setMeta({
      tableColumns,
      tableData,
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

  const getCom = () => {
    if (!meta) return null;
    if (status === STATUS.CHART) {
      return <ReactEchart optionData={optionData} strikeType={strikeType} />;
    }

    const ColumnsHead = [
      {
        title: `${typeData === STRIKE_TYPE_ENUM.STRIKE ? '行权价(￥)\\期限' : '行权价(%)\\期限'}`,
        dataIndex: 'percent',
        onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
        render: value => {
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
