import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import ImageGrid from '@/components/image-grid';
import { useFavoritesStore } from '@/store/favorites';

const Favorites = () => {
  const favoriteImages = useFavoritesStore((state) => state.favoriteImages);
  const imageItems = Object.values(favoriteImages);

  return (
    <View style={styles.container}>
      <ScrollView>
        <ImageGrid images={imageItems} />
      </ScrollView>
    </View>
  );
};

export default Favorites;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10
  },
});
