import { MerchantEarnedSpendStrategy } from '@cardstack/transaction-mapping-strategies/transaction-mapping-strategy-types/merchant-earned-spend-strategy';
import { MERCHANT_EARNED_SPEND_MOCK_DATA } from '@cardstack/utils/__mocks__/merchant-strategies';

jest.mock('../../../src/utils', () => ({ deviceUtils: { isIOS14: false } }));

jest.mock('@rainbow-me/references', () => ({
  shitcoins: 'JSON-MOCK-RETURN',
}));

const result = {
  address: '0xcba12315cc838375F0e1E9a9f5b2aFE0196B07B6',
  infoDid: '3a13a41e-e44a-4b0f-b079-2d3d53571870',
  nativeBalanceDisplay: '$1.50 USD',
  spendBalanceDisplay: '§150 SPEND',
  timestamp: '1629156260',
  transactionHash:
    '0x5293d95a240c231852724fd31ff6df119e5b5cf7661a7aec38f7cf10893dc2eb',
  type: 'merchantEarnedSpend',
};

describe('MerchantEarnedSpendStrategy', () => {
  const contructorParams = {
    accountAddress: '0x64Fbf34FaC77696112F1Abaa69D28211214d76c7',
    currencyConversionRates: {
      AUD: 1.362445,
      CAD: 1.262345,
      CNY: 6.432498,
      EUR: 0.846102,
      GBP: 0.72197,
      INR: 73.445498,
      JPY: 109.350353,
      KRW: 1166.819664,
      NZD: 1.402265,
      RUB: 72.280298,
      TRY: 8.429594,
      USD: 1,
      ZAR: 14.41804,
    },
    depotAddress: '0xF48c7B663DFCa76E1954bC44f7Fc006e2e04b09C',
    merchantSafeAddress: '0xcba12315cc838375F0e1E9a9f5b2aFE0196B07B6',
    merchantSafeAddresses: [
      '0x51217e4769DFD61a42f8A509d4DCcC5683BFCB21',
      '0xb891ad9b23826e61F010D5cd90d6a24Ea55010Bd',
      '0x1D2BCdFb26319d1F5919aa66b105AE972946b9fE',
      '0x6A4946bF21df59C58d4129802e0a37Ac649e6ae7',
      '0x8de5D051565dF590A92f00a57B6d24609a17BC01',
      '0x372582b0290cab3fcEb009A0F3869D50a00276D2',
      '0x9Ed84407e5ed5B7c0323E5653A06F4528357e3B5',
      '0xcba12315cc838375F0e1E9a9f5b2aFE0196B07B6',
    ],
    nativeCurrency: 'USD',
    prepaidCardAddresses: ['0x35Ae15dCEB6930756A59EfcC2169d2b834CdD371'],
    transaction: MERCHANT_EARNED_SPEND_MOCK_DATA,
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const MerchantInstance = new MerchantEarnedSpendStrategy(contructorParams);

  test('returns the proper object', async () => {
    MerchantInstance.mapTransaction().then(value => {
      expect(value).toBe(result);
    });
  });

  test('returns true with proper constructors', () => {
    expect(MerchantInstance.handlesTransaction()).toBeTruthy();
  });
});