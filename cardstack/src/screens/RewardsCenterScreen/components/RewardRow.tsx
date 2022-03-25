import React from 'react';
import { strings } from '../strings';
import {
  Container,
  Button,
  Text,
  CoinIcon,
  TouchableProps,
  CardPressable,
} from '@cardstack/components';

export interface RewardRowProps extends Omit<TouchableProps, 'children'> {
  coinSymbol: string;
  primaryText: string;
  subText?: string;
  claimed?: boolean;
  onClaimPress?: () => void;
}

export const RewardRow = ({
  coinSymbol,
  primaryText,
  subText,
  claimed = false,
  onClaimPress,
  onPress,
  ...props
}: RewardRowProps) => (
  <CardPressable
    flexDirection="column"
    width="100%"
    disabled={!onPress}
    onPress={onPress}
    {...props}
  >
    <Container
      padding={4}
      borderWidth={1}
      borderColor="borderLightColor"
      borderRadius={10}
    >
      <Container alignItems="center" flexDirection="row">
        <CoinIcon size={40} symbol={coinSymbol} />
        <Container
          paddingLeft={3}
          flexDirection="column"
          alignItems="flex-start"
          flex={1}
        >
          <Text fontSize={15}>
            {claimed && strings.claim.claimed + ' '}
            <Text weight="extraBold" fontSize={15} ellipsizeMode="tail">
              {primaryText}
            </Text>
          </Text>
          {subText && <Text variant="subText">{subText}</Text>}
        </Container>
      </Container>
      {!!onClaimPress && (
        <Container paddingTop={4}>
          <Button
            variant="small"
            height={30}
            width="100%"
            onPress={onClaimPress}
          >
            {strings.claim.button}
          </Button>
        </Container>
      )}
    </Container>
  </CardPressable>
);
