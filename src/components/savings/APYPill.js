import React from 'react';
import { StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { lightModeThemeColors } from '../../styles/colors';
import { Centered } from '../layout';

import { GradientText, Text } from '../text';
import { position } from '@rainbow-me/styles';

const sx = StyleSheet.create({
  container: {
    height: 30,
    paddingBottom: 1,
    paddingHorizontal: 10,
  },
  containerSmall: {
    height: 21,
    paddingHorizontal: 6,
    transform: [{ translateX: -6 }],
  },
  gradient: {
    ...position.coverAsObject,
    overflow: 'hidden',
  },
});

const gradientColors = ['#2CCC00', '#FEBE44'];
const gradientProps = {
  pointerEvents: 'none',
  style: sx.gradient,
};

const linearGradientProps = {
  ...gradientProps,
  end: { x: 1, y: 1 },
  start: { x: 0, y: 0 },
};

const textProps = {
  end: { x: 1, y: 1 },
  start: { x: 0, y: 0 },
  steps: [0, 1],
};

if (android) {
  textProps.color = lightModeThemeColors.green;
}

const TextComponent = ios ? GradientText : Text;

function APYPill({ small, value }) {
  return (
    <Centered style={small ? sx.containerSmall : sx.container}>
      <LinearGradient
        {...linearGradientProps}
        borderRadius={17}
        colors={gradientColors}
        opacity={0.1}
      />
      <TextComponent
        {...textProps}
        align="center"
        angle={false}
        letterSpacing="roundedTight"
        size={small ? 'smedium' : 'lmedium'}
        weight="semibold"
      >
        {value}% APY
      </TextComponent>
    </Centered>
  );
}

export default React.memo(APYPill);
