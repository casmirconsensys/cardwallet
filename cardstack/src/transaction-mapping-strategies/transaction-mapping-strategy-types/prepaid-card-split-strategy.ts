import {
  PrepaidCardSplitTransactionType,
  TransactionTypes,
} from '@cardstack/types';
import {
  convertSpendForBalanceDisplay,
  fetchCardCustomizationFromDID,
} from '@cardstack/utils';

import { BaseStrategy } from '../base-strategy';

export class PrepaidCardSplitStrategy extends BaseStrategy {
  handlesTransaction(): boolean {
    const { prepaidCardSplits } = this.transaction;

    if (prepaidCardSplits?.[0]) {
      return true;
    }

    return false;
  }

  async mapTransaction(): Promise<PrepaidCardSplitTransactionType | null> {
    const prepaidCardSplitTransaction = this.transaction.prepaidCardSplits?.[0];

    if (!prepaidCardSplitTransaction) {
      return null;
    }

    let cardCustomization;

    if (prepaidCardSplitTransaction.prepaidCard.customizationDID) {
      try {
        cardCustomization = await fetchCardCustomizationFromDID(
          prepaidCardSplitTransaction.prepaidCard.customizationDID
        );
      } catch (error) {}
    }

    const spendAmount = prepaidCardSplitTransaction.faceValues[0] || 0;

    const { nativeBalanceDisplay } = await convertSpendForBalanceDisplay(
      spendAmount,
      this.nativeCurrency
    );

    return {
      address: prepaidCardSplitTransaction.prepaidCard.id,
      cardCustomization,
      timestamp: prepaidCardSplitTransaction.timestamp,
      spendAmount,
      nativeBalanceDisplay,
      prepaidCardCount: prepaidCardSplitTransaction.faceValues.length,
      transactionHash: this.transaction.id,
      type: TransactionTypes.PREPAID_CARD_SPLIT,
    };
  }
}
