import { Col, Row } from 'antd';
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import _ from 'lodash';
import ThemeButton from '@/containers/ThemeButton';
import ThemeDatePicker from '@/containers/ThemeDatePicker';
import ThemeRadio from '@/containers/ThemeRadio';
import ThemeSelect from '@/containers/ThemeSelect';
import { mktInstrumentWhitelistSearch } from '@/services/market-data-service';
import ThemeTable from '@/containers/ThemeTable';
import { rptSearchPagedMarketRiskDetailReport } from '@/services/report-service';
import formatNumber from '@/utils/format';
import ThemeInput from '@/containers/ThemeInput';
import DownloadExcelButton from '@/containers/DownloadExcelButton';
import GradientBox from './GradientBox';

const Title = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: rgba(246, 250, 255, 1);
  line-height: 32px;
`;

const ORDER_BY = {
  ascend: 'asc',
  descend: 'desc',
};

const Vol = () => {
  const [tableData, setTableData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [loading, setLoading] = useState(false);
  const [sorter, setSorter] = useState({});
  const [total, setTotal] = useState();
  const [max, setMax] = useState(0);

  const fetch = async () => {
    setLoading(true);
    // const rsp = await rptSearchPagedMarketRiskDetailReport({
    //   valuationDate: searchFormData.valuationDate.format('YYYY-MM-DD'),
    //   page: pagination.current - 1,
    //   pageSize: pagination.pageSize,
    //   instrumentIdPart: searchFormData.instrumentIdPart,
    //   order: ORDER_BY[sorter.order],
    //   orderBy: sorter.field,
    // });
    setLoading(false);
    // const { error, data = {} } = rsp;
    // const { page, totalCount } = data;
    // if (rsp.error) return;
    // setTableData(page);
    // setTotal(totalCount);
    const data = [
      {
        name: '中心',
        min: 2,
        max: 13,
        average: 6,
        median: 24,
      },
      {
        name: '中心1',
        min: 22,
        max: 25,
        average: 23,
        median: 24,
      },
      {
        name: '中心2',
        min: 12,
        max: 40,
        average: 16,
        median: 18,
      },
    ];
    setTableData(data);
    setMax(_.max(data.map(item => item.max)));
    setTotal(10);
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
        width: 700,
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
