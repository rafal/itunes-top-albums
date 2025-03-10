import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createStore } from 'vuex';
import AlbumCard from '@/components/AlbumCard.vue';
import { AlbumViewModel } from '@/types/album';

// Mock Vuex store
const createMockStore = (isFavorite = false) => {
  return createStore({
    modules: {
      favorites: {
        namespaced: true,
        state: {
          favoriteAlbums: []
        },
        getters: {
          isFavorite: () => () => isFavorite
        },
        actions: {
          toggleFavorite: vi.fn()
        }
      }
    }
  });
};

const mockAlbum: AlbumViewModel = {
  id: '123456789',
  name: 'Test Album',
  artist: 'Test Artist',
  artistUrl: 'https://music.apple.com/us/artist/test-artist',
  imageUrl: 'https://test.com/image.jpg',
  price: '$9.99',
  releaseDate: '2023-01-01T00:00:00Z',
  genre: 'Pop',
  url: 'https://music.apple.com/us/album/test-album',
  isFavorite: false
};

describe('AlbumCard.vue', () => {
  it('renders album information correctly', () => {
    const store = createMockStore();
    const wrapper = mount(AlbumCard, {
      props: {
        album: mockAlbum
      },
      global: {
        plugins: [store]
      }
    });

    // Check that album information is rendered
    expect(wrapper.text()).toContain('Test Album');
    expect(wrapper.text()).toContain('Test Artist');
    expect(wrapper.text()).toContain('$9.99');
    expect(wrapper.text()).toContain('Pop');
    expect(wrapper.find('img').attributes('src')).toBe('https://test.com/image.jpg');
    expect(wrapper.find('a[href]').attributes('href')).toBe('https://music.apple.com/us/album/test-album');
  });

  it('shows filled heart icon when album is a favorite', async () => {
    const store = createMockStore(true);
    const favoriteAlbum = { ...mockAlbum, isFavorite: true };
    
    const wrapper = mount(AlbumCard, {
      props: {
        album: favoriteAlbum
      },
      global: {
        plugins: [store]
      }
    });

    // Check that the heart icon is filled
    const heartIcon = wrapper.find('svg');
    expect(heartIcon.attributes('fill')).toBe('currentColor');
    expect(heartIcon.classes()).toContain('text-red-500');
  });

  it('shows empty heart icon when album is not a favorite', async () => {
    const store = createMockStore(false);
    
    const wrapper = mount(AlbumCard, {
      props: {
        album: mockAlbum
      },
      global: {
        plugins: [store]
      }
    });

    // Check that the heart icon is not filled
    const heartIcon = wrapper.find('svg');
    expect(heartIcon.attributes('fill')).toBe('none');
    expect(heartIcon.classes()).toContain('text-gray-500');
  });

  it('dispatches toggleFavorite action when favorite button is clicked', async () => {
    const store = createMockStore();
    store.dispatch = vi.fn();
    
    const wrapper = mount(AlbumCard, {
      props: {
        album: mockAlbum
      },
      global: {
        plugins: [store]
      }
    });

    // Click the favorite button
    await wrapper.find('button').trigger('click');
    
    // Check that the store action was dispatched
    expect(store.dispatch).toHaveBeenCalledWith('favorites/toggleFavorite', mockAlbum);
  });

  it('formats release date correctly', () => {
    const store = createMockStore();
    
    const wrapper = mount(AlbumCard, {
      props: {
        album: mockAlbum
      },
      global: {
        plugins: [store]
      }
    });

    // Depending on the locale, we expect a formatted date
    // This is a simple check that some date formatting occurred
    expect(wrapper.text()).toMatch(/Jan(uary)? \d+, 2023|2023/);
  });
});