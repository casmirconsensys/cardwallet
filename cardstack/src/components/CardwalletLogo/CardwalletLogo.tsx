import React, { memo, useMemo } from 'react';

import { CenteredContainer, Icon, Text } from '@cardstack/components';
import {
  colorStyleVariants,
  ThemeVariant,
} from '@cardstack/theme/colorStyleVariants';

import { useDimensions } from '@rainbow-me/hooks';

type CardwalletLogoSizes = 'big' | 'medium';

interface Props {
  size?: CardwalletLogoSizes;
  variant?: ThemeVariant;
  proportionalSize?: boolean;
}

export const DEFAULT_CARDWALLET_ICON_SIZE = 100;

const strings = {
  title: 'CARD WALLET',
  subtitle: 'by Cardstack',
};

const sizes = {
  big: {
    iconSize: DEFAULT_CARDWALLET_ICON_SIZE,
    title: {
      fontSize: 24,
    },
    subtitle: {
      fontSize: 14,
    },
  },
  medium: {
    iconSize: 80,
    title: {
      fontSize: 20,
    },
    subtitle: {
      fontSize: 12,
    },
  },
};

export const CardwalletLogo = memo(
  ({ size, variant = 'dark', proportionalSize = false }: Props) => {
    const { isSmallPhone } = useDimensions();

    const propotionalLogoSize = useMemo(
      () => (isSmallPhone ? 'medium' : 'big'),
      [isSmallPhone]
    );

    const logoSize = proportionalSize || !size ? propotionalLogoSize : size;

    return (
      <CenteredContainer>
        <Icon name="cardstack" size={sizes[logoSize].iconSize} />
        <Text
          color={colorStyleVariants.textColor[variant]}
          marginTop={6}
          variant="welcomeScreen"
          {...sizes[logoSize].title}
        >
          {strings.title}
        </Text>
        <Text
          color={colorStyleVariants.textColor[variant]}
          weight="bold"
          {...sizes[logoSize].subtitle}
        >
          {strings.subtitle}
        </Text>
      </CenteredContainer>
    );
  }
);
