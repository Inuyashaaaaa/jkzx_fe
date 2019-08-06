import React, { memo } from 'react';
import styled from 'styled-components';
import ThemeStatistic from '@/containers/ThemeStatistic';
import Unit from './containers/Unit';

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

const BoxPanel = memo(props => (
  <BoxWrapper {...props}>
    <BoxInner>
      <Box>
        <ThemeStatistic title="Delta_Cash" value={112893.22} />
      </Box>
      <BoxSplit></BoxSplit>
      <Box>
        <ThemeStatistic title="Gamma_Cash" value={112893} />
      </Box>
      <BoxSplit></BoxSplit>
      <Box>
        <ThemeStatistic title="Vega" value={112893} />
      </Box>
      <BoxSplit></BoxSplit>
      <Box>
        <ThemeStatistic title="Theta" value={112893} />
      </Box>
      <BoxSplit></BoxSplit>
      <Box>
        <ThemeStatistic title="Rho" value={11244.21} />
      </Box>
    </BoxInner>
    <Unit borderLeft></Unit>
  </BoxWrapper>
));

export default BoxPanel;
