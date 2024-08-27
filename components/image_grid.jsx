import { MasonryFlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import React, { memo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';

import { ImageOrientation } from '../constants/app';
import { getImageHeight } from '../lib/common';

const ImageGrid = ({ images, imageOrientation }) => {
  const estimatedItemHeight = (orientation) => {
    switch (orientation) {
      case ImageOrientation.all:
        return 300;
      case ImageOrientation.horizontal:
        return 150;
      case ImageOrientation.vertical:
        return 260;
    }
  };
  return (
    <View style={styles.container}>
      <MasonryFlashList
        data={images}
        numColumns={2}
        estimatedItemSize={estimatedItemHeight(imageOrientation)}
        renderItem={({ item }) => <ImageGridItem image={item} />}
      />
    </View>
  );
};

const ImageGridItem = memo(
  ({ image }) => {
    const { width: ScreenWidth } = useWindowDimensions();
    const imageWidth = ScreenWidth / 2;
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    return (
      <Pressable
        style={styles.imageItem}
        onPress={() => {
          router.push({
            pathname: 'screens/image-detail-screen',
            params: image,
          });
        }}
      >
        <FastImage
          style={[
            {
              width: imageWidth,
              height: getImageHeight(
                image.imageWidth,
                image.imageHeight,
                imageWidth,
              ),
            },
            styles.image,
          ]}
          source={{ uri: image.webformatURL }}
          resizeMode={FastImage.resizeMode.contain}
          onLoadEnd={() => {
            setLoading(false);
          }}
        >
          {loading && <ActivityIndicator size={30} color="#669966" />}
        </FastImage>
      </Pressable>
    );
  },
  (oldProps, newProps) => oldProps.image.id === newProps.image.id,
);

export default ImageGrid;

const styles = StyleSheet.create({
  container: {
    minHeight: 10,
    width: '100%',
    paddingHorizontal: 5,
  },
  imageItem: {
    padding: 1,
  },
  image: {
    backgroundColor: 'rgba(10, 10, 10, 0.2)',
    justifyContent: 'center',
    borderRadius: 5,
  },
});
