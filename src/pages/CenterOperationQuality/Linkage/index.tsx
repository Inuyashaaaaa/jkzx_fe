import React, { memo, useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Market from './Market';
import Varieties from './Varieties';
import Counterparty from './Counterparty';

const Linkage = () => (
  <>
    <Varieties />
    <Counterparty />
    <Market />
  </>
);

export default Linkage;
