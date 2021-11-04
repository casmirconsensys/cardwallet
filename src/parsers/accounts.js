import {
  add,
  convertAmountAndPriceToNativeDisplay,
  convertAmountToNativeDisplay,
  convertAmountToPercentageDisplay,
  convertRawAmountToBalance,
} from '@cardstack/cardpay-sdk';
import { get, map, toUpper } from 'lodash';
import { dedupeUniqueTokens } from './uniqueTokens';
import AssetTypes from '@rainbow-me/helpers/assetTypes';
import { getTokenMetadata, isLowerCaseMatch } from '@rainbow-me/utils';

/**
 * @desc parse account assets
 * @param  {Object} [data]
 * @return {Array}
 */
export const parseAccountAssets = (data, uniqueTokens) => {
  const dedupedAssets = dedupeUniqueTokens(data, uniqueTokens);
  return dedupedAssets.map(assetData => {
    const asset = parseAsset(assetData.asset);
    return {
      ...asset,
      balance: convertRawAmountToBalance(assetData.quantity, asset),
    };
  });
};

// eslint-disable-next-line no-useless-escape
const sanitize = s => s.replace(/[^a-z0-9áéíóúñü \.,_@:-]/gim, '');

export const parseAssetName = (metadata, name) => {
  if (metadata?.name) return metadata?.name;
  return name ? sanitize(name) : 'Unknown Token';
};

export const parseAssetSymbol = (metadata, symbol) => {
  if (metadata?.symbol) return metadata?.symbol;
  return symbol ? toUpper(sanitize(symbol)) : '———';
};

/**
 * @desc parse asset
 * @param  {Object} assetData
 * @return {Object}
 */
export const parseAsset = ({ asset_code: address, ...asset } = {}) => {
  const metadata = getTokenMetadata(address);
  const name = parseAssetName(metadata, asset.name);
  const symbol = parseAssetSymbol(metadata, asset.symbol);
  const type =
    asset.type === AssetTypes.uniswap || asset.type === AssetTypes.uniswapV2
      ? asset.type
      : AssetTypes.token;

  return {
    ...asset,
    ...metadata,
    address,
    name,
    symbol,
    type,
    uniqueId: address || name,
  };
};

export const parseAssetsNativeWithTotals = (assets, nativeCurrency) => {
  const assetsNative = parseAssetsNative(assets, nativeCurrency);
  const totalAmount = assetsNative.reduce(
    (total, asset) => add(total, get(asset, 'native.balance.amount', 0)),
    0
  );
  const totalDisplay = convertAmountToNativeDisplay(
    totalAmount,
    nativeCurrency
  );
  const total = { amount: totalAmount, display: totalDisplay };
  return { assetsNativePrices: assetsNative, total };
};

export const parseAssetsNative = (assets, nativeCurrency) =>
  map(assets, asset => {
    const assetNativePrice = get(asset, 'price', {
      changed_at: null,
      relative_change_24h: 0,
      value: 0,
    });

    const priceUnit = get(assetNativePrice, 'value', 0);

    const hasPrice = priceUnit;

    // Only try to convertAmount if there's a price otherwise use default balance
    const nativeDisplay = hasPrice
      ? convertAmountAndPriceToNativeDisplay(
          get(asset, 'balance.amount', 0),
          priceUnit,
          nativeCurrency
        )
      : asset?.native?.balance;

    return {
      ...asset,
      native: {
        balance: nativeDisplay,
        change: isLowerCaseMatch(get(asset, 'symbol'), nativeCurrency)
          ? null
          : assetNativePrice.relative_change_24h
          ? convertAmountToPercentageDisplay(
              assetNativePrice.relative_change_24h
            )
          : '',
        price: {
          amount: priceUnit,
          display: convertAmountToNativeDisplay(priceUnit, nativeCurrency),
        },
      },
    };
  });
