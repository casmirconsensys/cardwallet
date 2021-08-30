import { get } from 'lodash';
import React from 'react';

import { Row } from '../layout';
import { Container, Icon, Text, Touchable } from '@cardstack/components';

export default function SendTransactionSpeed({
  gasPrice,
  nativeCurrencySymbol,
  onPressTransactionSpeed,
}) {
  // Checking format to proper display gas fee to EOA and depot flows
  const isGasNumber = typeof gasPrice === 'number';

  const fee = isGasNumber
    ? `${nativeCurrencySymbol}${gasPrice}`
    : get(
        gasPrice,
        'txFee.native.value.display',
        `${nativeCurrencySymbol}0.00`
      );

  const timeAmount = isGasNumber ? 0 : get(gasPrice, 'estimatedTime.amount', 0);

  const time = isGasNumber ? '' : get(gasPrice, 'estimatedTime.display', '');

  return (
    <Row justify="center">
      <Touchable
        disabled={!onPressTransactionSpeed}
        marginRight={5}
        onPress={onPressTransactionSpeed}
      >
        <Container alignItems="center" flexDirection="row">
          <Text variant="subText">Fee: {fee}</Text>
          {!timeAmount && !!onPressTransactionSpeed && (
            <Icon color="settingsTeal" iconSize="small" name="chevron-right" />
          )}
        </Container>
      </Touchable>
      {!!timeAmount && (
        <Touchable onPress={onPressTransactionSpeed}>
          <Container alignItems="center" flexDirection="row">
            <Text
              color="black"
              fontWeight="600"
              marginRight={1}
              variant="subText"
            >
              Arrives in ~ {time}
            </Text>
            <Icon color="settingsTeal" iconSize="small" name="chevron-right" />
          </Container>
        </Touchable>
      )}
    </Row>
  );
}
