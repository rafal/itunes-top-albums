import { createStore } from 'vuex';
import { albums } from './modules/albums';
import { favorites } from './modules/favorites';

export default createStore({
  modules: {
    albums,
    favorites
  }
});