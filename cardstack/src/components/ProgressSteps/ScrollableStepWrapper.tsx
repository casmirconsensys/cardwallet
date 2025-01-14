import React from 'react';
import { KeyboardAvoidingView, StyleSheet } from 'react-native';

import { ScrollView, ScrollViewProps } from '@cardstack/components';
import { Device, screenHeight } from '@cardstack/utils';

import { useDimensions } from '@rainbow-me/hooks';

const styles = StyleSheet.create({
  keyboardAvoidView: {
    flex: 1,
    flexGrow: 1,
  },
  smallScreenScrollViewContentStyle: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  bigScreenScrollViewContentStyle: {
    paddingTop: 30,
    paddingBottom: 45,
  },
});

// ToDo: need to define header height as a global const or hook to be consistent all over the places inside project
const HeaderHeight = screenHeight * 0.07;
const TabBarHeightSize = screenHeight * 0.1;
const KeyboardOffset = TabBarHeightSize + HeaderHeight;

interface ScrollableStepWrapperProps extends ScrollViewProps {
  keyboardEnabled?: boolean;
}

export const ScrollableStepWrapper = ({
  children: childElements,
  keyboardEnabled,
}: ScrollableStepWrapperProps) => {
  const { isSmallPhone } = useDimensions();

  return (
    <KeyboardAvoidingView
      behavior={Device.keyboardBehavior}
      style={styles.keyboardAvoidView}
      keyboardVerticalOffset={KeyboardOffset}
      enabled={keyboardEnabled}
    >
      <ScrollView
        contentContainerStyle={[
          styles.smallScreenScrollViewContentStyle,
          !isSmallPhone && styles.bigScreenScrollViewContentStyle,
        ]}
      >
        {childElements}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
