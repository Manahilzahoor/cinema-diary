import { useEffect, useRef, useState } from "react";
import { Link } from "react-scroll";
import { useKey } from "./useKey";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";
import { useLocalstorageState } from "./useLocslStorageState";
const key = "1327d71f"; //use your own key please
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
export default function App() {
  const [query, setQuery] = useState("");
  const { movies, isLoading, error } = useMovies(query, handleCLoseMovie);
  const [selectedId, setSelectedID] = useState(null);

  const [watched, setWatched] = useLocalstorageState([], "watched");

  function handleSelectMovie(id) {
    console.log("Selected:", id);

    setSelectedID((selectedId) => (id === selectedId ? null : id));
  }
  function handleCLoseMovie() {
    setSelectedID(null);
  }
  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
    // localStorage.setItem("watched", JSON.stringify([...watched, movie]));
  }
  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }
  return (
    <>
      <Navbar />
      <section className="hero">
        <h1 className="hero-heading">
          Dive into the world of cinema — search your next favorite story.
        </h1>
        <div className="hero-content">
          <Search query={query} setQuery={setQuery} />
          <NumResults movies={movies} />
        </div>
      </section>

      <>
        {selectedId ? (
          <MovieDetails
            selectedId={selectedId}
            onCloseMovie={handleCLoseMovie}
            onAddWatched={handleAddWatched}
            watched={watched}
          />
        ) : (
          <>
            {isLoading && <Loader />}
            {!isLoading && !error && (
              <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
            )}
            {error && <ErrorMessage message={error} />}
          </>
        )}
      </>

      {
        <div className="watched-section watchlist">
          <WatchedSummary watched={watched} />
          <WatchedMoviesList
            watched={watched}
            onDeleteWatched={handleDeleteWatched}
          />
        </div>
      }

      <Footer />
    </>
  );
}

function Search({ query, setQuery }) {
  const inputEl = useRef(null);
  useKey("Enter", function () {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery("");
  });

  return (
    <>
      <input
        className="search"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        ref={inputEl}
      />
    </>
  );
}
function Navbar() {
  return (
    <nav className="nav-bar">
      <Logo />
      <Link to="watchlist" smooth={true} duration={500} className="nav-link">
        Watchlist
      </Link>
    </nav>
  );
}
function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies && movies.length ? movies.length : 0}</strong>{" "}
      results
    </p>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}
function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⚠️</span>
      {message}
    </p>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>CinemaDiary</h1>
    </div>
  );
}

function MovieList({ movies, onSelectMovie }) {
  return (
    <section className="Movies">
      <div className="movie-cards-container">
        {movies?.map((movie) => (
          <Movie
            movie={movie}
            key={movie.imdbID}
            onSelectMovie={onSelectMovie}
          />
        ))}
      </div>
    </section>
  );
}
function Movie({ movie, onSelectMovie }) {
  return (
    <div className="movie-card" onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <div className="movie-info">
        <h3>{movie.Title}</h3>
        <p>
          <span>🗓</span> {movie.Year}
        </p>
      </div>
    </div>
  );
}

function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");
  const countRef = useRef(0);

  useEffect(
    function () {
      if (userRating) countRef.current = countRef.current++;
    },
    [userRating]
  );

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
    Language: language, // 🆕
    Country: country, // 🆕
    Awards: awards, // 🆕
    BoxOffice: boxOffice, // 🆕
    Production: production, // 🆕
    Writer: writer, // 🆕
  } = movie;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      poster,
      year,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ")[0]),
      userRating,
      countRatingDecisions: countRef.current,
    };
    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  useKey("Backspace", onCloseMovie);

  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${key}&i=${selectedId}`
        );
        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }
      getMovieDetails();
    },
    [selectedId]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;
      return function () {
        document.title = "CinemaDiary";
      };
    },
    [title]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="details-overview">
          <button className="btn-back" onClick={onCloseMovie}>
            &larr;
          </button>
          <img src={poster} alt={`Poster of the ${title} movie`} />

          <div>
            <h2>{title}</h2>
            <p>
              {released} &bull; {runtime}
            </p>
            <p>
              <span>⭐</span>
              {imdbRating} IMDb rating
            </p>
            <p>
              <strong>Genre:</strong> {genre}
            </p>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />

                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      Add to List
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You rated this movie {watchedUserRating}
                  <span>🤩⭐</span>
                </p>
              )}
            </div>

            {/* 🧠 Plot */}
            <p>
              <em>{plot}</em>
            </p>

            {/* 🎭 Cast & Crew */}
            <p>
              <strong>Starring:</strong> {actors}
            </p>
            <p>
              <strong>Director:</strong> {director}
            </p>
            <p>
              <strong>Writer:</strong> {writer}
            </p>

            {/* 🏆 Awards & More */}
            {/* {awards && (
                  <p>
                    <strong>Awards:</strong> {awards}
                  </p>
                )} */}
            {language && (
              <p>
                <strong>Language:</strong> {language}
              </p>
            )}
            {country && (
              <p>
                <strong>Country:</strong> {country}
              </p>
            )}
            {/* {boxOffice && (
                  <p>
                    <strong>Box Office:</strong> {boxOffice}
                  </p>
                )}
                {production && (
                  <p>
                    <strong>Production:</strong> {production}
                  </p>
                )} */}
          </div>
        </div>
      )}
    </div>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="watched-summary">
      <h1>🎬 The Watchlist Chronicles</h1>

      <h2>🎬 Watched {watched.length} movies</h2>

      <p>
        <span>⭐️ IMDb avg:</span> {avgImdbRating.toFixed(2)}
      </p>
      <p>
        <span>🌟 Your avg:</span> {avgUserRating.toFixed(2)}
      </p>
      <p>
        <span> ⏳ Avg runtime:</span> {Math.round(avgRuntime)} min
      </p>
    </div>
  );
}

function WatchedMoviesList({ watched, onDeleteWatched }) {
  return (
    <div className="watched-grid">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </div>
  );
}
function WatchedMovie({ movie, onDeleteWatched }) {
  return (
    <div className="movie-card watched">
      <img
        src={movie.poster !== "N/A" ? movie.poster : "/fallback.jpg"}
        alt={`${movie.title} poster`}
      />
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p>
          <span>⭐️</span> {movie.imdbRating}
        </p>
        <p>
          <span>🌟</span> {movie.userRating}
        </p>
        <p>
          <span>⏳</span> {movie.runtime} min
        </p>
        <button
          className="remove-button"
          onClick={() => onDeleteWatched(movie.imdbID)}
        >
          X
        </button>
      </div>
    </div>
  );
}
function Footer() {
  return (
    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2025 CinemaDiary. All rights reserved.</p>
      </div>
    </footer>
  );
}
