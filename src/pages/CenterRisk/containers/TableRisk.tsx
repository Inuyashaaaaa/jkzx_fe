import { Col, Row, Statistic, Input } from 'antd';
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import ThemeButton from '@/containers/ThemeButton';
import ThemeTable from '@/containers/ThemeTable';
import ThemeInput from '@/containers/ThemeInput';
import DownloadExcelButton from '@/containers/DownloadExcelButton';
import Unit from './Unit';

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

const UnitWrap = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  transform: translateX(100%);
  height: 60px;
`;

const TableRisk = (props: any) => {
  const {
    title,
    style,
    riskButton,
    dataValue,
    riskColumns,
    tableParams,
    method,
    searchParams,
    valuationDate,
    scroll,
  } = props;
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
    bookNamePart: '',
    instrumentIdPart: '',
  };
  const { query } = props;
  if (_.get(query, 'instrumentIdPart')) {
    initFormData = {
      ...initFormData,
      instrumentIdPart: query.instrumentIdPart,
    };
  }

  if (_.get(query, 'bookNamePart')) {
    initFormData = {
      ...initFormData,
      bookNamePart: query.bookNamePart,
    };
  }

  if (_.get(query, 'partyNamePart')) {
    initFormData = {
      ...initFormData,
      partyNamePart: query.partyNamePart,
    };
  }
  const [formData, setFormData] = useState(initFormData);
  const [searchFormData, setSearchFormData] = useState(formData);
  const [showScroll, setShowScroll] = useState(getShowScroll());

  const fetch = async (bool: boolean) => {
    setLoading(true);
    const params = tableParams(valuationDate, pagination, searchFormData, ORDER_BY, sorter);
    if (bool) {
      params.page = pagination.current - 1;
    }
    const rsp = await method(params);
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

  const columns = riskColumns(sorter);
  return (
    <div style={style}>
      <Title>{title}</Title>
      <Row
        type="flex"
        justify="space-between"
        align="middle"
        gutter={12}
        style={{ marginTop: 18, marginBottom: 13 }}
      >
        <Col>
          <Row type="flex" justify="start" align="middle" gutter={12}>
            {riskButton.bookNamePart ? (
              <Col>
                <ThemeInput
                  value={formData.bookNamePart}
                  onChange={event => {
                    setFormData({ ...formData, bookNamePart: _.get(event.target, 'value') });
                  }}
                  placeholder="请输入搜索子公司"
                ></ThemeInput>
              </Col>
            ) : (
              ''
            )}
            {riskButton.partyNamePart ? (
              <Col>
                <ThemeInput
                  value={formData.partyNamePart}
                  onChange={event => {
                    setFormData({ ...formData, partyNamePart: _.get(event.target, 'value') });
                  }}
                  placeholder="请输入搜索交易对手"
                ></ThemeInput>
              </Col>
            ) : (
              ''
            )}
            {riskButton.instrumentIdPart ? (
              <Col>
                <ThemeInput
                  value={formData.instrumentIdPart}
                  onChange={event => {
                    setFormData({ ...formData, instrumentIdPart: _.get(event.target, 'value') });
                  }}
                  placeholder="请输入搜索标的物"
                ></ThemeInput>
              </Col>
            ) : (
              ''
            )}
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
              searchMethod: method,
              argument: {
                searchFormData: searchParams(valuationDate, searchFormData),
              },
              cols: columns,
              name: '风险报告',
              colSwitch: [],
              getSheetDataSourceItemMeta: (val, dataIndex, rowIndex) => {
                if (dataIndex !== dataValue && rowIndex > 0) {
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
          scroll={showScroll ? scroll : undefined}
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
    return viewport < scroll.x;
  }
};

export default TableRisk;
