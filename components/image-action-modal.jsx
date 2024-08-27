import { EvilIcons, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

const ImageActionModal = ({
  modalVisible,
  handleShare,
  handleDownload,
  handleSetting,
  handleBack,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [setting, setSetting] = useState(false);
  const [sharing, setSharing] = useState(false);

  const onDownload = async () => {
    setDownloading(true);
    await handleDownload();
    setDownloading(false);
  };

  const onShare = async () => {
    setSharing(true);
    await handleShare();
    setSharing(false);
  };

  const onSetting = async () => {
    setSetting(true);
    await handleSetting();
    setSetting(false);
  };

  return (
    <View
      style={[styles.container, { display: modalVisible ? 'flex' : 'none' }]}
    >
      <Pressable onPress={handleBack}>
        <EvilIcons name="close" size={26} color="white" />
      </Pressable>
      <Pressable onPress={onDownload}>
        {downloading ? (
          <ActivityIndicator size={26} color="white" />
        ) : (
          <Ionicons name="cloud-download-outline" size={24} color="white" />
        )}
      </Pressable>
      <Pressable onPress={onSetting}>
        {setting ? (
          <ActivityIndicator size={26} color="white" />
        ) : (
          <Ionicons name="settings-outline" size={24} color="white" />
        )}
      </Pressable>
      <Pressable onPress={onShare}>
        {sharing ? (
          <ActivityIndicator size={26} color="white" />
        ) : (
          <EvilIcons name="share-google" size={26} color="white" />
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
    backgroundColor: 'rgba(10, 10, 10, 0.8)',
  },
});
