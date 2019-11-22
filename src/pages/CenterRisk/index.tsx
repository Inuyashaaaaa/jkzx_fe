import { Col, Row } from 'antd';
import React, { memo, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { connect } from 'dva';
import moment from 'moment';
import ThemeDatePicker from '@/containers/ThemeDatePicker';
import BoxPanel from './BoxPanel';
import TableSubsidiaryWhole from './TableSubsidiaryWhole';
import ThemeTabs from '@/containers/ThemeTabs';
import {
  rptSearchPagedMarketRiskBySubUnderlyerReport,
  rptSearchPagedCounterPartyMarketRiskReport,
  rptSearchPagedMarketRiskDetailReport,
  rptSearchPagedCounterPartyMarketRiskByUnderlyerReport,
} from '@/services/report-service';
import { riskSubsidiaryVarieties } from './riskSubsidiaryVarieties';
import { TableTradeRival } from './TableTradeRival';
import { TableTradeRivalVarieties } from './TableTradeRivalVarieties';
import { TableWholeBreed } from './TableWholeBreed';
import TableRisk from './containers/TableRisk';
import { refTradeDateByOffsetGet } from '@/services/volatility';

const { TabPane } = ThemeTabs;

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

const Risk = props => {
  const { date, dispatch } = props;
  let initFormData = {
    valuationDate: date,
    instrumentIdPart: '',
  };
  const { query } = props.location || {};
  const defaultActiveKey = query.activeKey || '1';

  const [formData, setFormData] = useState(initFormData);

  const getDate = async () => {
    if (query.valuationDate) {
      initFormData = {
        ...initFormData,
        valuationDate: moment(query.valuationDate),
      };
      setFormData(initFormData);
      dispatch({
        type: 'centerDate/save',
        payload: {
          date: moment(query.valuationDate),
        },
      });
    }
  };

  useEffect(() => {
    getDate();
  }, []);

  useEffect(() => {
    setFormData({
      ...formData,
      valuationDate: props.date,
    });
  }, [props.date]);

  return (
    <>
      <Row type="flex" justify="start" gutter={14} style={{ marginBottom: 30 }}>
        <Col>
          <BigTitle>主体估值监测</BigTitle>
        </Col>
        <Col>
          <ThemeDatePicker
            onChange={pDate => {
              setFormData({ ...formData, valuationDate: pDate });
              dispatch({
                type: 'centerDate/save',
                payload: {
                  date: pDate,
                },
              });
            }}
            value={formData.valuationDate}
            allowClear={false}
            placeholder="请选择观察日"
            disabledDate={current => current && current > moment()}
          ></ThemeDatePicker>
        </Col>
      </Row>

      <ThemeTabs defaultActiveKey={defaultActiveKey} type="card" animated={false}>
        <TabPane tab="全市场估值监测" key="1">
          <BoxPanel
            date={formData.valuationDate}
            style={{ marginBottom: 18, marginTop: 18 }}
          ></BoxPanel>
          <TableRisk
            title="全市场分品种风险报告"
            scroll={{ x: 1185 }}
            riskButton={{
              instrumentIdPart: true,
            }}
            dataValue="underlyerInstrumentId"
            riskColumns={TableWholeBreed.columns}
            tableParams={TableWholeBreed.params}
            searchParams={TableWholeBreed.searchParams}
            method={rptSearchPagedMarketRiskDetailReport}
            valuationDate={formData.valuationDate}
            query={query}
          />
        </TabPane>
        <TabPane tab="各子公司估值监测" key="2">
          <TableSubsidiaryWhole
            valuationDate={formData.valuationDate}
            activeKey="2"
            query={query}
          />
          <TableRisk
            title="各子公司分品种风险报告"
            style={{ marginTop: 18 }}
            scroll={{ x: 1630 }}
            riskButton={{
              bookNamePart: true,
              instrumentIdPart: true,
              partyNamePart: false,
            }}
            dataValue="bookNamePart"
            riskColumns={riskSubsidiaryVarieties.columns}
            tableParams={riskSubsidiaryVarieties.params}
            searchParams={riskSubsidiaryVarieties.searchParams}
            method={rptSearchPagedMarketRiskBySubUnderlyerReport}
            valuationDate={formData.valuationDate}
            query={query}
            activeKey="2"
          />
        </TabPane>
        <TabPane tab="交易对手估值监测 " key="3">
          <TableRisk
            title="交易对手风险报告"
            // style={{ maxWidth: 1080 }}
            scroll={{ x: 1150 }}
            riskButton={{
              partyNamePart: true,
            }}
            dataValue="partyNamePart"
            riskColumns={TableTradeRival.columns}
            tableParams={TableTradeRival.params}
            searchParams={TableTradeRival.searchParams}
            method={rptSearchPagedCounterPartyMarketRiskReport}
            valuationDate={formData.valuationDate}
            query={query}
            activeKey="3"
          />
          <TableRisk
            title="交易对手分品种风险报告"
            style={{ marginTop: 18 }}
            scroll={{ x: 1630 }}
            riskButton={{
              partyNamePart: true,
              instrumentIdPart: true,
            }}
            dataValue="partyNamePart"
            riskColumns={TableTradeRivalVarieties.columns}
            tableParams={TableTradeRivalVarieties.params}
            searchParams={TableTradeRivalVarieties.searchParams}
            method={rptSearchPagedCounterPartyMarketRiskByUnderlyerReport}
            valuationDate={formData.valuationDate}
            query={query}
            activeKey="3"
          />
        </TabPane>
      </ThemeTabs>
    </>
  );
};

export default memo(
  connect(state => ({
    date: state.centerDate.date,
  }))(Risk),
);
