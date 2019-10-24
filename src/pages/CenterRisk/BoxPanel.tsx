import React, { memo, useState, useEffect } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import _ from 'lodash';
import { Col, Row } from 'antd';
import ThemeStatistic from '@/containers/ThemeStatistic';
import Unit from './containers/Unit';
import { rptMarketRiskReportListByDate } from '@/services/report-service';
import ThemeTable from '@/containers/ThemeTable';
import ThemeButton from '@/containers/ThemeButton';
import DownloadExcelButton from '@/containers/DownloadExcelButton';
import formatNumber from '@/utils/format';

const BoxWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  width: ${770 + 22}px;
  height: 60px;
  border: 1px solid rgba(0, 232, 232, 0.5);
`;

const BoxInner = styled.div`
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: center;
  flex-grow: 1;
  height: 100%;
`;

const Box = styled.div``;

const BoxSplit = styled.div`
  width: 1px;
  height: 26px;
  background: rgba(0, 232, 232, 0.3);
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 400;
  color: rgba(246, 250, 255, 1);
  line-height: 32px;
  margin: 20px 0;
`;

const columns = [
  {
    title: 'Delta_Cash',
    dataIndex: 'deltaCash',
    align: 'right',
    width: 100,
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: value => formatNumber({ value, formatter: '0,0.00' }),
  },
  {
    title: 'Gamma_Cash',
    dataIndex: 'gammaCash',
    align: 'right',
    width: 100,
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: value => formatNumber({ value, formatter: '0,0.00' }),
  },
  {
    title: 'Vega',
    dataIndex: 'vega',
    align: 'right',
    width: 100,
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: value => formatNumber({ value, formatter: '0,0.00' }),
  },
  {
    title: 'Theta',
    dataIndex: 'theta',
    align: 'right',
    width: 100,
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: value => formatNumber({ value, formatter: '0,0.00' }),
  },
  {
    title: 'Rho',
    dataIndex: 'rho',
    align: 'right',
    width: 100,
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: value => formatNumber({ value, formatter: '0,0.00' }),
  },
];

const BoxPanel = memo(props => {
  const { date, ...rest } = props;
  const [result, setResult] = useState({});
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  const fechData = async () => {
    setLoading(true);
    const resp = await rptMarketRiskReportListByDate({
      valuationDate: date.format('YYYY-MM-DD'),
    });
    setLoading(false);
    setResult(_.get(resp, 'data[0]', {}));
    setDataSource(resp.data);
  };

  useEffect(() => {
    fechData();
  }, [date]);

  const createdAt = _.get(result, 'createdAt');
  const reportTime = createdAt ? moment(createdAt).format('YYYY-MM-DD hh:mm:ss') : '';
  const titleTxt = reportTime
    ? `全市场整体风险报告（报告计算时间：${reportTime} ）`
    : '全市场整体风险报告';

  return (
    <>
      <Row
        type="flex"
        justify="space-between"
        align="middle"
        gutter={12}
        style={{ marginTop: 18, marginBottom: 13 }}
      >
        <Col>
          <Title>{titleTxt}</Title>
        </Col>
        <Col>
          <DownloadExcelButton
            component={ThemeButton}
            type="primary"
            data={{
              searchMethod: rptMarketRiskReportListByDate,
              argument: {
                searchFormData: {
                  valuationDate: date.format('YYYY-MM-DD'),
                },
              },
              cols: columns,
              name: '全市场整体风险报告',
              colSwitch: [],
              getSheetDataSourceItemMeta: (val, dataIndex, rowIndex) => {
                if (rowIndex > 0) {
                  return {
                    t: 'n',
                    z: Math.abs(val) >= 1000 ? '0,0.0000' : '0.0000',
                  };
                }
                return null;
              },
            }}
          >
            导出
          </DownloadExcelButton>
        </Col>
      </Row>
      <ThemeTable loading={loading} dataSource={dataSource} pagination={false} columns={columns} />
    </>
  );
});

export default BoxPanel;
