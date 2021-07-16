export enum TransactionConfirmationType {
  GENERIC = 'generic',
  ISSUE_PREPAID_CARD = 'issuePrepaidCard',
  REGISTER_MERCHANT = 'registerMerchant',
  PAY_MERCHANT = 'payMerchant',
  SPLIT_PREPAID_CARD = 'splitPrepaidCard',
  TRANSFER_PREPAID_CARD = 'transferPrepaidCard',
  CLAIM_REVENUE = 'claimRevenue',
}

export interface Level1DecodedData {
  amount: string;
  data: string;
  to: string;
}

export interface TokenData {
  symbol: string;
  decimals: number;
}

export interface GenericDisplayData {
  type: TransactionConfirmationType.GENERIC;
}
export interface IssuePrepaidCardDecodedData {
  amount: string;
  to: string;
  issuingTokenAmounts: string[];
  owner: string;
  spendAmounts: string[];
  customizationDID: string;
  token: TokenData;
  type: TransactionConfirmationType.ISSUE_PREPAID_CARD;
}

export interface RegisterMerchantDecodedData {
  spendAmount: number;
  infoDID: string;
  prepaidCard: string;
  type: TransactionConfirmationType.REGISTER_MERCHANT;
}

export interface PayMerchantDecodedData {
  spendAmount: number;
  merchantSafe: string;
  prepaidCard: string;
  type: TransactionConfirmationType.PAY_MERCHANT;
}

export interface ClaimRevenueDecodedData {
  amount: string;
  tokenAddress: string;
  merchantSafe: string;
  price: number;
  token: TokenData;
  type: TransactionConfirmationType.CLAIM_REVENUE;
}

export type ActionDispatcherActionName =
  | 'registerMerchant'
  | 'payMerchant'
  | 'split'
  | 'transfer';

export interface ActionDispatcherDecodedData {
  spendAmount: number;
  requestedRate: number;
  actionName: ActionDispatcherActionName;
  actionData: string;
}

export type TransactionConfirmationData =
  | GenericDisplayData
  | IssuePrepaidCardDecodedData
  | RegisterMerchantDecodedData
  | ClaimRevenueDecodedData
  | PayMerchantDecodedData;