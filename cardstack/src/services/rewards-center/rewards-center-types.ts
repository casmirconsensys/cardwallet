import { NativeCurrency, RewardSafe } from '@cardstack/cardpay-sdk';
import { TransactionReceipt } from 'web3-core';

import { EthersSignerParams } from '@cardstack/models/ethers-wallet';
import { TokenType } from '@cardstack/types';

export interface RewardsSafeQueryParams {
  accountAddress: string;
  nativeCurrency: NativeCurrency;
}

export type RewardsSafeType = Omit<RewardSafe, 'tokens'> & {
  tokens: TokenType[];
};

export interface RewardsSafeQueryResult {
  rewardSafes: RewardsSafeType[];
}

interface TokenByProgramID extends TokenType {
  rewardProgramId?: string;
}
export interface RewardsTokenBalancesResult {
  rewardPoolTokenBalances: TokenByProgramID[];
}

interface RewardsPoolSignedBaseParams extends EthersSignerParams {
  accountAddress: string;
  rewardProgramId: string;
}
export interface RewardsRegisterMutationParams
  extends RewardsPoolSignedBaseParams {
  prepaidCardAddress: string;
}

// Export type from sdk
export interface SuccessfulTransactionReceipt extends TransactionReceipt {
  status: true;
}
export interface RewardsRegisterMutationResult {
  rewardSafe: string;
  txReceipt: SuccessfulTransactionReceipt;
}

export interface RewardsClaimMutationParams
  extends RewardsPoolSignedBaseParams,
    ValidProofsParams {
  safeAddress: string;
}

export interface RegisterGasEstimateQueryParams {
  prepaidCardAddress: string;
  rewardProgramId: string;
}

export interface ValidProofsParams {
  accountAddress: string;
  tokenAddress: string;
  rewardProgramId: string;
}

export type RewardsClaimGasEstimateParams = RewardsClaimMutationParams;
interface RewardWithdrawBaseParams {
  to: string;
  from: string;
  amount?: string;
  tokenAddress: string;
}
export interface RewardWithdrawParams
  extends RewardWithdrawBaseParams,
    Omit<RewardsPoolSignedBaseParams, 'rewardProgramId'> {}

export type RewardWithdrawGasEstimateParams = RewardWithdrawBaseParams;
