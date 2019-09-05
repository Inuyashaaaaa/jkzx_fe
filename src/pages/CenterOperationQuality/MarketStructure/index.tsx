import React, { memo, useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import KnockdownStructure from './KnockdownStructure';
import PositionStructure from './PositionStructure';
import ToolStructure from './ToolStructure';
import CustomerTypeStructure from './CustomerTypeStructure';

const MarketStructure = () => (
  <>
    <KnockdownStructure />
    <PositionStructure />
    <ToolStructure />
    <CustomerTypeStructure />
  </>
);

export default MarketStructure;
