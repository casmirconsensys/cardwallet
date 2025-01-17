import { useNavigation } from '@react-navigation/native';
import React, { memo, ReactNode, useCallback } from 'react';

import {
  Container,
  Icon,
  Text,
  MainHeaderWrapper,
} from '@cardstack/components';
import { Routes } from '@cardstack/navigation';
import useRewardsDataFetch from '@cardstack/screens/RewardsCenterScreen/useRewardsDataFetch';

import { networkInfo } from '@rainbow-me/helpers/networkInfo';
import { useAccountSettings } from '@rainbow-me/hooks';

import { ContainerProps } from '../Container';
import { Touchable } from '../Touchable';

interface Props extends ContainerProps {
  title?: string;
  showNetwork?: boolean;
  rightIcon?: JSX.Element;
  leftIcon?: JSX.Element;
  children?: ReactNode;
}

const MainHeader = ({
  title,
  showNetwork = true,
  rightIcon,
  leftIcon,
  children,
  ...containerProps
}: Props) => {
  const { navigate } = useNavigation();
  const { network } = useAccountSettings();
  const { rewardPoolTokenBalances } = useRewardsDataFetch();

  const onMenuPress = useCallback(() => navigate(Routes.SETTINGS_MODAL), [
    navigate,
  ]);

  const onRewardPress = useCallback(() => {
    navigate(Routes.REWARDS_CENTER_SCREEN);
  }, [navigate]);

  const availableRewards = rewardPoolTokenBalances?.length;

  return (
    <MainHeaderWrapper {...containerProps}>
      {!leftIcon ? (
        <Icon
          color="teal"
          iconSize="medium"
          name="menu"
          onPress={onMenuPress}
          size={28}
        />
      ) : (
        leftIcon
      )}
      {!children ? (
        <Container flex={1} alignItems="center" flexDirection="column">
          {!!title && (
            <Text color="white" size="small" weight="bold">
              {title}
            </Text>
          )}
          {showNetwork && (
            <Text color="backgroundLightGray" size="xxs">
              {networkInfo[network].name}
            </Text>
          )}
        </Container>
      ) : (
        children
      )}
      {!rightIcon ? (
        <Touchable
          flexDirection="row"
          alignItems="flex-end"
          onPress={onRewardPress}
        >
          <Icon color="teal" iconSize="medium" size={26} name="rewards" />
          {!!availableRewards && (
            <Container>
              <Text color="teal" fontSize={18} weight="bold" marginLeft={2}>
                {availableRewards}
              </Text>
            </Container>
          )}
        </Touchable>
      ) : (
        rightIcon
      )}
    </MainHeaderWrapper>
  );
};

export default memo(MainHeader);
