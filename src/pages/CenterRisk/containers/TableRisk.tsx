import { Col, Row, Statistic, Input } from 'antd';
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import moment from 'moment';
import ThemeButton from '@/containers/ThemeButton';
import ThemeTable from '@/containers/ThemeTable';
import ThemeInput from '@/containers/ThemeInput';
import DownloadExcelButton from '@/containers/DownloadExcelButton';
import Unit from './Unit';
import ThemeSelect from '@/containers/ThemeSelect';
import { mktInstrumentSearch } from '@/services/market-data-service';
import {
  rptReportInstrumentListByValuationDate,
  rptReportCounterPartyListByValuationDate,
  rptReportSubsidiaryListByValuationDate,
} from '@/services/tradeBooks';
import { refSimilarLegalNameListWithoutBook } from '@/services/reference-data-service';

const Title = styled.div`
  font-size: 18px;
  font-weight: 400;
  color: rgba(246, 250, 255, 1);
  line-height: 32px;
  margin-top: 20px;
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
  if (_.get(query, 'activeKey') === props.activeKey) {
    initFormData = {
      ...initFormData,
      bookNamePart: query.bookName,
      instrumentIdPart: query.instrumentId,
    };
  }
  if (_.get(query, 'activeKey') === props.activeKey) {
    initFormData = {
      ...initFormData,
      partyNamePart: query.partyName,
      instrumentIdPart: query.instrumentId,
    };
  }

  const [formData, setFormData] = useState(initFormData);
  const [searchFormData, setSearchFormData] = useState(formData);
  const [showScroll, setShowScroll] = useState(getShowScroll());

  const fetch = async (bool: boolean) => {
    if (!valuationDate) {
      return;
    }
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
  }, [sorter, searchFormData]);

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
  const createdAt = _.get(tableData, '[0].createdAt');
  const reportTime = createdAt ? moment(createdAt).format('YYYY-MM-DD HH:mm:ss') : '';

  const titleTxt = title + (reportTime ? `（报告计算时间：${reportTime} ）` : '');

  const [instrumentList, setInstrumentList] = useState([]);
  const [subsidiaryList, setSubsidiaryList] = useState([]);
  const [counterPartyList, setCounterPartyList] = useState([]);

  const getSelectList = async () => {
    setFormData(initFormData);
    setSearchFormData(initFormData);
    if (riskButton.instrumentIdPart) {
      const instrumentListRes = await rptReportInstrumentListByValuationDate({
        reportType: props.reportType,
        valuationDate: moment(props.valuationDate).format('YYYY-MM-DD'),
      });
      if (instrumentListRes.error) {
        setInstrumentList([]);
      } else {
        setInstrumentList(
          instrumentListRes.data.map(item => ({
            label: item,
            value: item,
          })),
        );
      }
    }

    if (riskButton.bookNamePart) {
      const subsidiaryListRes = await rptReportSubsidiaryListByValuationDate({
        reportType: props.reportType,
        valuationDate: moment(props.valuationDate).format('YYYY-MM-DD'),
      });
      if (subsidiaryListRes.error) {
        setSubsidiaryList([]);
      } else {
        setSubsidiaryList(
          subsidiaryListRes.data.map(item => ({
            label: item,
            value: item,
          })),
        );
      }
    }

    if (riskButton.partyNamePart) {
      const counterPartyListRes = await rptReportCounterPartyListByValuationDate({
        reportType: props.reportType,
        valuationDate: moment(props.valuationDate).format('YYYY-MM-DD'),
      });
      if (counterPartyListRes.error) {
        setCounterPartyList([]);
      } else {
        setCounterPartyList(
          counterPartyListRes.data.map(item => ({
            label: item,
            value: item,
          })),
        );
      }
    }
  };

  useEffect(() => {
    if (props.valuationDate) {
      getSelectList();
    }
  }, [props.valuationDate]);

  return (
    <div style={style}>
      <Title>{`${titleTxt}`}</Title>
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
                <ThemeSelect
                  filterOption={(val, option) => _.get(option, 'props.children').indexOf(val) >= 0}
                  showSearch
                  style={{ minWidth: 200 }}
                  value={formData.bookNamePart !== '' ? formData.bookNamePart : undefined}
                  onChange={event => {
                    setFormData({ ...formData, bookNamePart: event });
                  }}
                  allowClear
                  placeholder="请输入搜索子公司"
                  options={subsidiaryList}
                ></ThemeSelect>
              </Col>
            ) : (
              ''
            )}
            {riskButton.partyNamePart ? (
              <Col>
                <ThemeSelect
                  filterOption={(val, option) => _.get(option, 'props.children').indexOf(val) >= 0}
                  allowClear
                  placeholder="请输入搜索交易对手"
                  showSearch
                  style={{ minWidth: 200 }}
                  value={formData.partyNamePart !== '' ? formData.partyNamePart : undefined}
                  onChange={event => {
                    setFormData({ ...formData, partyNamePart: event });
                  }}
                  options={counterPartyList}
                ></ThemeSelect>
              </Col>
            ) : (
              ''
            )}
            {riskButton.instrumentIdPart ? (
              <Col>
                <ThemeSelect
                  onChange={event => {
                    setFormData({ ...formData, instrumentIdPart: event });
                  }}
                  value={formData.instrumentIdPart !== '' ? formData.instrumentIdPart : undefined}
                  allowClear
                  placeholder="请输入搜索标的物"
                  style={{ minWidth: 200 }}
                  filterOption={(val, option) => _.get(option, 'props.children').indexOf(val) >= 0}
                  showSearch
                  options={instrumentList}
                ></ThemeSelect>
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
              name: title,
              colSwitch: [],
              getSheetDataSourceItemMeta: (val, dataIndex, rowIndex) => {
                if (_.indexOf(['gamma', 'delta'], dataIndex) > -1) {
                  return {
                    t: 'n',
                    z: Math.abs(val) >= 1000 ? '0,0.00' : '0.00',
                  };
                }
                if (dataIndex !== dataValue && rowIndex > 0) {
                  return {
                    t: 'n',
                    z: Math.abs(val) >= 1000 ? '0,0' : '0',
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
          scroll={props.scroll}
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
          bordered
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
