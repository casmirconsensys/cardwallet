import React, { memo } from 'react';
import { StatusBar } from 'react-native';
import { NavBarHeader } from './components/NavBarHeader';
import { useMerchantScreen } from './useMerchantScreen';
import { Container, MerchantContent } from '@cardstack/components';

const MerchantScreen = () => {
  const {
    isRefreshingBalances,
    merchantSafe,
    safesCount,
    isPrimarySafe,
    changeToPrimarySafe,
  } = useMerchantScreen();

  return (
    <Container top={0} width="100%" backgroundColor="white">
      <StatusBar barStyle="light-content" />
      <NavBarHeader
        address={merchantSafe.address}
        name={merchantSafe.merchantInfo?.name}
      />
      <MerchantContent
        showSafePrimarySelection={safesCount > 1}
        isPrimarySafe={isPrimarySafe}
        changeToPrimarySafe={changeToPrimarySafe}
        merchantSafe={merchantSafe}
        isRefreshingBalances={isRefreshingBalances}
      />
    </Container>
  );
};

export default memo(MerchantScreen);