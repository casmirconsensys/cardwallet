import React from 'react';

import {
  Container,
  HorizontalDivider,
  Icon,
  NetworkBadge,
  Text,
  TransactionConfirmationDisplayProps,
} from '@cardstack/components';
import { usePrepaidCard } from '@cardstack/hooks';
import {
  TransferPrepaidCard1DecodedData,
  TransferPrepaidCard2DecodedData,
} from '@cardstack/types';

import { ContactAvatar } from '@rainbow-me/components/contacts';
import { useAccountProfile } from '@rainbow-me/hooks';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';

import { SectionHeaderText } from '../components/SectionHeaderText';

type TransferDecodedDataType =
  | TransferPrepaidCard1DecodedData
  | TransferPrepaidCard2DecodedData;

interface TransferPrepaidCardDisplayProps
  extends TransactionConfirmationDisplayProps {
  data: TransferDecodedDataType;
}

export const TransferPrepaidCardDisplay = (
  props: TransferPrepaidCardDisplayProps
) => {
  const { data } = props;

  return (
    <>
      <FromSection />
      <HorizontalDivider />
      <TransferSection data={data} />
      <HorizontalDivider />
      <ToSection data={data} />
    </>
  );
};

const FromSection = () => {
  const { accountColor, accountName, accountSymbol } = useAccountProfile();

  const depots = useRainbowSelector(state => state.data.depots);
  const depot = depots?.[0];

  return (
    <Container marginTop={8} width="100%">
      <SectionHeaderText>FROM</SectionHeaderText>
      <Container paddingHorizontal={3} marginTop={4}>
        <Container flexDirection="row">
          <ContactAvatar
            color={accountColor}
            size="smaller"
            value={accountSymbol}
          />
          <Container marginLeft={4}>
            <Text weight="extraBold">{accountName}</Text>
            <NetworkBadge marginTop={2} />
            {depot && (
              <Container flexDirection="row" marginTop={2}>
                <Container backgroundColor="black" width={2} height="100%" />
                <Container marginLeft={4}>
                  <Text size="xxs" weight="bold">
                    DEPOT
                  </Text>
                  <Container maxWidth={180} marginTop={1}>
                    <Text variant="subAddress">{depot.address}</Text>
                  </Container>
                </Container>
              </Container>
            )}
          </Container>
        </Container>
      </Container>
    </Container>
  );
};

const TransferSection = ({ data }: { data: TransferDecodedDataType }) => {
  const { prepaidCard, nativeBalanceDisplay } = usePrepaidCard(
    data.prepaidCard
  );

  return (
    <Container width="100%">
      <SectionHeaderText>TRANSER THIS CARD</SectionHeaderText>
      <Container paddingHorizontal={3} marginTop={4}>
        <Container flexDirection="row">
          <Icon name="prepaid-card" />
          <Container marginLeft={4}>
            <Text weight="extraBold">Prepaid Card</Text>
            <NetworkBadge marginTop={2} />
            <Container maxWidth={180} marginTop={1}>
              <Text variant="subAddress">{data.prepaidCard}</Text>
            </Container>
            {prepaidCard && (
              <Container marginTop={2}>
                <Text size="xxs">Face Value</Text>
                <Text fontSize={15} weight="extraBold">
                  {nativeBalanceDisplay}
                </Text>
              </Container>
            )}
          </Container>
        </Container>
      </Container>
    </Container>
  );
};

const ToSection = ({ data }: { data: TransferDecodedDataType }) => {
  return (
    <Container width="100%">
      <SectionHeaderText>TO</SectionHeaderText>
      <Container paddingHorizontal={3} marginTop={4}>
        <Container flexDirection="row">
          <Icon name="user-with-background" />
          <Container marginLeft={4}>
            <Container maxWidth={180}>
              <Text variant="subAddress">{data.newOwner}</Text>
            </Container>
          </Container>
        </Container>
      </Container>
    </Container>
  );
};
