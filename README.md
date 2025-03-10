# iTunes Top Albums

A responsive web application that displays the top 100 albums based on iTunes API, built with TypeScript and Vue 3.

![Screenshot](./screenshot.png)

## Features

- Display top 100 albums from iTunes API
- Responsive design using Tailwind CSS
- Dark/light mode support
- Search functionality
- Filter by genre
- Sort by album name, artist, or release date
- "Favorite" functionality with local storage persistence
- Cross-browser compatibility

## Tech Stack

- **Language**: TypeScript
- **Framework**: Vue 3 with Composition API
- **State Management**: Vuex 4
- **Routing**: Vue Router 4
- **CSS Framework**: Tailwind CSS
- **Build Tool**: Vite
- **Testing**: Vitest for unit testing, Cypress for E2E testing
- **Linting**: ESLint
- **API**: iTunes API

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/itunes-top-albums.git
cd itunes-top-albums

# Install dependencies
npm install
# or
yarn install
```

### Development

```bash
# Start development server
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`.

### Building for Production

```bash
# Build for production
npm run build
# or
yarn build
```

### Testing

```bash
# Run unit tests
npm run test
# or
yarn test

# Run unit tests with coverage
npm run test:coverage
# or
yarn test:coverage

# Run E2E tests
npm run test:e2e
# or
yarn test:e2e
```

### Linting

```bash
# Lint code
npm run lint
# or
yarn lint

# Fix linting issues
npm run lint:fix
# or
yarn lint:fix
```

## Project Structure

```
itunes-top-albums/
├── public/                   # Static assets
├── src/
│   ├── assets/               # Images, fonts, global CSS
│   ├── components/           # Vue components
│   ├── views/                # Page components
│   ├── router/               # Routing configuration
│   ├── store/                # Vuex store modules
│   ├── services/             # API and other services
│   ├── types/                # TypeScript types
│   ├── utils/                # Utility functions
│   ├── App.vue               # Root component
│   └── main.ts               # Application entry point
├── tests/
│   ├── unit/                 # Unit tests
│   └── e2e/                  # End-to-end tests
└── ...configuration files
```

## Additional Features

This application includes a special feature for music discovery, described in the [FEATURE.md](./FEATURE.md) file.

## Browser Support

The application is tested and works on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Acknowledgments

- iTunes API for providing album data
- Vue team for the excellent framework
- Tailwind CSS team for the styling utilities