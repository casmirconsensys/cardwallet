import { isEmpty } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { checkIsValidAddressOrDomain } from '../../helpers/validators';
import {
  SendAssetForm,
  SendAssetList,
  SendButton,
  SendContactList,
  SendHeader,
  SendTransactionSpeed,
} from '.';
import { Sheet } from '@cardstack/components';
import { useInvalidPaste } from '@cardstack/hooks';
import {
  useAccountSettings,
  useContacts,
  useDimensions,
} from '@rainbow-me/hooks';

export const useShowAssetFlags = (isValidAddress, selected) => ({
  showAssetList: isValidAddress && isEmpty(selected),
  showAssetForm: isValidAddress && !isEmpty(selected),
});

export const useSendAddressValidation = recipient => {
  const [isValidAddress, setIsValidAddress] = useState(false);

  const checkAddress = useCallback(async () => {
    const validAddress = await checkIsValidAddressOrDomain(recipient);
    setIsValidAddress(validAddress);
  }, [recipient]);

  useEffect(() => {
    checkAddress();
  }, [checkAddress]);

  return isValidAddress;
};

export default function SendSheet({
  isValidAddress,
  setRecipient,
  recipient,
  recipientFieldRef,
  allAssets,
  nativeCurrency,
  network,
  onSelectAsset,
  savings = [],
  sendableCollectibles = [],
  amountDetails,
  isAuthorizing,
  isSufficientGas,
  onSendPress,
  onChangeAssetAmount,
  onChangeNativeAmount,
  onResetAssetSelection,
  selected,
  selectedGasPrice,
  type,
  onMaxBalancePress,
  fetchData = undefined,
  onPressTransactionSpeed = undefined,
  showNativeCurrencyField = true,
}) {
  const [currentInput, setCurrentInput] = useState('');

  const { isTinyPhone } = useDimensions();
  const { nativeCurrencySymbol } = useAccountSettings();
  const { contacts, onRemoveContact, filteredContacts } = useContacts();
  const { showAssetList, showAssetForm } = useShowAssetFlags(
    isValidAddress,
    selected
  );
  const { isInvalidPaste, onInvalidPaste } = useInvalidPaste();

  const showEmptyState = !isValidAddress;

  const onChangeInput = useCallback(
    event => {
      setCurrentInput(event);
      setRecipient(event);
    },
    [setRecipient]
  );

  return (
    <Sheet isFullScreen scrollEnabled>
      {ios && <StatusBar barStyle="light-content" />}
      <SendHeader
        contacts={contacts}
        isValidAddress={isValidAddress}
        onChangeAddressInput={onChangeInput}
        onInvalidPaste={onInvalidPaste}
        onPressPaste={setRecipient}
        recipient={recipient}
        recipientFieldRef={recipientFieldRef}
        removeContact={onRemoveContact}
        showAssetList={showAssetList}
      />
      {showEmptyState && (
        <SendContactList
          contacts={filteredContacts}
          currentInput={currentInput}
          isInvalidPaste={isInvalidPaste}
          onPressContact={setRecipient}
          removeContact={onRemoveContact}
        />
      )}
      {showAssetList && (
        <SendAssetList
          allAssets={allAssets}
          collectibles={sendableCollectibles}
          fetchData={fetchData}
          nativeCurrency={nativeCurrency}
          network={network}
          onSelectAsset={onSelectAsset}
          savings={savings}
        />
      )}
      {showAssetForm && (
        <SendAssetForm
          allAssets={allAssets}
          assetAmount={amountDetails.assetAmount}
          buttonRenderer={
            <SendButton
              assetAmount={amountDetails.assetAmount}
              isAuthorizing={isAuthorizing}
              isSufficientBalance={amountDetails.isSufficientBalance}
              isSufficientGas={isSufficientGas}
              onPress={onSendPress}
              smallButton={isTinyPhone}
              testID="send-sheet-confirm"
            />
          }
          nativeAmount={amountDetails.nativeAmount}
          nativeCurrency={nativeCurrency}
          onChangeAssetAmount={onChangeAssetAmount}
          onChangeNativeAmount={onChangeNativeAmount}
          onResetAssetSelection={onResetAssetSelection}
          selected={selected}
          sendMaxBalance={onMaxBalancePress}
          showNativeCurrencyField={showNativeCurrencyField}
          txSpeedRenderer={
            <SendTransactionSpeed
              gasPrice={selectedGasPrice}
              isSufficientGas={isSufficientGas}
              nativeCurrencySymbol={nativeCurrencySymbol}
              onPressTransactionSpeed={onPressTransactionSpeed}
              sendType={type}
            />
          }
        />
      )}
    </Sheet>
  );
}
