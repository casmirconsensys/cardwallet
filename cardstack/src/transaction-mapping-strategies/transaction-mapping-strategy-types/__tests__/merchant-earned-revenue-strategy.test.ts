import { MerchantEarnedRevenueStrategy } from '@cardstack/transaction-mapping-strategies/transaction-mapping-strategy-types/merchant-earned-revenue-strategy';
import { MERCHANT_EARNED_SPEND_MOCK_DATA } from '@cardstack/utils/__mocks__/merchant-strategies';

const mockServices = jest.requireActual('../../../services');
jest.mock('../../../services', () => ({
  ...mockServices,
  fetchHistoricalPrice: jest.fn().mockReturnValue(Promise.resolve(0)),
  getNativeBalanceFromOracle: jest.fn().mockReturnValue(1.493202),
}));

describe('MerchantEarnedRevenueStrategy', () => {
  const contructorParams = {
    accountAddress: '0x64Fbf34FaC77696112F1Abaa69D28211214d76c7',
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
  const strategy = new MerchantEarnedRevenueStrategy(contructorParams);

  it('returns the proper object', async () => {
    const value = await strategy.mapTransaction();
    expect(value).toEqual({
      address: '0xcba12315cc838375F0e1E9a9f5b2aFE0196B07B6',
      balance: {
        amount: '1.497005988023952095',
        display: '1.497 DAI',
      },
      infoDid: '3a13a41e-e44a-4b0f-b079-2d3d53571870',
      native: {
        amount: '0',
        display: '$0.00 USD',
      },
      netEarned: {
        amount: '1.489520958083832335',
        display: '1.49 DAI',
      },
      netEarnedNativeDisplay: '$1.49 USD',
      timestamp: '1629156260',
      token: {
        address: '0xFeDc0c803390bbdA5C4C296776f4b574eC4F30D1',
        name: 'Dai Stablecoin.CPXD',
        symbol: 'DAI',
      },
      transaction: {
        netEarned: {
          amount: '1.489520958083832335',
          display: '1.49 DAI',
        },
        netEarnedNativeDisplay: '$1.49 USD',
        protocolFee: '0.00749 DAI',
        revenueCollected: '1.497 DAI',
      },
      transactionHash:
        '0x5293d95a240c231852724fd31ff6df119e5b5cf7661a7aec38f7cf10893dc2eb',
      type: 'merchantEarnedRevenue',
    });
  });

  it('returns true with proper constructors', () => {
    expect(strategy.handlesTransaction()).toBeTruthy();
  });
});
