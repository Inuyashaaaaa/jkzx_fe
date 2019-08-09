import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import ThemeTable from '@/containers/ThemeTable';
import GradientBox from './GradientBox';
import { getImpliedVolReport } from '@/services/terminal';

const Vol = () => {
  const [tableData, setTableData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState();
  const [max, setMax] = useState(0);

  const fetch = async () => {
    setLoading(true);
    const rsp = await getImpliedVolReport({
      instrumentId: '510050.SH',
      reportDate: '2019-08-08',
    });
    setLoading(false);
    const { error, data = {} } = rsp;
    if (rsp.error) return;
    setTableData(
      data.map(item => ({
        name: item.legalEntityName,
        min: item.minVol,
        max: item.maxVol,
        average: item.meanVol,
        median: item.medianVol,
      })),
    );
    setTotal(data.length);
    setMax(_.max(data.map(item => item.maxVol)));
  };

  useEffect(() => {
    fetch();
  }, [pagination]);

  const columns = [
    {
      dataIndex: 'name',
      width: 100,
    },
    {
      title: '最小值',
      dataIndex: 'min',
      width: 100,
      render: value => <GradientBox value={value} max={max} />,
    },
    {
      title: '最大值',
      dataIndex: 'max',
      width: 100,
      render: value => <GradientBox value={value} max={max} />,
    },
    {
      title: '平均值',
      dataIndex: 'average',
      width: 100,
      render: value => <GradientBox value={value} max={max} />,
    },
    {
      title: '中位数',
      dataIndex: 'median',
      width: 100,
      render: value => <GradientBox value={value} max={max} />,
    },
  ];

  return (
    <div
      style={{
        width: 900,
      }}
    >
      <ThemeTable
        loading={loading}
        pagination={{
          ...pagination,
          total,
          simple: true,
        }}
        dataSource={tableData}
        onChange={(ppagination, filters, psorter) => {
          setPagination(ppagination);
        }}
        columns={columns}
      />
    </div>
  );
};

export default Vol;
