import React, { memo, useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import KnockdownStructure from './KnockdownStructure';
import PositionStructure from './PositionStructure';
import ToolStructure from './ToolStructure';
import CustomerTypeStructure from './CustomerTypeStructure';

const MarketStructure = props => (
  <>
    <KnockdownStructure {...props} />
    <PositionStructure {...props} />
    <ToolStructure {...props} />
    <CustomerTypeStructure {...props} />
  </>
);

export default MarketStructure;
