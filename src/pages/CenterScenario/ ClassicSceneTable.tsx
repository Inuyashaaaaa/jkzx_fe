import React, { memo, useState, useEffect } from 'react';
import useLifecycles from 'react-use/lib/useLifecycles';
import ThemeTable from '@/containers/ThemeTable';

const ClassicSceneTable = memo(props => {
  const [tableLoading, setTableLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const tableColDefs = [
    {
      title: '经典场景',
      dataIndex: 'classicScene',
      width: 150,
    },
    {
      title: '股灾',
      dataIndex: 'stockEchange',
      width: 150,
    },
    {
      title: '贸易战',
      dataIndex: 'tradeWar',
      width: 150,
    },
    {
      title: '2008年金融危机',
      dataIndex: 'four',
    },
  ];

  useLifecycles(() => {
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
