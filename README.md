# CinemaDiary

CinemaDiary is a React web application that lets you search for movies, view details, and maintain your own watchlist. Powered by the OMDb API, it provides a smooth and interactive movie discovery experience.

## Features

- 🔍 **Search Movies:** Find movies by title using the OMDb API.
- ⭐ **Rate Movies:** Add your own ratings to movies you’ve watched.
- 📝 **Watchlist:** Keep track of movies you’ve watched, with persistent storage.
- 📊 **Statistics:** See average IMDb ratings, your ratings, and average runtime.
- 🎬 **Movie Details:** View detailed information about each movie, including cast, director, and plot.

## Demo

[Live Demo](https://Manahilzahoor.github.io/cinema-diary/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or newer recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/Manahilzahoor/cinema-diary.git
   cd cinema-diary
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Start the development server:**
   ```sh
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```sh
npm run build
```

The optimized build will be in the `build/` directory.

## Deployment

This project uses [gh-pages](https://www.npmjs.com/package/gh-pages) for deployment. To deploy:

```sh
npm run deploy
```

## Project Structure

```
src/
  App.js
  StarRating.js
  useMovies.js
  useKey.js
  useLocslStorageState.js
  ...
public/
  index.html
  ...
```

## Customization

- **OMDb API Key:**  
  The app uses a demo OMDb API key. For production, get your own key from [OMDb API](http://www.omdbapi.com/apikey.aspx) and update it in [`src/App.js`](src/App.js) and [`src/useMovies.js`](src/useMovies.js).

## License

This project is licensed under the MIT License.

---

Made with 🍿 by [Manahil Zahoor](https://github.com/Manahilzahoor)
