import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { zustandStorage } from '@/lib/storage';

export const useFavoritesStore = create(
  persist(
    immer((set, get) => ({
      favoriteImages: {},
      addFavorite: (imageId, imageItem) => {
        set((state) => {
          state.favoriteImages[imageId] = imageItem;
          console.log(state.favoriteImages);
        });
      },
      removeFavorite: (imageId) => {
        set((state) => {
          delete state.favoriteImages[imageId];
          console.log(state.favoriteImages);
        });
      },
    })),
    {
      name: 'zustand-favorites',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
