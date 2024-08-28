import {
  EvilIcons,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { debounce } from 'lodash';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  Text,
} from 'react-native';
import FastImage from 'react-native-fast-image';

import CategoryList from '@/components/category_list';
import ImageGrid from '@/components/image-grid';
import { ImageOrientation, OrderParam } from '@/constants/app';
import { theme } from '@/constants/theme';
import { fetchImages } from '@/lib/api';

let currentPage = 1;

const HomeScreen = () => {
  const [query, setQuery] = useState('');
  const navigation = useNavigation();
  const [orientation, setOrientation] = useState(ImageOrientation.all);
  const [order, setOrder] = useState(OrderParam.latest);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmptyData, setIsEmptyData] = useState(false);
  const [images, setImages] = useState([]);
  const searchInputRef = useRef(null);
  const imageScrollViewRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const onSelectCategory = (category) => {
    currentPage = 1;
    setSelectedCategory(category);
  };

  const loadImages = async (append = false) => {
    setIsLoading(true);
    const params = { page: currentPage, order, orientation };
    if (query) params.q = query;
    if (selectedCategory) params.category = selectedCategory;

    console.log(params);

    const data = await fetchImages(params);

    if (data.length) {
      const imageUris = data.map((img) => ({ uri: img.webformatURL }));
      FastImage.preload(imageUris);
    }

    if (append) {
      setImages([...images, ...data]);
    } else {
      setImages(data);
      scrollTop();
    }
    setIsLoading(false);
    setIsEmptyData(data.length === 0);
  };

  useEffect(() => {
    loadImages();
  }, [query, selectedCategory]);

  const onQueryChange = (text) => {
    if (text.length < 2) {
      return;
    }
    currentPage = 1;
    setQuery(text);
  };

  const onQueryChangeDebounce = useCallback(debounce(onQueryChange, 800), []);

  const onClearQuery = () => {
    currentPage = 1;
    setQuery('');
    searchInputRef.current.clear();
  };

  const onImageListScroll = async ({ nativeEvent }) => {
    const { contentSize, layoutMeasurement, contentOffset } = nativeEvent;
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 10) {
      if (!isLoading && !isEmptyData) {
        currentPage += 1;
        await loadImages(true);
      }
    }
  };

  const scrollTop = () => {
    imageScrollViewRef.current.scrollTo({
      y: -20,
      animated: true,
    });
  };

  const onPressHeaderTitle = () => {
    scrollTop();
  };

  const toggleDrawer = () => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={toggleDrawer}>
          <MaterialCommunityIcons name="menu" size={24} />
        </Pressable>
        <Pressable onPress={onPressHeaderTitle}>
          <Text style={{ fontSize: 20 }}>首页</Text>
        </Pressable>
        <Pressable>
          <Ionicons name="filter" size={24} />
        </Pressable>
      </View>

      <View style={styles.seachBarContainer}>
        <View style={styles.searchIcon}>
          <EvilIcons name="search" size={24} color="black" />
        </View>
        <TextInput
          style={styles.searchInput}
          ref={searchInputRef}
          onChangeText={onQueryChangeDebounce}
          placeholder=""
        />
        {query.length > 1 && (
          <Pressable style={styles.closeIcon} onPress={onClearQuery}>
            <Ionicons name="close-outline" size={24} color="black" />
          </Pressable>
        )}
      </View>

      <View style={styles.categoryContainer}>
        <CategoryList
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
        />
      </View>

      <ScrollView
        style={styles.imageContainer}
        onScroll={onImageListScroll}
        ref={imageScrollViewRef}
        scrollEventThrottle={10}
      >
        <ImageGrid images={images} imageOrientation={orientation} />
        <View
          style={[
            styles.loadingItem,
            { marginTop: images.length > 0 ? 10 : 70 },
          ]}
        >
          {!isEmptyData && (
            <ActivityIndicator size="large" color={theme.colors.loading} />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.statusBar,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: theme.fontWeight.semibold,
  },
  seachBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    borderColor: theme.colors.gray,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderRadius: theme.radius.lg,
  },
  searchIcon: {
    paddingLeft: 6,
    paddingBottom: 4,
  },
  searchInput: {
    flex: 1,
    padding: 6,
    fontSize: 18,
  },
  closeIcon: {
    paddingRight: 8,
  },
  imageContainer: {
    // paddingBottom: 10,
  },
  loadingItem: {
    marginBottom: 20,
  },
});
