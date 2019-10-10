import React, { memo, useState, useEffect } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import _ from 'lodash';
import ThemeStatistic from '@/containers/ThemeStatistic';
import Unit from './containers/Unit';
import { rptMarketRiskReportListByDate } from '@/services/report-service';

const BoxWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  width: ${770 + 22}px;
  height: 60px;
  border: 1px solid rgba(0, 232, 232, 0.5);
`;

const BoxInner = styled.div`
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: center;
  flex-grow: 1;
  height: 100%;
`;

const Box = styled.div``;

const BoxSplit = styled.div`
  width: 1px;
  height: 26px;
  background: rgba(0, 232, 232, 0.3);
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: rgba(246, 250, 255, 1);
  line-height: 32px;
`;

const BoxPanel = memo(props => {
  const { date, ...rest } = props;
  const [result, setResult] = useState({});

  const fechData = async () => {
    const data = await rptMarketRiskReportListByDate({
      valuationDate: date.format('YYYY-MM-DD'),
    });
    setResult(_.get(data, 'data[0]', {}));
  };

  useEffect(() => {
    fechData();
  }, [date]);

  const createdAt = _.get(result, 'createdAt');
  const reportTime = createdAt ? moment(createdAt).format('YYYY-MM-DD hh:mm:ss') : '';

  return (
    <>
      <Title>全市场整体风险报告（报告计算时间：{reportTime}）</Title>
      <BoxWrapper {...rest}>
        <BoxInner>
          <Box>
            <ThemeStatistic title="Delta_Cash" value={result.deltaCash} />
          </Box>
          <BoxSplit></BoxSplit>
          <Box>
            <ThemeStatistic title="Gamma_Cash" value={result.gammaCash} />
          </Box>
          <BoxSplit></BoxSplit>
          <Box>
            <ThemeStatistic title="Vega" value={result.vega} />
          </Box>
          <BoxSplit></BoxSplit>
          <Box>
            <ThemeStatistic title="Theta" value={result.theta} />
          </Box>
          <BoxSplit></BoxSplit>
          <Box>
            <ThemeStatistic title="Rho" value={result.rho} />
          </Box>
        </BoxInner>
        <Unit borderLeft></Unit>
      </BoxWrapper>
    </>
  );
});

export default BoxPanel;
