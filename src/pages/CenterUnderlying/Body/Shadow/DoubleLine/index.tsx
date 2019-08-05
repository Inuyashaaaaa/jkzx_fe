import { connect } from 'dva';
import React, { memo } from 'react';
import BottomChart from './BottomChart';
import TopChart from './TopChart';

const DoubleLine = props => (
  <>
    <TopChart></TopChart>
    <BottomChart></BottomChart>
  </>
);

export default memo(
  connect(state => ({
    instrumentId: state.centerUnderlying.instrumentId,
  }))(DoubleLine),
);
