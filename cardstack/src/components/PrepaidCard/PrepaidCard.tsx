import React, { useState } from 'react';
import { Image } from 'react-native';
import SVG, {
  Defs,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';

import logo from '../../assets/cardstackLogoTransparent.png';
import { ExpandedCard, ExpandedCardProps } from './ExpandedCard';
import { numberWithCommas, getDollarsFromDai } from '@cardstack/utils';
import { Container, ScrollView, Text, Touchable } from '@cardstack/components';

interface PrepaidCardProps extends ExpandedCardProps {
  issuer: string;
  /** unique identifier, displayed in top right corner of card */
  id: string;
  /** balance in xDai */
  spendableBalance: number;
}

/**
 * A prepaid card component
 */
export const PrepaidCard = (props: PrepaidCardProps) => {
  const [isScrollable, setIsScrollable] = useState(false);
  const { issuer, id, spendableBalance } = props;
  const Wrapper = isScrollable ? ScrollView : Container;

  return (
    <Wrapper width="100%">
      <Touchable
        onPress={() => setIsScrollable(!isScrollable)}
        width="100%"
        testID="prepaid-card"
      >
        <Container
          backgroundColor="white"
          borderRadius={10}
          overflow="hidden"
          borderColor="buttonPrimaryBorder"
          width="100%"
        >
          <GradientBackground />
          <Top issuer={issuer} id={id} />
          <Bottom spendableBalance={spendableBalance} />
        </Container>
      </Touchable>
      {isScrollable && <ExpandedCard recentActivity={props.recentActivity} />}
    </Wrapper>
  );
};

const GradientBackground = () => (
  <SVG
    width="100%"
    height={110}
    viewBox="0 0 400 100"
    style={{ position: 'absolute', top: -12 }}
  >
    <Defs>
      <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
        <Stop offset="0" stopColor="#00ebe5" stopOpacity="1" />
        <Stop offset="1" stopColor="#c3fc33" stopOpacity="1" />
      </LinearGradient>
    </Defs>
    <Rect id="Gradient" width="100%" height="110" fill="url(#grad)" />
    <G
      id="Bottom_platter"
      data-name="Bottom platter"
      transform="translate(0 71)"
    >
      <Path
        id="Union_18"
        data-name="Union 18"
        d="M0,164.992v-.127H0V0H139.563s13.162.132,24.094,12.362,15.768,15.605,15.768,15.605,7.3,8.09,22.43,8.452H335l-.064,128.572Z"
        fill="#fff"
      />
    </G>
  </SVG>
);

const Top = ({ issuer, id }: { issuer: string; id: string }) => (
  <Container width="100%" paddingHorizontal={6} paddingVertical={4}>
    <Container width="100%">
      <Text size="xxs">Issued by</Text>
    </Container>
    <Container
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <Text size="xs" weight="extraBold">
        {issuer}
      </Text>
      <Container flexDirection="row">
        <Text variant="shadowRoboto">{id.slice(0, 6)}</Text>
        <Text variant="shadowRoboto" letterSpacing={1.35}>
          ...
        </Text>
        <Text variant="shadowRoboto">{id.slice(-4)}</Text>
      </Container>
    </Container>
    <Container width="100%" alignItems="flex-end">
      <Text fontSize={11}>on xDai chain</Text>
    </Container>
  </Container>
);

const Bottom = ({ spendableBalance }: { spendableBalance: number }) => {
  const formattedSpendableBalance = numberWithCommas(
    getDollarsFromDai(spendableBalance).toFixed(2)
  );

  return (
    <Container paddingHorizontal={6} paddingVertical={4}>
      <Container
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Container>
          <Text fontSize={13}>Spendable Balance</Text>
          <Text fontSize={40} fontWeight="700">
            {`§${numberWithCommas(spendableBalance.toString())}`}
          </Text>
        </Container>
        <Container height={46} width={42}>
          <Image
            source={logo}
            style={{
              height: '100%',
              resizeMode: 'contain',
              width: '100%',
            }}
          />
        </Container>
      </Container>
      <Container
        flexDirection="row"
        alignItems="flex-end"
        justifyContent="space-between"
        marginTop={2}
      >
        {/* not sure if we should start with xDai and convert to USD or go the other way around. Also unsure how we will do that calculation either way */}
        <Text fontWeight="700">{`$${formattedSpendableBalance} USD`}</Text>
        {/* not sure if these will be different based on card or universal */}
        <Container alignItems="flex-end">
          <Text variant="smallGrey">RELOADABLE</Text>
          <Text variant="smallGrey">NON-TRANSFRERRABLE</Text>
        </Container>
      </Container>
    </Container>
  );
};