import React, { memo } from 'react';
import { ActivityIndicator } from 'react-native';
import { useChoosePrepaidCard } from './useChoosePrepaidCard';
import {
  CenteredContainer,
  ChoosePrepaidCard,
  SafeAreaView,
} from '@cardstack/components';

const ChoosePrepaidCardSheet = () => {
  const {
    isLoading,
    prepaidCards,
    spendAmount,
    selectedPrepaidCard,
    onSelectPrepaidCard,
    onConfirmSelectedCard,
  } = useChoosePrepaidCard();

  return (
    <SafeAreaView flex={1} width="100%" backgroundColor="black">
      {isLoading ? (
        <CenteredContainer flex={1}>
          <ActivityIndicator size="large" />
        </CenteredContainer>
      ) : (
        <ChoosePrepaidCard
          selectedCard={selectedPrepaidCard}
          onConfirmSelectedCard={onConfirmSelectedCard}
          prepaidCards={prepaidCards}
          onSelectPrepaidCard={onSelectPrepaidCard}
          spendAmount={spendAmount}
        />
      )}
    </SafeAreaView>
  );
};

export default memo(ChoosePrepaidCardSheet);