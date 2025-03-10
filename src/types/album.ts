export interface Album {
  id: {
    attributes: {
      'im:id': string;
    };
  };
  'im:name': {
    label: string;
  };
  'im:artist': {
    label: string;
    attributes?: {
      href: string;
    };
  };
  'im:image': Array<{
    label: string;
    attributes: {
      height: string;
    };
  }>;
  'im:itemCount': {
    label: string;
  };
  'im:price': {
    label: string;
    attributes: {
      amount: string;
      currency: string;
    };
  };
  'im:releaseDate': {
    label: string;
    attributes: {
      label: string;
    };
  };
  rights?: {
    label: string;
  };
  category: {
    attributes: {
      'im:id': string;
      term: string;
      scheme: string;
      label: string;
    };
  };
  'im:contentType': {
    attributes: {
      term: string;
      label: string;
    };
  };
  link: Array<{
    attributes: {
      rel: string;
      type: string;
      href: string;
    };
  }>;
}

export interface AlbumFeed {
  feed: {
    author: {
      name: {
        label: string;
      };
      uri: {
        label: string;
      };
    };
    entry: Album[];
    updated: {
      label: string;
    };
    rights: {
      label: string;
    };
    title: {
      label: string;
    };
    icon: {
      label: string;
    };
    link: Array<{
      attributes: {
        rel: string;
        type?: string;
        href: string;
      };
    }>;
    id: {
      label: string;
    };
  };
}

export interface AlbumViewModel {
  id: string;
  name: string;
  artist: string;
  artistUrl?: string;
  imageUrl: string;
  price: string;
  releaseDate: string;
  genre: string;
  url: string;
  isFavorite: boolean;
}