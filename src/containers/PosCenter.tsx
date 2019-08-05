import styled from 'styled-components';

const PosCenter = styled.div<{ height: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: ${props => `${props.height}px`};
`;

export default PosCenter;
