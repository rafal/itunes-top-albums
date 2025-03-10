import { AlbumFeed, AlbumViewModel } from '@/types/album';

const API_URL = 'https://itunes.apple.com/us/rss/topalbums/limit=100/json';

// Helper function to safely get the album URL with proper typing
const getAlbumUrl = (album: any): string => {
  if (Array.isArray(album.link)) {
    const alternateLink = album.link.find((link: { attributes: { rel: string } }) => 
      link.attributes.rel === 'alternate'
    );
    return alternateLink?.attributes?.href || '';
  } else if (album.link && typeof album.link === 'object') {
    return album.link.attributes?.href || '';
  }
  return '';
};

export const fetchTopAlbums = async (): Promise<AlbumViewModel[]> => {
  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }
    
    const data: AlbumFeed = await response.json();
    
    return data.feed.entry.map(album => {
      // Get the largest image available
      const sortedImages = [...album['im:image']].sort((a, b) => 
        parseInt(b.attributes.height) - parseInt(a.attributes.height)
      );
      
      return {
        id: album.id.attributes['im:id'],
        name: album['im:name'].label,
        artist: album['im:artist'].label,
        artistUrl: album['im:artist'].attributes?.href,
        imageUrl: sortedImages[0].label,
        price: album['im:price'].label,
        releaseDate: album['im:releaseDate'].attributes.label,
        genre: album.category.attributes.label,
        url: getAlbumUrl(album),
        isFavorite: false
      };
    });
  } catch (error) {
    console.error('Error fetching top albums:', error);
    throw error;
  }
};

/**
 * Additional API call to fetch album details by ID (for future expansion)
 */
export const fetchAlbumDetails = async (albumId: string): Promise<any> => {
  try {
    const response = await fetch(`https://itunes.apple.com/lookup?id=${albumId}`);
    
    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching album details for ID ${albumId}:`, error);
    throw error;
  }
};