import { useCallback, useMemo, useState } from 'react';

import { useNavigation, useRoute } from '@react-navigation/core';
import { strings } from './strings';
import { useSendAddressValidation } from '@rainbow-me/components/send/SendSheet';
import { useAccountSettings, useWallets } from '@rainbow-me/hooks';
import { RouteType } from '@cardstack/navigation/types';
import { useTransferPrepaidCardMutation } from '@cardstack/services';
import { useLoadingOverlay } from '@cardstack/navigation';
import { Alert } from '@rainbow-me/components/alerts';
import { useMutationEffects } from '@cardstack/hooks';

interface NavParams {
  prepaidCardAddress: string;
}

export const useTransferCardScreen = () => {
  const {
    params: { prepaidCardAddress },
  } = useRoute<RouteType<NavParams>>();

  const { goBack } = useNavigation();

  const [newOwnerAddress, setNewOwnerAddress] = useState('');

  const isValidAddress = useSendAddressValidation(newOwnerAddress);

  const { accountAddress, network } = useAccountSettings();
  const { selectedWallet } = useWallets();

  const { showLoadingOverlay, dismissLoadingOverlay } = useLoadingOverlay();

  const onChangeText = useCallback(text => {
    setNewOwnerAddress(text);
  }, []);

  const [
    transferPrepaidCard,
    { isSuccess, isError },
  ] = useTransferPrepaidCardMutation();

  const onTransferFinishedAlert = useCallback(
    ({ title, message }) => () => {
      dismissLoadingOverlay();

      Alert({
        message,
        title,
        buttons: [{ text: strings.alert.btnLabel, onPress: goBack }],
      });
    },
    [dismissLoadingOverlay, goBack]
  );

  useMutationEffects(
    useMemo(
      () => ({
        success: {
          status: isSuccess,
          callback: onTransferFinishedAlert({
            title: strings.alert.success.title,
            message: strings.alert.success.message,
          }),
        },
        error: {
          status: isError,
          callback: onTransferFinishedAlert({
            title: strings.alert.error.title,
            message: strings.alert.error.message,
          }),
        },
      }),
      [isError, isSuccess, onTransferFinishedAlert]
    )
  );

  const onTransferPress = useCallback(async () => {
    showLoadingOverlay({ title: strings.loadingTitle });

    transferPrepaidCard({
      accountAddress,
      network,
      prepaidCardAddress,
      newOwner: newOwnerAddress,
      walletId: selectedWallet.id,
    });
  }, [
    accountAddress,
    network,
    newOwnerAddress,
    prepaidCardAddress,
    selectedWallet.id,
    showLoadingOverlay,
    transferPrepaidCard,
  ]);

  const onScanPress = useCallback(() => {
    // TODO: handle scan qr code
  }, []);

  return {
    isValidAddress,
    onChangeText,
    onTransferPress,
    onScanPress,
    goBack,
  };
};