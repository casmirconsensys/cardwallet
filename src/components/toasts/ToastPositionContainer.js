import styled from 'styled-components';
import { Column } from '../layout';

export const ToastPositionContainerHeight = 40;

const ToastPositionContainer = styled(Column).attrs({
  pointerEvents: 'none',
  bottom: 0,
})`
  bottom: ${({ bottom = 0 }) => bottom - ToastPositionContainerHeight};
  height: ${ToastPositionContainerHeight};
  left: 0;
  position: absolute;
  right: 0;
  width: 100%;
  z-index: 9;
`;

export default ToastPositionContainer;
