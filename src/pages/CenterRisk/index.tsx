import { Col, Row, Statistic, Input } from 'antd';
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import _ from 'lodash';
import FormItem from 'antd/lib/form/FormItem';
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
import FormItemWrapper from '@/containers/FormItemWrapper';

import ThemeStatistic from '@/containers/ThemeStatistic';
import BoxPanel from './BoxPanel';
import Unit from './containers/Unit';

const Title = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: rgba(246, 250, 255, 1);
  line-height: 32px;
`;

const BigTitle = styled.div`
  font-size: 22px;
  font-weight: 400;
  color: rgba(246, 250, 255, 1);
  line-height: 32px;
`;

const UnitWrap = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  transform: translateX(100%);
  height: 60px;
`;

const ORDER_BY = {
  ascend: 'asc',
  descend: 'desc',
};

const Risk = () => {
  const [tableData, setTableData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [loading, setLoading] = useState(false);
  const [sorter, setSorter] = useState({});
  const [total, setTotal] = useState();
  const [formData, setFormData] = useState({
    valuationDate: moment(),
    instrumentIdPart: '',
  });
  const [searchFormData, setSearchFormData] = useState(formData);

  const fetch = async () => {
    setLoading(true);
    const rsp = await rptSearchPagedMarketRiskDetailReport({
      valuationDate: searchFormData.valuationDate.format('YYYY-MM-DD'),
      page: pagination.current - 1,
      pageSize: pagination.pageSize,
      instrumentIdPart: searchFormData.instrumentIdPart,
      order: ORDER_BY[sorter.order],
      orderBy: sorter.field,
    });
    setLoading(false);
    const { error, data = {} } = rsp;
    const { page, totalCount } = data;
    if (rsp.error) return;
    setTableData(page);
    setTotal(totalCount);
  };

  useEffect(() => {
    fetch();
  }, [sorter, pagination, searchFormData]);

  const columns = [
    {
      title: '标的物合约',
      dataIndex: 'underlyerInstrumentId',
      width: 100,
    },
    {
      title: 'Delta',
      dataIndex: 'delta',
      width: 100,
      sortOrder: sorter.field === 'delta' && sorter.order,
      sorter: true,
      render: value => formatNumber({ value, formatter: '0,0.00' }),
      align: 'right',
    },
    {
      title: 'Delta_Cash',
      dataIndex: 'deltaCash',
      width: 100,
      sortOrder: sorter.field === 'deltaCash' && sorter.order,
      sorter: true,
      render: value => formatNumber({ value, formatter: '0,0.00' }),
      align: 'right',
    },
    {
      title: 'Gamma',
      dataIndex: 'gamma',
      width: 100,
      sortOrder: sorter.field === 'gamma' && sorter.order,
      sorter: true,
      render: value => formatNumber({ value, formatter: '0,0.00' }),
      align: 'right',
    },
    {
      title: 'Gamma_Cash',
      dataIndex: 'gammaCash',
      width: 100,
      sortOrder: sorter.field === 'gammaCash' && sorter.order,
      sorter: true,
      render: value => formatNumber({ value, formatter: '0,0.00' }),
      align: 'right',
    },
    {
      title: 'Vega',
      dataIndex: 'vega',
      width: 100,
      sortOrder: sorter.field === 'vega' && sorter.order,
      sorter: true,
      render: value => formatNumber({ value, formatter: '0,0.00' }),
      align: 'right',
    },
    {
      title: 'Theta',
      dataIndex: 'theta',
      width: 100,
      sortOrder: sorter.field === 'theta' && sorter.order,
      sorter: true,
      render: value => formatNumber({ value, formatter: '0,0.00' }),
      align: 'right',
    },
    {
      title: 'Rho',
      dataIndex: 'rho',
      width: 100,
      sortOrder: sorter.field === 'rho' && sorter.order,
      sorter: true,
      render: value => formatNumber({ value, formatter: '0,0.00' }),
      align: 'right',
    },
  ];

  return (
    <div
      style={{
        width: 1078,
      }}
    >
      <Row type="flex" justify="start" gutter={14} style={{ marginBottom: 30 }}>
        <Col>
          <BigTitle>全市场风险报告</BigTitle>
        </Col>
        <Col>
          <ThemeDatePicker
            onChange={pDate => setFormData({ ...formData, valuationDate: pDate })}
            value={formData.valuationDate}
            allowClear={false}
            placeholder="请选择观察日"
          ></ThemeDatePicker>
        </Col>
      </Row>
      <Title>全市场整体风险报告</Title>
      <BoxPanel style={{ marginBottom: 18, marginTop: 18 }}></BoxPanel>
      <Title>全市场分品种风险报告</Title>
      <Row
        type="flex"
        justify="space-between"
        align="middle"
        gutter={12}
        style={{ marginTop: 18, marginBottom: 13 }}
      >
        <Col>
          <Row type="flex" justify="start" align="middle" gutter={12}>
            <Col>
              <ThemeInput
                value={formData.instrumentIdPart}
                onChange={event => {
                  setFormData({ ...formData, instrumentIdPart: _.get(event.target, 'value') });
                }}
                placeholder="标的物搜索，默认全部"
              ></ThemeInput>
            </Col>
            <Col>
              <ThemeButton
                type="primary"
                onClick={() => {
                  setSearchFormData({
                    ...formData,
                  });
                }}
              >
                搜索
              </ThemeButton>
            </Col>
          </Row>
        </Col>
        <Col>
          <DownloadExcelButton
            component={ThemeButton}
            type="primary"
            data={{
              searchMethod: rptSearchPagedMarketRiskDetailReport,
              argument: {
                valuationDate: searchFormData.valuationDate.format('YYYY-MM-DD'),
                instrumentIdPart: searchFormData.instrumentIdPart,
              },
              cols: columns,
              name: '风险报告',
              colSwitch: [],
              getSheetDataSourceItemMeta: (val, dataIndex, rowIndex) => {
                if (dataIndex !== 'underlyerInstrumentId' && rowIndex > 0) {
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
      <div style={{ position: 'relative' }}>
        <ThemeTable
          loading={loading}
          pagination={{
            ...pagination,
            total,
            simple: true,
          }}
          dataSource={tableData}
          onChange={(ppagination, filters, psorter) => {
            setSorter(psorter);
            setPagination(ppagination);
          }}
          columns={columns}
        />
        <UnitWrap>
          <Unit hookTopRight></Unit>
        </UnitWrap>
      </div>
    </div>
  );
};

export default Risk;
