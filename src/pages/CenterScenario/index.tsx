import React, { memo } from 'react';
import Header from './Header';
import Contents from './Contents';

const CenterScenario = memo(props => (
  <div>
    <div style={{ marginBottom: 21 }}>
      <Header></Header>
    </div>
    <Contents></Contents>
  </div>
));

export default CenterScenario;
