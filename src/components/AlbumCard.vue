<template>
  <div 
    class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-xl"
    :class="{ 'border-2 border-purple-500': album.isFavorite }"
  >
    <div class="relative pb-[100%]">
      <!-- Album cover image -->
      <img 
        :src="album.imageUrl" 
        :alt="`${album.name} by ${album.artist}`" 
        class="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      
      <!-- Favorite button -->
      <button 
        @click.stop="toggleFavorite" 
        class="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        :aria-label="album.isFavorite ? 'Remove from favorites' : 'Add to favorites'"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          :fill="album.isFavorite ? 'currentColor' : 'none'" 
          :stroke="album.isFavorite ? 'none' : 'currentColor'" 
          class="w-6 h-6"
          :class="album.isFavorite ? 'text-red-500' : 'text-gray-500'"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
          />
        </svg>
      </button>
    </div>
    
    <div class="p-4">
      <h3 
        class="font-bold text-lg mb-1 truncate" 
        :title="album.name"
      >
        {{ album.name }}
      </h3>
      
      <p 
        class="text-gray-600 dark:text-gray-400 truncate mb-2" 
        :title="album.artist"
      >
        {{ album.artist }}
      </p>
      
      <div class="flex justify-between items-center mt-4">
        <span class="text-purple-600 dark:text-purple-400 font-semibold">
          {{ album.price }}
        </span>
        
        <span class="text-sm text-gray-500 dark:text-gray-400">
          {{ formatReleaseDate(album.releaseDate) }}
        </span>
      </div>
      
      <div class="mt-2">
        <span class="inline-block bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
          {{ album.genre }}
        </span>
      </div>
      
      <a 
        :href="album.url" 
        target="_blank" 
        rel="noopener noreferrer" 
        class="block w-full mt-4 text-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition"
      >
        View on iTunes
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { useStore } from 'vuex';
import { AlbumViewModel } from '@/types/album';

export default defineComponent({
  name: 'AlbumCard',
  
  props: {
    album: {
      type: Object as PropType<AlbumViewModel>,
      required: true
    }
  },
  
  setup(props) {
    const store = useStore();
    
    const toggleFavorite = () => {
      store.dispatch('favorites/toggleFavorite', props.album);
    };
    
    const formatReleaseDate = (dateString: string): string => {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    };
    
    return {
      toggleFavorite,
      formatReleaseDate
    };
  }
});
</script>