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

  return (
    <div
      style={{
        width: 1078,
      }}
    >
      <Title>全市场分品种风险报告</Title>
      <Row
        type="flex"
        justify="space-between"
        align="middle"
        gutter={12}
        style={{ marginTop: 21, marginBottom: 13 }}
      >
        <Col>
          <Row type="flex" justify="start" align="middle" gutter={12}>
            <Col>
              <ThemeDatePicker
                onChange={pDate => setFormData({ ...formData, valuationDate: pDate })}
                value={formData.valuationDate}
                allowClear={false}
                placeholder="观察日"
              ></ThemeDatePicker>
            </Col>
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
            data={
              {
                // searchMethod: cliFundEventSearch,
                // argument: {
                //   searchFormData: this.handleSearchForm(),
                // },
                // cols: TABLE_COL_DEFS,
                // name: '财务出入金管理',
                // colSwitch: [],
                // handleDataSource: this.handleDataSource,
                // getSheetDataSourceItemMeta: (val, dataIndex, rowIndex) => {
                //   if (dataIndex === 'paymentAmount' && rowIndex > 0) {
                //     return {
                //       t: 'n',
                //       z: Math.abs(val) >= 1000 ? '0,0.0000' : '0.0000',
                //     };
                //   }
                // },
              }
            }
          >
            导出
          </DownloadExcelButton>
        </Col>
      </Row>
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
        columns={[
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
        ]}
      />
    </div>
  );
};

export default Risk;
