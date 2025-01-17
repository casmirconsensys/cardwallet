import PropTypes from 'prop-types';
import { View, ViewProps } from 'react-native';
import styled from 'styled-components';
import { buildFlexStyles } from '@rainbow-me/styles';

const flexPropTypes = {
  align: PropTypes.oneOf(['baseline', 'center', 'end', 'start', 'stretch']),
  direction: PropTypes.oneOf([
    'column',
    'column-reverse',
    'row',
    'row-reverse',
  ]),
  flex: PropTypes.number,
  grow: PropTypes.number,
  justify: PropTypes.oneOf([
    'center',
    'end',
    'space-around',
    'space-between',
    'start',
  ]),
  self: PropTypes.oneOf(['center', 'end', 'start', 'stretch']),
  shrink: PropTypes.number,
  wrap: PropTypes.bool,
};

interface FlexProps extends ViewProps {
  align?: 'baseline' | 'center' | 'end' | 'start' | 'stretch' | null;
  direction?: 'column' | 'column-reverse' | 'row' | 'row-reverse' | null;
  flex?: number | null;
  grow?: number | null;
  justify?:
    | 'center'
    | 'end'
    | 'space-around'
    | 'space-between'
    | 'start'
    | null;
  self?: 'center' | 'end' | 'start' | 'stretch' | null;
  shrink?: number | null;
  wrap?: boolean | null;
}

const Flex = styled(View).withConfig({
  // We need to prevent the buildFlexStyles-related props from being
  // passed to the root element because our namespace collides with some native props
  shouldForwardProp: (prop, defaultValidatorFn) =>
    !Object.keys(flexPropTypes).includes(prop) && defaultValidatorFn(prop),
})<FlexProps>`
  ${buildFlexStyles};
`;

Flex.displayName = 'Flex';

Flex.propTypes = flexPropTypes as any;

export default Flex;
