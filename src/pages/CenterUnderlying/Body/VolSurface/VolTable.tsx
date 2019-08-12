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
  const { loading, dispatch } = props;

  const setLoading = data => {
    dispatch({
      type: 'centerUnderlying/setState',
      payload: {
        loading: data,
      },
    });
  };
  const fetch = async data => {
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
    fetch(props.volReport);
  }, [props.volReport]);

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
        style={{
          margin: '0 50px 0 0',
        }}
      />
    </div>
  );
};

export default memo(
  connect(state => ({
    volReport: state.centerUnderlying.volReport,
    loading: state.centerUnderlying.loading,
  }))(VolTable),
);
