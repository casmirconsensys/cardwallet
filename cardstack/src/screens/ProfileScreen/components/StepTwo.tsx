import React, { useRef, useCallback, useMemo } from 'react';
import { TextInput } from 'react-native';

import {
  Button,
  CardPressable,
  Container,
  ContainerProps,
  IconName,
  Input,
  ProgressStepProps,
  Text,
} from '@cardstack/components';
import { ColorTypes, colors } from '@cardstack/theme';
import { getValidColorHexString } from '@cardstack/utils';

import { ContactAvatar } from '@rainbow-me/components/contacts';

import { useProfileForm } from '../useProfileForm';

import { strings } from '.';

const UniqueCheckValidIconProps = {
  name: 'check' as IconName,
  color: 'greenColor' as ColorTypes,
  margin: 0,
  top: 14,
};

const UniqueCheckInvalidIconProps = {
  name: 'x' as IconName,
  color: 'error' as ColorTypes,
  margin: 0,
  top: 14,
};

const InputCommonProps = {
  borderRadius: 6,
  paddingVertical: 3,
  paddingHorizontal: 5,
  fontSize: 16,
  borderWidth: 1,
  fontWeight: 'bold' as any,
  color: 'grayCardBackground' as ColorTypes,
  spellCheck: false,
  autoCorrect: false,
  blurOnSubmit: false,
};

const TextErrorProps = {
  color: 'errorLight' as ColorTypes,
  fontSize: 11,
  fontWeight: '600' as any,
  letterSpacing: 0.15,
  marginTop: 1,
};

interface InputLabelProps extends ContainerProps {
  label: string;
  required?: boolean;
}

export const InputLabel = ({
  label,
  required = false,
  ...props
}: InputLabelProps) => {
  return (
    <Container
      justifyContent="space-between"
      flexDirection="row"
      marginTop={4}
      marginBottom={1}
      {...props}
    >
      <Text color="white" fontSize={13} fontWeight="600">
        {required ? `${label}*` : label}
      </Text>
      {required && (
        <Text color="white" size="xs">
          {strings.stepTwo.required}
        </Text>
      )}
    </Container>
  );
};

export const StepTwo = ({ goToNextStep }: ProgressStepProps) => {
  const {
    businessName,
    businessColor,
    businessId,
    isUniqueId,
    avatarName,
    errors,
    onPressBusinessColor,
    onChangeBusinessName,
    onChangeBusinessId,
    onSubmitForm,
  } = useProfileForm({ onFormSubmitSuccess: goToNextStep });

  const businessIdRef = useRef<TextInput>(null);

  const onBusinessNameSubmitEditing = useCallback(
    () => businessIdRef?.current?.focus && businessIdRef.current.focus(),
    []
  );

  const businessIdIconProps = useMemo(
    () =>
      isUniqueId
        ? UniqueCheckValidIconProps
        : errors?.businessId === strings.validation.businessIdShouldBeUnique
        ? UniqueCheckInvalidIconProps
        : undefined,
    [isUniqueId, errors]
  );

  const validBusinessColor = getValidColorHexString(businessColor);

  const businessColorStyle = useMemo(
    () => ({ backgroundColor: validBusinessColor }),
    [validBusinessColor]
  );

  const hadError = useMemo(
    () => Boolean(errors && (errors?.businessName || errors?.businessId)),
    [errors]
  );

  return (
    <>
      <Container justifyContent="center" alignItems="center">
        <ContactAvatar
          color={validBusinessColor}
          size="large"
          value={avatarName}
          textColor={colors.white}
        />
      </Container>
      <Container paddingTop={2}>
        <Text color="white" fontWeight="bold" fontSize={20} textAlign="center">
          {strings.stepTwo.nameAndIdForProfile}
        </Text>
      </Container>
      <Container paddingHorizontal={5} marginTop={4}>
        <InputLabel label={strings.stepTwo.iconColor} marginTop={0} />
        <CardPressable onPress={onPressBusinessColor} position="relative">
          <Text paddingLeft={10} {...InputCommonProps}>
            {businessColor}
          </Text>
          <Container
            width={30}
            height={30}
            borderRadius={4}
            backgroundColor="white"
            borderWidth={1}
            borderColor="buttonSecondaryBorder"
            justifyContent="center"
            alignItems="center"
            position="absolute"
            left={4}
            top={8}
          >
            <Container width={20} height={20} style={businessColorStyle} />
          </Container>
        </CardPressable>
        <InputLabel label={strings.stepTwo.businessName} required />
        <Input
          textContentType="name"
          borderColor={errors?.businessName ? 'error' : 'buttonSecondaryBorder'}
          value={businessName}
          onChange={onChangeBusinessName}
          onSubmitEditing={onBusinessNameSubmitEditing}
          returnKeyType="next"
          {...InputCommonProps}
        />
        {errors?.businessName ? (
          <Text {...TextErrorProps}>{errors.businessName}</Text>
        ) : null}
        <InputLabel label={strings.stepTwo.uniqueId} required />
        <Input
          autoCapitalize="none"
          textContentType="username"
          borderColor={errors?.businessId ? 'error' : 'buttonSecondaryBorder'}
          value={businessId}
          onChange={onChangeBusinessId}
          onSubmitEditing={onSubmitForm}
          iconProps={businessIdIconProps}
          ref={businessIdRef}
          returnKeyType="done"
          {...InputCommonProps}
        />
        {errors?.businessId ? (
          <Text {...TextErrorProps}>{errors.businessId}</Text>
        ) : (
          <>
            {isUniqueId && (
              <Text
                size="xxs"
                color="lightGreen"
                textAlign="left"
                marginTop={1}
              >
                {strings.stepTwo.businessIdAvailable}
              </Text>
            )}
            <Text size="xxs" color="grayText" textAlign="left" marginTop={1}>
              {strings.stepTwo.uniqueIdDescription}
            </Text>
          </>
        )}
      </Container>
      <Container alignItems="center" paddingTop={4}>
        <Button onPress={onSubmitForm} disabled={hadError}>
          {hadError
            ? strings.buttons.completeToContinue
            : strings.buttons.continue}
        </Button>
      </Container>
    </>
  );
};
