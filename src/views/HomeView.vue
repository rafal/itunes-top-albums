<template>
  <div>
    <div class="mb-8">
      <h2 class="text-2xl font-bold mb-2">Top 100 Albums on iTunes</h2>
      <p class="text-gray-600 dark:text-gray-400">
        Browse, search, and favorite the current top 100 albums on iTunes. Click on an album to view more details on the iTunes store.
      </p>
    </div>
    
    <AlbumList />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AlbumList from '@/components/AlbumList.vue';

export default defineComponent({
  name: 'HomeView',
  
  components: {
    AlbumList
  }
});
</script>