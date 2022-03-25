export const MainRoutes = {
  DEPOT_SCREEN: 'DepotScreen',
  MERCHANT_SCREEN: 'MerchantScreen',
  MERCHANT_PAYMENT_REQUEST_SHEET: 'MerchantPaymentRequestSheet',
  PREPAID_CARD_MODAL: 'PrepaidCardModal',
  BUY_PREPAID_CARD: 'BuyPrepaidCard',
  SEND_FLOW_DEPOT: 'SendFlowDepot',
  SEND_FLOW_EOA: 'SendFlowEOA',
  PAY_MERCHANT: 'PayMerchant',
  ERROR_FALLBACK_SCREEN: 'ErrorFallbackScreen',
  LOADING_OVERLAY: 'LoadingOverlay',
  WELCOME_SCREEN: 'WelcomeScreen',
  COLLECTIBLE_SHEET: 'CollectibleSheet',
  IMPORT_SEED_SHEET: 'ImportSeedSheet',
  PAYMENT_RECEIVED_SHEET: 'PaymentReceivedSheet',
  UNCLAIMED_REVENUE_SHEET: 'UnclaimedRevenueSheet',
  CONFIRM_CLAIM_DESTINY_SHEET: 'ConfirmClaimDestinySheet',
  WALLET_CONNECT_APPROVAL_SHEET: 'WalletConnectApprovalSheet',
  WALLET_CONNECT_REDIRECT_SHEET: 'WalletConnectRedirectSheet',
  PAYMENT_CONFIRMATION_SHEET: 'PaymentConfirmationSheet',
  MERCHANT_TRANSACTION_SHEET: 'MerchantTransactionSheet',
  CHOOSE_PREPAIDCARD_SHEET: 'ChoosePrepaidCardSheet',
  SETTINGS_MODAL: 'SettingModal',
  TRANSFER_CARD: 'TransferCardScreen',
  REWARDS_CENTER_SCREEN: 'RewardsCenterScreen',
  REWARDS_REGISTER_SHEET: 'RewardsRegisterSheet',
  TRANSACTION_CONFIRMATION_SHEET: 'TransactionConfirmationScreen',
} as const;

export const GlobalRoutes = {
  CONFIRM_REQUEST: 'ConfirmRequest',
  CURRENCY_SELECTION_MODAL: 'CurrencySelectionModal',
  LOADING_OVERLAY: 'LoadingOverlay',
} as const;
