import { Col, Row, Statistic, Input } from 'antd';
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import moment from 'moment';
import ThemeButton from '@/containers/ThemeButton';
import ThemeTable from '@/containers/ThemeTable';
import { rptSearchPagedSubsidiaryMarketRiskReport } from '@/services/report-service';
import formatNumber from '@/utils/format';
import ThemeInput from '@/containers/ThemeInput';
import DownloadExcelButton from '@/containers/DownloadExcelButton';
import Unit from './containers/Unit';

const Title = styled.div`
  font-size: 18px;
  font-weight: 400;
  color: rgba(246, 250, 255, 1);
  line-height: 32px;
  margin: 20px 0;
`;

const ORDER_BY = {
  ascend: 'asc',
  descend: 'desc',
};

const UnitWrap = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  transform: translateX(100%);
  height: 60px;
`;

const TableSubsidiaryWhole = (props: any) => {
  const { valuationDate } = props;
  const [tableData, setTableData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [loading, setLoading] = useState(false);
  const [sorter, setSorter] = useState({});
  const [total, setTotal] = useState();
  const [store, setStore] = useState({});

  let initFormData = {
    subsidiaryPart: '',
  };
  const { query } = props;

  if (_.get(query, 'activeKey') === props.activeKey && _.get(query, 'bookName')) {
    initFormData = {
      ...initFormData,
      subsidiaryPart: query.bookName,
    };
  }

  const [formData, setFormData] = useState(initFormData);
  const [searchFormData, setSearchFormData] = useState(formData);
  const [showScroll, setShowScroll] = useState(getShowScroll());

  const fetch = async (bool: boolean) => {
    setLoading(true);
    const params = {
      valuationDate: valuationDate.format('YYYY-MM-DD'),
      page: 0,
      pageSize: pagination.pageSize,
      subsidiaryPart: searchFormData.subsidiaryPart,
      order: ORDER_BY[sorter.order],
      orderBy: sorter.field,
    };
    if (bool) {
      params.page = pagination.current - 1;
    }
    const rsp = await rptSearchPagedSubsidiaryMarketRiskReport(params);
    setLoading(false);
    const { error, data = {} } = rsp;
    const { page, totalCount } = data;
    if (rsp.error) return;
    setTableData(page);
    setTotal(totalCount);
  };

  useEffect(() => {
    const handler = _.debounce(event => {
      if (getShowScroll()) {
        setShowScroll(true);
        return;
      }
      setShowScroll(false);
    }, 200);
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('resize', handler);
    };
  }, []);

  useEffect(() => {
    if (store.first) {
      fetch(false);
    }
  }, [sorter, searchFormData, valuationDate]);

  useEffect(() => {
    if (store.first) {
      fetch(true);
    }
  }, [pagination]);

  useEffect(() => {
    fetch(false);
    setStore({ first: true });
  }, []);

  const columns = [
    {
      title: '子公司名称',
      dataIndex: 'subsidiary',
      width: 100,
      onCell: () => ({ style: { color: 'rgba(222,230,240,1)' } }),
    },
    {
      title: 'Delta_Cash',
      dataIndex: 'deltaCash',
      width: 100,
      sortOrder: sorter.field === 'deltaCash' && sorter.order,
      sorter: true,
      render: value => formatNumber({ value, formatter: '0,0.00' }),
      align: 'right',
      onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    },
    {
      title: 'Gamma_Cash',
      dataIndex: 'gammaCash',
      width: 100,
      sortOrder: sorter.field === 'gammaCash' && sorter.order,
      sorter: true,
      render: value => formatNumber({ value, formatter: '0,0.00' }),
      align: 'right',
      onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    },
    {
      title: 'Vega',
      dataIndex: 'vega',
      width: 100,
      sortOrder: sorter.field === 'vega' && sorter.order,
      sorter: true,
      render: value => formatNumber({ value, formatter: '0,0.00' }),
      align: 'right',
      onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    },
    {
      title: 'Theta',
      dataIndex: 'theta',
      width: 100,
      sortOrder: sorter.field === 'theta' && sorter.order,
      sorter: true,
      render: value => formatNumber({ value, formatter: '0,0.00' }),
      align: 'right',
      onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    },
    {
      title: 'Rho',
      dataIndex: 'rho',
      width: 100,
      sortOrder: sorter.field === 'rho' && sorter.order,
      sorter: true,
      render: value => formatNumber({ value, formatter: '0,0.00' }),
      align: 'right',
      onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    },
  ];

  const createdAt = _.get(tableData, '[0].createdAt');
  const reportTime = createdAt ? moment(createdAt).format('YYYY-MM-DD HH:mm:ss') : '';
  const titleTxt = reportTime
    ? `各子公司风险报告（报告计算时间：${reportTime} ）`
    : '各子公司风险报告';

  return (
    <div>
      <Title>{titleTxt}</Title>
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
                value={formData.subsidiaryPart}
                onChange={event => {
                  setFormData({ ...formData, subsidiaryPart: _.get(event.target, 'value') });
                }}
                placeholder="请输入搜索子公司"
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
              searchMethod: rptSearchPagedSubsidiaryMarketRiskReport,
              argument: {
                searchFormData: {
                  valuationDate,
                  subsidiaryPart: searchFormData.subsidiaryPart,
                },
              },
              cols: columns,
              name: '各子公司风险报告',
              colSwitch: [],
              getSheetDataSourceItemMeta: (val, dataIndex, rowIndex) => {
                if (dataIndex !== 'subsidiaryPart' && rowIndex > 0) {
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
          scroll={showScroll ? { x: 1080 } : undefined}
          loading={loading}
          pagination={{
            ...pagination,
            total,
            simple: true,
          }}
          dataSource={tableData}
          onChange={(ppagination, filters, psorter) => {
            const bool = sorter.columnKey === psorter.columnKey && sorter.order === psorter.order;
            if (!bool) {
              setSorter(psorter);
            }
            if (!_.isEqual(pagination, ppagination)) {
              setPagination(ppagination);
            }
          }}
          columns={columns}
        />
        <UnitWrap>
          <Unit hookTopRight></Unit>
        </UnitWrap>
      </div>
    </div>
  );
  function getShowScroll() {
    const viewport = document.documentElement.clientWidth;
    return viewport < 1080;
  }
};

export default TableSubsidiaryWhole;
