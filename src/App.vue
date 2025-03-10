<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <header class="bg-purple-600 dark:bg-purple-800 shadow-lg">
      <div class="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
        <div class="flex items-center mb-4 md:mb-0">
          <img src="@/assets/logo.svg" alt="Logo" class="h-10 w-10 mr-2" />
          <h1 class="text-xl font-bold text-white">iTunes Top Albums</h1>
        </div>
        
        <nav>
          <ul class="flex space-x-4">
            <li>
              <router-link 
                to="/" 
                class="text-white hover:text-purple-200 py-2 px-3 rounded transition"
                active-class="bg-purple-700"
              >
                Home
              </router-link>
            </li>
            <li>
              <router-link 
                to="/favorites" 
                class="text-white hover:text-purple-200 py-2 px-3 rounded transition"
                active-class="bg-purple-700"
              >
                Favorites
              </router-link>
            </li>
            <li>
              <button 
                @click="toggleDarkMode" 
                class="text-white hover:text-purple-200 py-2 px-3 rounded transition"
                aria-label="Toggle dark mode"
              >
                <span v-if="isDarkMode">🌙</span>
                <span v-else>☀️</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>

    <main class="container mx-auto px-4 py-8">
      <router-view />
    </main>

    <footer class="bg-purple-600 dark:bg-purple-800 text-white py-4">
      <div class="container mx-auto px-4 text-center">
        <p>© {{ new Date().getFullYear() }} iTunes Top Albums. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue';

export default defineComponent({
  name: 'App',
  
  setup() {
    const isDarkMode = ref(false);
    
    const toggleDarkMode = () => {
      isDarkMode.value = !isDarkMode.value;
      localStorage.setItem('dark-mode', isDarkMode.value ? 'dark' : 'light');
      updateTheme();
    };
    
    const updateTheme = () => {
      if (isDarkMode.value) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    
    onMounted(() => {
      // Check for saved theme preference or use system preference
      const savedTheme = localStorage.getItem('dark-mode');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      isDarkMode.value = savedTheme === 'dark' || (savedTheme === null && prefersDark);
      updateTheme();
      
      // Listen for system preference changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (localStorage.getItem('dark-mode') === null) {
          isDarkMode.value = e.matches;
          updateTheme();
        }
      });
    });
    
    watch(isDarkMode, updateTheme);
    
    return { isDarkMode, toggleDarkMode };
  }
});
</script>