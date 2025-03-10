<template>
  <div>
    <div class="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <div class="flex flex-col md:flex-row gap-4">
        <!-- Search input -->
        <div class="flex-1">
          <label for="search" class="sr-only">Search albums</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
            </div>
            <input
              id="search"
              type="text"
              v-model="searchQuery"
              placeholder="Search by album or artist name..."
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        </div>
        
        <!-- Genre filter -->
        <div class="md:w-1/4">
          <label for="genre-filter" class="sr-only">Filter by genre</label>
          <select
            id="genre-filter"
            v-model="selectedGenre"
            class="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option v-for="genre in genres" :key="genre" :value="genre">
              {{ genre }}
            </option>
          </select>
        </div>
        
        <!-- Sort options -->
        <div class="md:w-1/4">
          <label for="sort-by" class="sr-only">Sort by</label>
          <div class="relative">
            <select
              id="sort-by"
              v-model="sortBy"
              class="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="name">Album Name</option>
              <option value="artist">Artist</option>
              <option value="releaseDate">Release Date</option>
            </select>
          </div>
        </div>
        
        <!-- Sort direction toggle -->
        <button
          @click="toggleSortDirection"
          class="inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          title="Toggle sort direction"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            :class="{ 'transform rotate-180': sortDirection === 'desc' }"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Albums grid -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="spinner"></div>
    </div>
    
    <div v-else-if="error" class="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded">
      <p>{{ error }}</p>
      <button 
        @click="retryFetch" 
        class="mt-2 bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
      >
        Retry
      </button>
    </div>
    
    <div v-else>
      <p v-if="filteredAlbums.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
        No albums found matching your search criteria.
      </p>
      
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <AlbumCard
          v-for="album in filteredAlbums"
          :key="album.id"
          :album="album"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import AlbumCard from './AlbumCard.vue';

export default defineComponent({
  name: 'AlbumList',
  
  components: {
    AlbumCard
  },
  
  props: {
    favoritesOnly: {
      type: Boolean,
      default: false
    }
  },
  
  setup(props) {
    const store = useStore();
    
    const searchQuery = ref('');
    const selectedGenre = ref('All Genres');
    const sortBy = ref<'name' | 'artist' | 'releaseDate'>('name');
    const sortDirection = ref<'asc' | 'desc'>('asc');
    
    const isLoading = computed(() => store.getters['albums/isLoading']);
    const error = computed(() => store.getters['albums/getError']);
    const genres = computed(() => store.getters['albums/getUniqueGenres']);
    
    const filteredAlbums = computed(() => {
      if (props.favoritesOnly) {
        return store.getters['favorites/getFavoriteAlbums'];
      } else {
        return store.getters['albums/getFilteredAlbums'];
      }
    });
    
    const updateSearchQuery = () => {
      store.dispatch('albums/setSearchQuery', searchQuery.value);
    };
    
    const updateSelectedGenre = () => {
      store.dispatch('albums/setSelectedGenre', selectedGenre.value);
    };
    
    const updateSortBy = () => {
      store.dispatch('albums/setSortBy', sortBy.value);
    };
    
    const toggleSortDirection = () => {
      const newDirection = sortDirection.value === 'asc' ? 'desc' : 'asc';
      sortDirection.value = newDirection;
      store.dispatch('albums/setSortDirection', newDirection);
    };
    
    const retryFetch = () => {
      store.dispatch('albums/fetchAlbums');
    };
    
    // Watch for changes in search, filter, and sort controls
    watch(searchQuery, updateSearchQuery);
    watch(selectedGenre, updateSelectedGenre);
    watch(sortBy, updateSortBy);
    
    onMounted(() => {
      if (!props.favoritesOnly && store.state.albums.albums.length === 0) {
        store.dispatch('albums/fetchAlbums');
      }
    });
    
    return {
      searchQuery,
      selectedGenre,
      sortBy,
      sortDirection,
      isLoading,
      error,
      genres,
      filteredAlbums,
      toggleSortDirection,
      retryFetch
    };
  }
});
</script>

<style scoped>
.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #a855f7;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.dark .spinner {
  border-color: rgba(255, 255, 255, 0.1);
  border-left-color: #a855f7;
}
</style>