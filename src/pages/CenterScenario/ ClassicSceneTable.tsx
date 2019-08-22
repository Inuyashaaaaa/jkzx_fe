import React, { memo, useState, useEffect } from 'react';
import useLifecycles from 'react-use/lib/useLifecycles';
import _ from 'lodash';
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

  const tableColDefs = [
    {
      title: '经典场景',
      dataIndex: 'classicScene',
      width: 150,
      onCell: () => ({ style: { color: 'rgba(222,230,240,1)' } }),
    },
    {
      title: '股灾（2015/6/22）',
      dataIndex: 'STOCK_CRASH_2015',
      width: 160,
      onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    },
    {
      title: '贸易战（2018/3/22）',
      dataIndex: 'TRADE_WAR_2018',
      width: 160,
      onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    },
    {
      title: '2008年金融危机（2018/9/15）',
      dataIndex: 'FINANCIAL_CRISIS_2008',
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

  useLifecycles(async () => {
    onSearch();
    setDataSource([
      {
        classicScene: 'Delta Cash',
        stockEchange: '2.312',
        tradeWar: '2.312',
        four: '2.569',
      },
      {
        classicScene: 'Gamma Cash   ',
        stockEchange: '2.312',
        tradeWar: '2.312',
        four: '2.569',
      },
      {
        classicScene: 'Vega',
        stockEchange: '2.312',
        tradeWar: '2.312',
        four: '2.569',
      },
      {
        classicScene: 'Theta',
        stockEchange: '2.312',
        tradeWar: '2.312',
        four: '2.569',
      },
      {
        classicScene: 'Rho_R',
        stockEchange: '2.312',
        tradeWar: '2.312',
        four: '2.569',
      },
    ]);
  });
  return (
    <div style={{ marginTop: 24 }}>
      <ThemeTable
        loading={tableLoading}
        wrapStyle={{ width: 670 }}
        dataSource={dataSource}
        columns={tableColDefs}
        pagination={false}
        rowkey="greekLatter"
      />
    </div>
  );
});

export default ClassicSceneTable;
