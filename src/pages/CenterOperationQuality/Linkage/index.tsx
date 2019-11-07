import React, { memo, useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Market from './Market';
import Varieties from './Varieties';
import Counterparty from './Counterparty';

const Linkage = props => (
  <>
    <Varieties {...props} />
    <Counterparty {...props} />
    <Market {...props} />
  </>
);

export default Linkage;
