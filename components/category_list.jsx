import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';

import { CATEGORIES } from '../constants/app';
import { theme } from '../constants/theme';

const CategoryList = ({ selectedCategory, onSelectCategory }) => {
  return (
    <View>
      <FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.container}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <CategoryItem
            title={item}
            index={index}
            onPress={onSelectCategory}
            isSelected={selectedCategory === item}
          />
        )}
      />
    </View>
  );
};

const CategoryItem = ({ title, onPress, isSelected, index }) => (
  <Animated.View
    entering={FadeInRight.delay(index * 200)
      .duration(500)
      .springify()}
  >
    <TouchableOpacity
      style={[
        styles.categoryItem,
        isSelected ? styles.activeCategoryItem : null,
      ]}
      onPress={() => onPress(isSelected ? null : title)}
    >
      <Text
        style={[
          styles.categoryText,
          isSelected ? styles.activeCategoryText : null,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  </Animated.View>
);

export default CategoryList;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    gap: 5,
  },
  categoryItem: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.neutral(0.8),
    borderRadius: theme.radius.md,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  activeCategoryItem: {
    backgroundColor: theme.colors.neutral(0.8),
  },
  categoryText: {
    fontWeight: theme.fontWeight.bold,
  },
  activeCategoryText: {
    color: theme.colors.white,
  },
});
