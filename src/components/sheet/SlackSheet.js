// FIXME unify with iOS
import React, { Fragment, useEffect, useMemo, useRef } from 'react';
import {
  KeyboardAvoidingView,
  Pressable,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeArea } from 'react-native-safe-area-context';
import styled from 'styled-components';
import { useReanimatedValue } from '../list/MarqueeList';
import SheetHandleFixedToTop, {
  SheetHandleFixedToTopHeight,
} from './SheetHandleFixedToTop';
import { Container } from '@cardstack/components';
import { useDimensions } from '@rainbow-me/hooks';
import { useNavigation } from '@rainbow-me/navigation';
import { position } from '@rainbow-me/styles';

const { event } = Animated;

const AndroidBackground = styled.View`
  ${position.cover};
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

const Content = styled(Animated.ScrollView).attrs(({ y }) => ({
  directionalLockEnabled: true,
  keyboardShouldPersistTaps: 'always',
  onScroll: event([
    {
      nativeEvent: {
        contentOffset: {
          y,
        },
      },
    },
  ]),
  scrollEventThrottle: 16,
}))`
  background-color: ${({ backgroundColor }) => backgroundColor};
  ${({ contentHeight, deviceHeight }) =>
    contentHeight ? `height: ${deviceHeight + contentHeight}` : null};
  padding-top: ${SheetHandleFixedToTopHeight};
  width: 100%;
  display: flex;
  flex-grow: 1;
`;

const Whitespace = styled.View`
  background-color: ${({ backgroundColor }) => backgroundColor};
  flex: 1;
  height: ${({ deviceHeight }) => deviceHeight};
  z-index: -1;
`;

export default function SlackSheet({
  additionalTopPadding = false,
  backgroundColor = undefined,
  borderRadius = 30,
  contentHeight = undefined,
  deferredHeight = false,
  hideHandle = false,
  renderHeader = () => {},
  renderFooter = () => {},
  scrollEnabled = true,
  discoverSheet = undefined,
  hasKeyboard = false,
  ...props
}) {
  const yPosition = useReanimatedValue(0);
  const { height: deviceHeight } = useDimensions();
  const { goBack } = useNavigation();
  const insets = useSafeArea();
  const bottomInset = useMemo(
    () => (insets.bottom || scrollEnabled ? 42 : 30),
    [insets.bottom, scrollEnabled]
  );
  const contentContainerStyle = useMemo(
    () => ({
      paddingBottom: bottomInset,
    }),
    [bottomInset]
  );

  const sheet = useRef();

  const scrollIndicatorInsets = useMemo(
    () => ({
      bottom: bottomInset,
      top: borderRadius + SheetHandleFixedToTopHeight,
    }),
    [borderRadius, bottomInset]
  );

  // In discover sheet we need to set it additionally
  useEffect(
    () => {
      discoverSheet &&
        ios &&
        sheet.current.setNativeProps({ scrollIndicatorInsets });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const bg = backgroundColor || 'white';
  const KeyboardContainer = hasKeyboard
    ? props => (
        <KeyboardAvoidingView
          {...(ios ? { behavior: 'padding' } : {})}
          keyboardVerticalOffset={30}
          {...props}
        />
      )
    : props => <Container backgroundColor={bg} flex={1} {...props} />;

  const oldTopCondition =
    deferredHeight || ios
      ? 0
      : contentHeight && additionalTopPadding
      ? deviceHeight - contentHeight
      : 0;

  return (
    <Fragment>
      {android ? (
        <Pressable onPress={goBack} style={[StyleSheet.absoluteFillObject]} />
      ) : null}
      <Container
        backgroundColor={bg}
        borderTopLeftRadius={30}
        borderTopRightRadius={30}
        bottom={0}
        left={0}
        overflow="hidden"
        position="absolute"
        right={0}
        // Temp workaround until migration os SlackSheet to Sheet
        top={android ? StatusBar.currentHeight : oldTopCondition}
        {...props}
      >
        {android && (
          <AndroidBackground as={TouchableWithoutFeedback} backgroundColor={bg}>
            <AndroidBackground backgroundColor={bg} />
          </AndroidBackground>
        )}
        {!hideHandle && <SheetHandleFixedToTop showBlur={scrollEnabled} />}
        <KeyboardContainer>
          {renderHeader?.(yPosition)}
          <Content
            backgroundColor={bg}
            contentContainerStyle={scrollEnabled && contentContainerStyle}
            contentHeight={contentHeight}
            deviceHeight={deviceHeight}
            directionalLockEnabled
            ref={sheet}
            scrollEnabled={scrollEnabled}
            scrollIndicatorInsets={scrollIndicatorInsets}
            y={yPosition}
          >
            {props.children}
            {!scrollEnabled && (
              <Whitespace backgroundColor={bg} deviceHeight={deviceHeight} />
            )}
          </Content>
          {renderFooter ? renderFooter() : null}
        </KeyboardContainer>
      </Container>
    </Fragment>
  );
}
