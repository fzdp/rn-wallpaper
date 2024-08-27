import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { theme } from '../constants/theme';

const WelcomeScreen = () => {
  const router = useRouter();

  const goHome = () => {
    router.replace('screens/home-screen');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={require('../assets/images/splash-screen.jpg')}
        style={styles.imageBg}
        resizeMode="cover"
      />
      <Animated.View entering={FadeInDown.duration(600)} style={{ flex: 1 }}>
        <LinearGradient
          colors={[
            'rgba(255,255,255,0)',
            'rgba(255,255,255,0.5)',
            'white',
            'white',
          ]}
          style={styles.gradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.8 }}
        />

        <View style={styles.contentContainer}>
          <Animated.Text
            style={styles.title}
            entering={FadeInDown.delay(300).springify()}
          >
            美好的事物，就在前方
          </Animated.Text>
          <Animated.View>
            <Pressable
              onPress={goHome}
              style={styles.btnStart}
              entering={FadeInDown.delay(500).springify()}
            >
              <Text style={styles.buttonTitle}>进入</Text>
            </Pressable>
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBg: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradient: {
    width: '100%',
    height: '65%',
    position: 'absolute',
    bottom: 0,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: theme.fontWeight.bold,
    marginBottom: 30,
  },
  btnStart: {
    backgroundColor: theme.colors.neutral(0.8),
    paddingVertical: 20,
    paddingHorizontal: 100,
    marginBottom: 50,
    borderRadius: 26,
  },
  buttonTitle: {
    color: 'white',
    fontWeight: theme.fontWeight.medium,
    fontSize: 20,
    letterSpacing: 10,
  },
});
