import styled from 'styled-components';
import React, { memo } from 'react';
import classnames from 'classnames';
import { Statistic } from 'antd';

const ThemeStatisticWrap = styled.div`
  .ant-statistic-title {
    font-size: 12px;
    font-weight: 400;
    color: rgba(245, 250, 255, 0.8);
  }
  .ant-statistic-content {
    line-height: 1;
    font-size: 18px;
  }
  .ant-statistic-title {
    margin-bottom: 2px;
  }
  .ant-statistic-content-value-int {
    font-size: 18px;
    font-weight: bold;
    color: rgba(255, 120, 42, 1);
  }
  .ant-statistic-content-value-decimal {
    font-size: 14px;
    color: rgba(255, 120, 42, 1);
  }
`;

const ThemeStatistic = memo(props => (
  <ThemeStatisticWrap>
    <Statistic {...props}></Statistic>
  </ThemeStatisticWrap>
));

export default ThemeStatistic;
