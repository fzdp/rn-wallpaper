import * as FileSystem from 'expo-file-system';
import * as MediaLib from 'expo-media-library';
import { Alert, Dimensions, ToastAndroid } from 'react-native';

const { width, height } = Dimensions.get('window');

export const wp = (percentage) => {
  return (percentage * width) / 100;
};

export const hp = (percentage) => {
  return (percentage * height) / 100;
};

export const IMAGE_WIDTH = Dimensions.get('screen').width / 2;

export const getImageHeight = (width, height, currentWidth) => {
  return (height / width) * currentWidth;
};

export const downloadImage = async (imageUrl, filePath) => {
  try {
    const { uri } = await FileSystem.downloadAsync(imageUrl, filePath);
    return uri;
  } catch (error) {
    console.error('download failed', error);
    return null;
  }
};

export const showMessage = (message) => {
  ToastAndroid.showWithGravity(message, ToastAndroid.LONG, ToastAndroid.BOTTOM);
};

export const showAlert = (message) => {
  Alert.alert('Warning', message);
};

export const saveImageToAlbum = async (localImageUri, albumName) => {
  const available = await MediaLib.isAvailableAsync();
  if (!available) {
    showAlert('Media library is not avaiable');
    return null;
  }
  try {
    const asset = await MediaLib.createAssetAsync(localImageUri);
    const album = await MediaLib.getAlbumAsync(albumName);
    if (album === null) {
      await MediaLib.createAlbumAsync(albumName, asset, false);
    } else {
      await MediaLib.addAssetsToAlbumAsync([asset], album, true);
    }
    return asset;
  } catch (error) {
    showAlert(error.message);
    return null;
  }
};
