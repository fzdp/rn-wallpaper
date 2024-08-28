import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';

import ImageActionModal from '@/components/image-action-modal';
import { wp } from '@/lib/common';
import { theme } from '@/constants/theme';

const ImageDetailScreen = () => {
  const [modalVisible, setModalVisible] = useState(true);

  const { ...imageItem } = useLocalSearchParams();
  const adjustedImageHeight = useMemo(
    () => (imageItem.webformatHeight / imageItem.webformatWidth) * wp(100),
    [imageItem.id],
  );

  const router = useRouter();

  const onImagePress = () => {
    setModalVisible(!modalVisible);
  };

  const onBack = useCallback(() => {
    setModalVisible(false);
    router.back();
  }, []);

  return (
    <View style={styles.rootContainer}>
      
      <Pressable onPress={onImagePress} style={styles.imageWrap}>
        <FastImage
          source={{ uri: imageItem.webformatURL }}
          style={[styles.image, { height: adjustedImageHeight }]}
        />
      </Pressable>
      <ImageActionModal
        modalVisible={modalVisible}
        handleBack={onBack}
        imageItem={imageItem}
      />
    </View>
  );
};

export default ImageDetailScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    height: '100%',
  },
  imageWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
  },
});
