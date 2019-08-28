import React, { memo, useState, useEffect } from 'react';
import _ from 'lodash';
import { Popover } from 'antd';
import ThemeTable from '@/containers/ThemeTable';
import { rptClassicScenarioMarketRiskReportListByDate } from '@/services/report-service';

const ClassicSceneTable = memo(props => {
  const { valuationDate, instrumentId, classicSceneTable } = props;
  const [tableLoading, setTableLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);

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
      title: titleNode('股市异常波动'),
      dataIndex: 'STOCK_CRASH_2015',
      width: 150,
      onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    },
    {
      title: titleNode('贸易战'),
      dataIndex: 'TRADE_WAR_2018',
      width: 150,
      onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    },
    {
      title: titleNode('2008年金融危机'),
      dataIndex: 'FINANCIAL_CRISIS_2008',
      width: 150,
      onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    },
  ];

  const onSearch = async () => {
    setTableLoading(true);
    const { error, data } = await rptClassicScenarioMarketRiskReportListByDate({
      valuationDate: valuationDate.value.format('YYYY-MM-DD'),
      instrumentId: instrumentId.value,
    });
    setTableLoading(false);
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
    onSearch();
  }, [classicSceneTable]);

  return (
    <div style={{ marginTop: 24 }}>
      <ThemeTable
        loading={tableLoading}
        wrapStyle={{ width: 900 }}
        dataSource={dataSource}
        columns={tableColDefs}
        pagination={false}
        rowkey="greekLatter"
      />
    </div>
  );
});

export default ClassicSceneTable;
