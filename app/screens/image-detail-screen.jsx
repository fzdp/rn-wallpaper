import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import * as MediaLib from 'expo-media-library';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React, { useCallback, useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';

import ImageActionModal from '../../components/image-action-modal';
import { ALBUM } from '../../constants/app';
import {
  downloadImage,
  saveImageToAlbum,
  showMessage,
  wp,
} from '../../lib/common';

const ImageDetailScreen = () => {
  const [modalVisible, setModalVisible] = useState(true);
  const [permissionResponse, requestPermission] = MediaLib.usePermissions();

  const { ...imageItem } = useLocalSearchParams();
  const imageAttrs = useMemo(() => {
    const extension = imageItem.largeImageURL.split('.').pop().toLowerCase();
    const name =
      imageItem.pageURL.split('/').slice(-2, -1)[0] + '.' + extension;
    return {
      extension,
      name,
      adjustedImageHeight:
        (imageItem.webformatHeight / imageItem.webformatWidth) * wp(100),
      cachePath: `${FileSystem.cacheDirectory}${name}`,
      asset: null,
    };
  }, [imageItem.id]);

  const router = useRouter();

  const onImagePress = () => {
    setModalVisible(!modalVisible);
  };

  const ensureCacheExists = async () => {
    const res = await FileSystem.getInfoAsync(imageAttrs.cachePath);
    if (!res.exists) {
      const localUri = await downloadImage(
        imageItem.largeImageURL,
        imageAttrs.cachePath,
      );
      if (localUri === null) {
        throw new Error('download failed');
      }
    }
  };

  const ensureAssetExists = async () => {
    if (permissionResponse.status !== 'granted') {
      await requestPermission();
    }

    if (imageAttrs.asset) {
      const assetInfo = await MediaLib.getAssetInfoAsync(imageAttrs.asset);
      if (assetInfo) {
        return imageAttrs.asset;
      }
    }
    await ensureCacheExists();

    const asset = await saveImageToAlbum(imageAttrs.cachePath, ALBUM);
    imageAttrs.asset = asset;
    return asset;
  };

  const onShare = async () => {
    await ensureCacheExists();
    Sharing.shareAsync(imageAttrs.cachePath, {
      mimeType: `image/*`,
    });
  };

  const onDownload = async () => {
    await ensureAssetExists();
    showMessage(`Saved to ${imageAttrs.asset.uri}`);
  };

  const onBack = useCallback(() => {
    setModalVisible(false);
    router.back();
  }, []);

  const onSetAction = async () => {
    await ensureCacheExists();
    if (Platform.OS === 'android') {
      const contentUri = await FileSystem.getContentUriAsync(
        imageAttrs.cachePath,
      );
      console.log(contentUri);

      await IntentLauncher.startActivityAsync(
        'android.intent.action.ATTACH_DATA',
        {
          data: contentUri,
          type: 'image/*',
          flags: 1,
        },
      );
    }
  };

  return (
    <View style={styles.rootContainer}>
      <Pressable onPress={onImagePress} style={styles.imageWrap}>
        <FastImage
          source={{ uri: imageItem.webformatURL }}
          style={[styles.image, { height: imageAttrs.adjustedImageHeight }]}
        />
      </Pressable>
      <ImageActionModal
        modalVisible={modalVisible}
        handleShare={onShare}
        handleDownload={onDownload}
        handleBack={onBack}
        handleSetting={onSetAction}
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
