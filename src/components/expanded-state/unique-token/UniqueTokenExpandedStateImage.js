import { endsWith } from 'lodash';
import React from 'react';
import styled from 'styled-components';
import { useDimensions, useImageMetadata } from '../../../hooks';
import { magicMemo } from '../../../utils';
import { Centered } from '../../layout';
import { UniqueTokenImage } from '../../unique-token';
import { Container } from '@cardstack/components';
import { margin, position } from '@rainbow-me/styles';

const paddingHorizontal = 19;

const ImageWrapper = styled(Centered)`
  ${({ isImageHuge }) => margin(isImageHuge ? paddingHorizontal : 0, 0)};
  ${position.size('100%')};
  border-radius: 10;
  overflow: hidden;
`;

const UniqueTokenExpandedStateImage = ({ asset }) => {
  const { width: deviceWidth } = useDimensions();

  const isSVG = endsWith(asset.image_url, '.svg');
  const imageUrl = isSVG ? asset.image_preview_url : asset.image_url;

  const { dimensions: imageDimensions } = useImageMetadata(imageUrl);

  const maxImageWidth = deviceWidth - paddingHorizontal * 2;
  const maxImageHeight = maxImageWidth * 1.5;

  const heightForDeviceSize =
    (maxImageWidth * imageDimensions.height) / imageDimensions.width;

  const containerHeight =
    heightForDeviceSize > maxImageHeight ? maxImageWidth : heightForDeviceSize;

  return (
    <Container
      alignItems="center"
      borderRadius={20}
      height={containerHeight}
      justifyContent="center"
      marginVertical={4}
      style={{ paddingHorizontal }}
    >
      <ImageWrapper isImageHuge={heightForDeviceSize > maxImageHeight}>
        <UniqueTokenImage
          backgroundColor={asset.background}
          imageUrl={imageUrl}
          item={asset}
          resizeMode="contain"
        />
      </ImageWrapper>
    </Container>
  );
};

export default magicMemo(UniqueTokenExpandedStateImage, 'asset.uniqueId');
