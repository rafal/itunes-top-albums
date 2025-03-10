import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/tailwind.css'; // Assuming you'll set up Tailwind CSS

const app = createApp(App);

app.use(store);
app.use(router);

// Global error handler
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue Error:', err);
  console.error('Info:', info);
  
  // In production, you might want to send this to an error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Example: send to error tracking service
    // errorTrackingService.captureException(err);
  }
};

// Initialize favorites from localStorage when app starts
store.dispatch('favorites/initializeFavorites');

app.mount('#app');