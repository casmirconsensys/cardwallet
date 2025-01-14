import { fromWei, greaterThanOrEqualTo } from '@cardstack/cardpay-sdk';
import BigNumber from 'bignumber.js';
import { get } from 'lodash';
import { useState, useEffect } from 'react';

import { useAccountAssets, useGas } from '@rainbow-me/hooks';
import { ethereumUtils } from '@rainbow-me/utils';
import { isMessageDisplayType } from '@rainbow-me/utils/signingMethods';

import { useRouteParams } from './use-route-params';

export const useIsBalanceEnough = () => {
  const { allAssets } = useAccountAssets();
  const [isBalanceEnough, setIsBalanceEnough] = useState(true);
  const { isSufficientGas, selectedGasPrice } = useGas();

  const {
    transactionDetails: {
      payload: { method, params },
    },
  } = useRouteParams();

  const isMessageRequest = isMessageDisplayType(method);

  useEffect(() => {
    if (isMessageRequest) {
      setIsBalanceEnough(true);

      return;
    }

    if (!isSufficientGas) {
      setIsBalanceEnough(false);

      return;
    }

    const { txFee } = selectedGasPrice;

    if (!txFee) {
      setIsBalanceEnough(false);

      return;
    }

    // Get the TX fee Amount
    const txFeeAmount = fromWei(get(txFee, 'value.amount', 0));

    // Get the gas token balance
    const nativeAsset = ethereumUtils.getNativeTokenAsset(allAssets);
    const balanceAmount = get(nativeAsset, 'balance.amount', 0);

    // Get the TX value
    const txPayload = get(params, '[0]');
    const value = get(txPayload, 'value', 0);

    // Check that there's enough ETH to pay for everything!
    const totalAmount = new BigNumber(fromWei(value)).plus(txFeeAmount);
    const isEnough = greaterThanOrEqualTo(balanceAmount, totalAmount);

    setIsBalanceEnough(isEnough);
  }, [
    allAssets,
    isBalanceEnough,
    isMessageRequest,
    isSufficientGas,
    params,
    selectedGasPrice,
  ]);

  return isBalanceEnough;
};
