<template>
  <div>
    <div class="mb-8 flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold mb-2">Your Favorite Albums</h2>
        <p class="text-gray-600 dark:text-gray-400">
          Albums you've marked as favorites will appear here.
        </p>
      </div>
      
      <button
        v-if="hasFavorites"
        @click="confirmClearFavorites"
        class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
        </svg>
        Clear All
      </button>
    </div>
    
    <div v-if="!hasFavorites" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
      <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
      </svg>
      <h3 class="text-xl font-semibold mb-2">No favorite albums yet</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        Start adding albums to your favorites by clicking the heart icon on any album.
      </p>
      <router-link
        to="/"
        class="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition"
      >
        Browse Albums
      </router-link>
    </div>
    
    <AlbumList v-else favoritesOnly />
    
    <!-- Confirmation Modal -->
    <div v-if="showConfirmation" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-bold mb-4">Clear All Favorites?</h3>
        <p class="mb-6">Are you sure you want to remove all of your favorite albums? This action cannot be undone.</p>
        <div class="flex justify-end space-x-4">
          <button
            @click="showConfirmation = false"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            @click="clearFavorites"
            class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useStore } from 'vuex';
import AlbumList from '@/components/AlbumList.vue';

export default defineComponent({
  name: 'FavoritesView',
  
  components: {
    AlbumList
  },
  
  setup() {
    const store = useStore();
    const showConfirmation = ref(false);
    
    const hasFavorites = computed(() => {
      const favorites = store.getters['favorites/getFavoriteAlbums'];
      return favorites.length > 0;
    });
    
    const confirmClearFavorites = () => {
      showConfirmation.value = true;
    };
    
    const clearFavorites = () => {
      store.dispatch('favorites/clearAllFavorites');
      showConfirmation.value = false;
    };
    
    return {
      hasFavorites,
      showConfirmation,
      confirmClearFavorites,
      clearFavorites
    };
  }
});
</script>