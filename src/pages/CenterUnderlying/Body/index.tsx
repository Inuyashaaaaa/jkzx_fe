import { connect } from 'dva';
import React, { memo } from 'react';
import VRChart from './VRchart';
import Shadow from './Shadow';

const Body = props => {
  const { activeKey } = props;
  return (
    <div>
      {activeKey === '0' && <VRChart></VRChart>}
      {activeKey === '1' && <Shadow></Shadow>}
    </div>
  );
};

export default memo(
  connect(state => ({
    activeKey: state.centerUnderlying.activeKey,
  }))(Body),
);
