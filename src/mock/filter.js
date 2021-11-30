const filmFilterMap = {
  'All movies': (films) => films.filter((film) => film),
  'Watchlist': (films) => films.filter((film) => film.userDetails.isInWatchlist).length,
  'History': (films) => films.filter((film) => film.userDetails.isAlreadyWatched).length,
  'Favorites': (films) => films.filter((film) => film.userDetails.isFavorites).length
};

export const generateFilter = (films) => Object.entries(filmFilterMap).map(
  ([filterName, countFilms]) => ({
    name: filterName,
    count: countFilms(films),
  }),
);
