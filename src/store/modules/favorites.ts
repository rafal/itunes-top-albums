import { Module } from 'vuex';
import { AlbumViewModel } from '@/types/album';

export interface FavoritesState {
  favoriteAlbums: AlbumViewModel[];
}

// LocalStorage key
const FAVORITES_STORAGE_KEY = 'itunes-top-albums-favorites';

// Helper function to load favorites from localStorage
const loadFavoritesFromStorage = (): string[] => {
  try {
    const favorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error loading favorites from localStorage:', error);
    return [];
  }
};

// Helper function to save favorites to localStorage
const saveFavoritesToStorage = (favoriteIds: string[]): void => {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds));
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error);
  }
};

export const favorites: Module<FavoritesState, any> = {
  namespaced: true,
  
  state: (): FavoritesState => ({
    favoriteAlbums: []
  }),
  
  getters: {
    getFavoriteAlbums: (state) => state.favoriteAlbums,
    getFavoriteIds: (state) => state.favoriteAlbums.map(album => album.id),
    isFavorite: (state) => (albumId: string) => {
      return state.favoriteAlbums.some(album => album.id === albumId);
    }
  },
  
  mutations: {
    SET_FAVORITES(state, albums: AlbumViewModel[]) {
      state.favoriteAlbums = albums;
    },
    ADD_FAVORITE(state, album: AlbumViewModel) {
      // Ensure we're not adding duplicates
      if (!state.favoriteAlbums.some(fav => fav.id === album.id)) {
        state.favoriteAlbums.push({
          ...album,
          isFavorite: true
        });
      }
    },
    REMOVE_FAVORITE(state, albumId: string) {
      state.favoriteAlbums = state.favoriteAlbums.filter(album => album.id !== albumId);
    }
  },
  
  actions: {
    initializeFavorites({ commit, rootState }) {
      const favoriteIds = loadFavoritesFromStorage();
      const { albums } = rootState.albums;
      
      if (albums && albums.length > 0) {
        // Get full album objects from IDs
        const favoriteAlbums = albums
          .filter(album => favoriteIds.includes(album.id))
          .map(album => ({ ...album, isFavorite: true }));
          
        commit('SET_FAVORITES', favoriteAlbums);
      }
    },
    
    toggleFavorite({ commit, getters, dispatch }, album: AlbumViewModel) {
      const isFavorite = getters.isFavorite(album.id);
      
      if (isFavorite) {
        commit('REMOVE_FAVORITE', album.id);
      } else {
        commit('ADD_FAVORITE', album);
      }
      
      // Update the album in the albums store
      dispatch('albums/updateAlbumFavorite', {
        albumId: album.id,
        isFavorite: !isFavorite
      }, { root: true });
      
      // Save to localStorage
      saveFavoritesToStorage(getters.getFavoriteIds);
    },
    
    clearAllFavorites({ commit }) {
      commit('SET_FAVORITES', []);
      saveFavoritesToStorage([]);
    }
  }
};