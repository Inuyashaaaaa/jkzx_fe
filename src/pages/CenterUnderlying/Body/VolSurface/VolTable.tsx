import React, { useState, useEffect, memo } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import { connect } from 'dva';
import ThemeTable from '@/containers/ThemeTable';
import GradientBox from './GradientBox';
import { getImpliedVolReport } from '@/services/terminal';

const VolTable = props => {
  const [tableData, setTableData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [total, setTotal] = useState();
  const [max, setMax] = useState(0);
  const { dispatch } = props;
  const fetch = async (data = []) => {
    let newData = _.reverse(_.sortBy(data, 'notionalAmount'));
    if (!newData.length) {
      // eslint-disable-next-line
      newData = [];
    }
    setTableData(
      newData.map(item => ({
        name: item.legalEntityName,
        min: item.minVol,
        max: item.maxVol,
        average: item.meanVol,
        median: item.medianVol,
        q1: item.oneQuaterVol,
        q3: item.threeQuaterVol,
      })),
    );
    setTotal(newData.length);
    setMax(_.max(newData.map(item => item.maxVol)));
  };

  useEffect(() => {
    fetch(props.volReport);
  }, [props.volReport]);

  const columns = [
    {
      dataIndex: 'name',
      width: 100,
      render: val => <span>{val}</span>,
    },
    {
      title: '最小值',
      dataIndex: 'min',
      width: 190,
      onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
      render: value => (
        <span>
          <GradientBox value={value} max={max} />
        </span>
      ),
    },
    {
      title: '最大值',
      dataIndex: 'max',
      width: 190,
      onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
      render: value => (
        <span>
          <GradientBox value={value} max={max} />
        </span>
      ),
    },
    {
      title: '平均值',
      dataIndex: 'average',
      width: 190,
      onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
      render: value => (
        <span>
          <GradientBox value={value} max={max} />
        </span>
      ),
    },
    {
      title: '中位数',
      dataIndex: 'median',
      width: 190,
      onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
      render: value => (
        <span>
          <GradientBox value={value} max={max} />
        </span>
      ),
    },
    {
      title: '上四分位数',
      dataIndex: 'q3',
      width: 190,
      onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
      render: value => (
        <span>
          <GradientBox value={value} max={max} />
        </span>
      ),
    },
    {
      title: '下四分位数',
      dataIndex: 'q1',
      width: 190,
      onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
      render: value => (
        <span>
          <GradientBox value={value} max={max} />
        </span>
      ),
    },
  ];

  return (
    <ThemeTable
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
      scroll={{ x: 1240 }}
    />
  );
};

export default memo(
  connect(state => ({
    volReport: state.centerUnderlying.volReport,
  }))(VolTable),
);
