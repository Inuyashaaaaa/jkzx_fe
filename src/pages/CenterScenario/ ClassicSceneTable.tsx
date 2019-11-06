import React, { memo, useState, useEffect } from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import moment from 'moment';
import { Popover } from 'antd';
import ThemeTable from '@/containers/ThemeTable';
import { rptClassicScenarioMarketRiskReportListByDate } from '@/services/report-service';
import { formatNumber } from '@/tools';

const Title = styled.div`
  font-size: 18px;
  font-weight: 400;
  color: rgba(246, 250, 255, 1);
  line-height: 32px;
  margin-bottom: 10px;
`;

const ClassicSceneTable = memo(props => {
  const { classicSceneTable, reportFormData } = props;
  const [tableLoading, setTableLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [reportTime, setReportTime] = useState('');

  const colDefsMirrior = {
    deltaCash: 'Delta Cash',
    gammaCash: 'Gamma Cash',
    vega: 'Vega',
    theta: 'Theta',
    rho: 'Rho_R',
    pnlChange: 'Pnl Change',
  };

  const content = (
    <div>
      <p>日期： 2015/6/22</p>
      <p>标的物价格变化幅度： -33$</p>
    </div>
  );
  const titleNode = title => (
    <Popover content={content} trigger="hover">
      {title}
    </Popover>
  );

  const tableColDefs = [
    {
      title: titleNode('经典场景'),
      dataIndex: 'classicScene',
      width: 100,
      onCell: () => ({ style: { color: 'rgba(222,230,240,1)' } }),
    },
    {
      title: '股市异常波动（2015/6/26）',
      dataIndex: 'STOCK_CRASH_2015',
      align: 'right',
      width: 150,
      render: val => val && formatNumber(val, 2),
      onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    },
    {
      title: titleNode('贸易战'),
      dataIndex: 'TRADE_WAR_2018',
      align: 'right',
      width: 150,
      render: val => val && formatNumber(val, 2),
      onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    },
    {
      title: '2008年金融危机（2008/9/16）',
      dataIndex: 'FINANCIAL_CRISIS_2008',
      align: 'right',
      width: 150,
      render: val => val && formatNumber(val, 2),
      onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    },
  ];

  const onSearch = async () => {
    setTableLoading(true);
    let formData = {
      valuationDate: reportFormData.valuationDate.format('YYYY-MM-DD'),
      instrumentId: reportFormData.underlyer,
      reportType: reportFormData.reportType,
    };
    if (reportFormData.reportType === 'PARTY') {
      formData = {
        ...formData,
        partyName: reportFormData.legalName,
      };
    }
    if (reportFormData.reportType === 'SUBSIDIARY') {
      formData = {
        ...formData,
        subsidiary: reportFormData.subName,
      };
    }

    const { error, data } = await rptClassicScenarioMarketRiskReportListByDate(formData);
    setTableLoading(false);

    const createdAt = _.get(data, '[0].createdAt');
    const reportDate = createdAt ? moment(createdAt).format('YYYY-MM-DD HH:mm:ss') : '';
    setReportTime(reportDate);

    if (error) return;
    if (!data.length) {
      setDataSource([]);
      return;
    }
    const tableData = Object.keys(colDefsMirrior).map(item =>
      data.reduce(
        (prev, next) => ({
          ...prev,
          [next.scenarioType]: next[item],
        }),
        { classicScene: _.get(colDefsMirrior, item) },
      ),
    );
    setDataSource(tableData);
  };

  useEffect(() => {
    if (props.tradeDate) {
      onSearch();
    }
  }, [classicSceneTable]);

  const titleTxt = reportTime ? `报告计算时间：${reportTime} ` : '';

  return (
    <div style={{ marginTop: 24 }}>
      <Title>{titleTxt}</Title>
      <ThemeTable
        loading={tableLoading}
        dataSource={dataSource}
        columns={tableColDefs}
        pagination={false}
        rowkey="greekLatter"
      />
    </div>
  );
});

export default ClassicSceneTable;
