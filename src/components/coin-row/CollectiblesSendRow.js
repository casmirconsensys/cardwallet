import PropTypes from 'prop-types';
import React, { Fragment, useMemo } from 'react';
import { css } from 'styled-components';
import { useTheme } from '../../context/ThemeContext';
import { buildAssetUniqueIdentifier } from '../../helpers/assets';
import { deviceUtils, magicMemo } from '../../utils';
import Divider from '../Divider';
import { ButtonPressAnimation } from '../animations';
import { RequestVendorLogoIcon } from '../coin-icon';
import { Centered, InnerBorder } from '../layout';
import { TruncatedText } from '../text';
import CoinName from './CoinName';
import CoinRow from './CoinRow';
import { padding } from '@rainbow-me/styles';

const dividerHeight = 22;
const isTinyPhone = deviceUtils.dimensions.height <= 568;
const selectedHeight = isTinyPhone ? 62 : 78;

const selectedStyles = css`
  ${padding(17, 14, 19, 13)};
  height: ${selectedHeight};
`;

const BottomRow = ({ subtitle }) => {
  const { colors } = useTheme();
  return (
    <TruncatedText
      color={colors.alpha(colors.blueGreyDark, 0.5)}
      size="smedium"
    >
      {subtitle}
    </TruncatedText>
  );
};

const TopRow = ({ id, name, selected }) => (
  <CoinName
    paddingRight={selected ? undefined : 0}
    weight={selected ? 'semibold' : 'regular'}
  >
    {name || `#${id}`}
  </CoinName>
);

const CollectibleCoinIcon = magicMemo(
  ({
    asset_contract: { name },
    background,
    image_thumbnail_url,
    shouldPrioritizeImageLoading,
    ...props
  }) => {
    const { colors } = useTheme();
    return (
      <Centered>
        <RequestVendorLogoIcon
          backgroundColor={background || colors.lightestGrey}
          borderRadius={8}
          dappName={name}
          imageUrl={image_thumbnail_url}
          shouldPrioritizeImageLoading={shouldPrioritizeImageLoading}
          {...props}
        />
        <InnerBorder opacity={0.04} radius={8} zIndex={2} />
      </Centered>
    );
  },
  ['background', 'image_thumbnail_url']
);

CollectibleCoinIcon.propTypes = {
  asset_contract: PropTypes.shape({ name: PropTypes.string }),
  background: PropTypes.string,
  image_thumbnail_url: PropTypes.string,
  shouldPrioritizeImageLoading: PropTypes.bool,
};

const arePropsEqual = (props, nextProps) =>
  buildAssetUniqueIdentifier(props.item) !==
  buildAssetUniqueIdentifier(nextProps.item);

// eslint-disable-next-line react/display-name
const CollectiblesSendRow = React.memo(
  ({ item, isFirstRow, onPress, selected, testID, ...props }) => {
    const { colors } = useTheme();
    const subtitle = useMemo(
      () =>
        item.name
          ? `${item.asset_contract.name} #${item.id}`
          : item.asset_contract.name,

      [item.asset_contract.name, item.id, item.name]
    );

    return (
      <Fragment>
        {isFirstRow && (
          <Centered height={dividerHeight}>
            <Divider color={colors.rowDividerLight} />
          </Centered>
        )}
        <ButtonPressAnimation onPress={onPress} scaleTo={0.98}>
          <CoinRow
            {...props}
            {...item}
            bottomRowRender={BottomRow}
            coinIconRender={CollectibleCoinIcon}
            containerStyles={selected ? selectedStyles : null}
            selected={selected}
            subtitle={subtitle}
            testID={testID + item.name}
            topRowRender={TopRow}
          />
        </ButtonPressAnimation>
      </Fragment>
    );
  },
  arePropsEqual
);

CollectiblesSendRow.propTypes = {
  isFirstRow: PropTypes.bool,
  item: PropTypes.object,
  onPress: PropTypes.func,
  selected: PropTypes.bool,
  subtitle: PropTypes.string,
};

CollectiblesSendRow.dividerHeight = dividerHeight;
CollectiblesSendRow.selectedHeight = selectedHeight;

export default CollectiblesSendRow;
