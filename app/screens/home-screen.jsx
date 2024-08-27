import { EvilIcons, Ionicons, Feather } from '@expo/vector-icons';
import { debounce } from 'lodash';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';

import CategoryList from '../../components/category_list';
import ImageGrid from '../../components/image_grid';
import { ImageOrientation, OrderParam } from '../../constants/app';
import { theme } from '../../constants/theme';
import { fetchImages } from '../../lib/api';

let currentPage = 1;

const HomeScreen = () => {
  const [query, setQuery] = useState('');
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

  const onPressHeaderIcon = () => {
    scrollTop();
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: 10 }]}>
      <View style={styles.header}>
        <Pressable onPress={onPressHeaderIcon}>
          <Feather name="sun" size={26} color="black" />
        </Pressable>
        <Pressable>
          <Ionicons name="filter" size={24} color={theme.colors.neutral(0.7)} />
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
          {!isEmptyData && <ActivityIndicator size="large" />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,
  },
  header: {
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
