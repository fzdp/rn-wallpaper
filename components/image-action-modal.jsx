import { EvilIcons, Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { ALBUM } from '@/constants/app';
import { downloadImage, saveImageToAlbum, showMessage, wp } from '@/lib/common';
import { useFavoritesStore } from '@/store/favorites';
import { theme } from '@/constants/theme';

const ImageActionModal = ({ modalVisible, handleBack, imageItem }) => {
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  const addFavorite = useFavoritesStore((state) => state.addFavorite);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  const favoriteImages = useFavoritesStore((state) => state.favoriteImages);
  // const isFavorite = useFavoritesStore((state) => state.isFavorite);
  const isFavorite = !!favoriteImages[imageItem.id];

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
      const assetInfo = await MediaLibrary.getAssetInfoAsync(imageAttrs.asset);
      if (assetInfo) {
        return imageAttrs.asset;
      }
    }
    await ensureCacheExists();

    const asset = await saveImageToAlbum(imageAttrs.cachePath, ALBUM);
    imageAttrs.asset = asset;
    return asset;
  };

  const [downloading, setDownloading] = useState(false);
  const [setting, setSetting] = useState(false);
  const [sharing, setSharing] = useState(false);

  const onDownload = async () => {
    setDownloading(true);
    await ensureAssetExists();
    showMessage(`Saved to ${imageAttrs.asset.uri}`);
    setDownloading(false);
  };

  const onShare = async () => {
    setSharing(true);
    await ensureCacheExists();
    Sharing.shareAsync(imageAttrs.cachePath, {
      mimeType: `image/*`,
    });
    setSharing(false);
  };

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFavorite(imageItem.id);
    } else {
      addFavorite(imageItem.id, imageItem);
    }
  };

  const onSetting = async () => {
    setSetting(true);
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
    setSetting(false);
  };

  return (
    <View
      style={[styles.container, { display: modalVisible ? 'flex' : 'none' }]}
    >
      <Pressable onPress={handleBack}>
        <EvilIcons name="close" size={26} />
      </Pressable>
      <Pressable onPress={onDownload}>
        {downloading ? (
          <ActivityIndicator size={26} />
        ) : (
          <Ionicons name="cloud-download-outline" size={24} />
        )}
      </Pressable>
      <Pressable onPress={onSetting}>
        {setting ? (
          <ActivityIndicator size={26} />
        ) : (
          <Ionicons name="settings-outline" size={26} />
        )}
      </Pressable>
      <Pressable onPress={toggleFavorite}>
        {isFavorite ? (
          <Ionicons name="heart-sharp" size={24} color="red" />
        ) : (
          <Ionicons name="heart-outline" size={24} />
        )}
      </Pressable>
      <Pressable onPress={onShare}>
        {sharing ? (
          <ActivityIndicator size={26} />
        ) : (
          <EvilIcons name="share-google" size={26} />
        )}
      </Pressable>
    </View>
  );
};

export default ImageActionModal;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    paddingVertical: 20,
    justifyContent: 'space-around',
    flexDirection: 'row',
    color: 'black',
    backgroundColor: theme.colors.statusBar,
  },
});
