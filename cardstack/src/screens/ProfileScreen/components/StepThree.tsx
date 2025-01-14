import React from 'react';
import { ActivityIndicator } from 'react-native';

import {
  Button,
  Container,
  MerchantSafe,
  ProgressStepProps,
  Text,
} from '@cardstack/components';

import { useProfileForm } from '../useProfileForm';

import { exampleMerchantData, strings } from '.';

export const StepThree = ({ isLoading }: ProgressStepProps) => {
  const { newMerchantInfo, onPressCreate } = useProfileForm();

  if (isLoading) {
    return <ActivityIndicator size="large" color="white" />;
  }

  return (
    <>
      <Container>
        <Text color="white" fontWeight="bold" fontSize={20} textAlign="center">
          {strings.stepThree.review}
        </Text>
        <Text
          color="grayText"
          marginTop={2}
          textAlign="center"
          paddingHorizontal={10}
        >
          {strings.stepThree.reviewDescription}
        </Text>
      </Container>
      <Container paddingTop={2}>
        <Text color="white" textAlign="left" paddingLeft={4} marginBottom={1}>
          {strings.stepThree.yourProfile}
        </Text>
        <MerchantSafe
          {...exampleMerchantData}
          address="" // No address here as didn't create profile yet, it's preview
          merchantInfo={newMerchantInfo}
          disabled
          headerRightText={strings.header.profile}
        />
      </Container>
      <Container alignItems="center">
        <Button onPress={onPressCreate}>{strings.buttons.create}</Button>
      </Container>
    </>
  );
};
