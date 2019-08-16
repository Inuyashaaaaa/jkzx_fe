import { connect } from 'dva';
import React, { memo } from 'react';
import VRChart from './VRchart';
import Shadow from './Shadow';
import VolSurface from './VolSurface';
import ImpliedVolatility from './ImpliedVolatility';

const Body = props => {
  const { activeKey } = props;
  return (
    <div>
      {activeKey === '0' && <VRChart></VRChart>}
      {activeKey === '1' && <Shadow></Shadow>}
      {activeKey === '2' && <VolSurface></VolSurface>}
      {activeKey === '3' && <ImpliedVolatility></ImpliedVolatility>}
    </div>
  );
};

export default memo(
  connect(state => ({
    activeKey: state.centerUnderlying.activeKey,
  }))(Body),
);
