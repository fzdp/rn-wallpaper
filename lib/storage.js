import { MMKV } from 'react-native-mmkv';

export const appStorage = new MMKV({
  id: 'wallpaper-mmkv',
});

export const zustandStorage = {
  setItem: (name, value) => {
    return appStorage.set(name, value);
  },
  getItem: (name) => {
    const value = appStorage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    return appStorage.delete(name);
  },
};
