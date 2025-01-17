import styled from 'styled-components';
import { TruncatedText } from '@rainbow-me/components/text';

const ChartHeaderSubtitle = styled(TruncatedText).attrs(
  ({
    theme: { colors },
    color = colors.alpha(colors.blueGreyDark, 0.8),
    letterSpacing = 'roundedMedium',
    weight = 'bold',
  }) => ({
    color,
    letterSpacing,
    size: 'larger',
    weight,
  })
)`
  flex: 1;
  ${android &&
  `margin-vertical: -10px
    margin-left: 9`}
`;

export default ChartHeaderSubtitle;
