import { Module } from 'vuex';
import { AlbumViewModel } from '@/types/album';
import { fetchTopAlbums } from '@/services/api';

export interface AlbumsState {
  albums: AlbumViewModel[];
  filteredAlbums: AlbumViewModel[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedGenre: string;
  sortBy: 'name' | 'artist' | 'releaseDate';
  sortDirection: 'asc' | 'desc';
}

export const albums: Module<AlbumsState, any> = {
  namespaced: true,
  
  state: (): AlbumsState => ({
    albums: [],
    filteredAlbums: [],
    isLoading: false,
    error: null,
    searchQuery: '',
    selectedGenre: '',
    sortBy: 'name',
    sortDirection: 'asc'
  }),
  
  getters: {
    getAlbums: (state) => state.albums,
    getFilteredAlbums: (state) => state.filteredAlbums,
    isLoading: (state) => state.isLoading,
    getError: (state) => state.error,
    getUniqueGenres: (state) => {
      const genres = state.albums.map(album => album.genre);
      return ['All Genres', ...new Set(genres)];
    }
  },
  
  mutations: {
    SET_ALBUMS(state, albums: AlbumViewModel[]) {
      state.albums = albums;
      state.filteredAlbums = albums;
    },
    SET_FILTERED_ALBUMS(state, albums: AlbumViewModel[]) {
      state.filteredAlbums = albums;
    },
    SET_LOADING(state, isLoading: boolean) {
      state.isLoading = isLoading;
    },
    SET_ERROR(state, error: string | null) {
      state.error = error;
    },
    SET_SEARCH_QUERY(state, query: string) {
      state.searchQuery = query;
    },
    SET_SELECTED_GENRE(state, genre: string) {
      state.selectedGenre = genre;
    },
    SET_SORT_BY(state, sortBy: 'name' | 'artist' | 'releaseDate') {
      state.sortBy = sortBy;
    },
    SET_SORT_DIRECTION(state, direction: 'asc' | 'desc') {
      state.sortDirection = direction;
    },
    UPDATE_ALBUM_FAVORITE(state, { albumId, isFavorite }: { albumId: string, isFavorite: boolean }) {
      const albumIndex = state.albums.findIndex(album => album.id === albumId);
      if (albumIndex !== -1) {
        state.albums[albumIndex].isFavorite = isFavorite;
      }
      
      const filteredAlbumIndex = state.filteredAlbums.findIndex(album => album.id === albumId);
      if (filteredAlbumIndex !== -1) {
        state.filteredAlbums[filteredAlbumIndex].isFavorite = isFavorite;
      }
    }
  },
  
  actions: {
    async fetchAlbums({ commit, dispatch, rootGetters }) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      try {
        const albums = await fetchTopAlbums();
        
        // Merge with favorites data
        const favoriteIds = rootGetters['favorites/getFavoriteIds'];
        const albumsWithFavorites = albums.map(album => ({
          ...album,
          isFavorite: favoriteIds.includes(album.id)
        }));
        
        commit('SET_ALBUMS', albumsWithFavorites);
        dispatch('filterAlbums');
      } catch (error) {
        commit('SET_ERROR', error instanceof Error ? error.message : 'An unknown error occurred');
        console.error('Error in fetchAlbums action:', error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    setSearchQuery({ commit, dispatch }, query: string) {
      commit('SET_SEARCH_QUERY', query);
      dispatch('filterAlbums');
    },
    
    setSelectedGenre({ commit, dispatch }, genre: string) {
      commit('SET_SELECTED_GENRE', genre);
      dispatch('filterAlbums');
    },
    
    setSortBy({ commit, dispatch }, sortBy: 'name' | 'artist' | 'releaseDate') {
      commit('SET_SORT_BY', sortBy);
      dispatch('filterAlbums');
    },
    
    setSortDirection({ commit, dispatch }, direction: 'asc' | 'desc') {
      commit('SET_SORT_DIRECTION', direction);
      dispatch('filterAlbums');
    },
    
    filterAlbums({ commit, state }) {
      let filtered = [...state.albums];
      
      // Apply genre filter
      if (state.selectedGenre && state.selectedGenre !== 'All Genres') {
        filtered = filtered.filter(album => album.genre === state.selectedGenre);
      }
      
      // Apply search filter
      if (state.searchQuery) {
        const searchLower = state.searchQuery.toLowerCase();
        filtered = filtered.filter(album => 
          album.name.toLowerCase().includes(searchLower) || 
          album.artist.toLowerCase().includes(searchLower)
        );
      }
      
      // Apply sorting
      filtered.sort((a, b) => {
        let comparison = 0;
        
        switch (state.sortBy) {
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'artist':
            comparison = a.artist.localeCompare(b.artist);
            break;
          case 'releaseDate':
            comparison = new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
            break;
          default:
            comparison = 0;
        }
        
        return state.sortDirection === 'asc' ? comparison : -comparison;
      });
      
      commit('SET_FILTERED_ALBUMS', filtered);
    },
    
    updateAlbumFavorite({ commit }, { albumId, isFavorite }: { albumId: string, isFavorite: boolean }) {
      commit('UPDATE_ALBUM_FAVORITE', { albumId, isFavorite });
    }
  }
};