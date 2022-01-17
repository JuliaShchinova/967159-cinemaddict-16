export const CARD_COUNT = 21;
export const MAX_DESCRIPTION_LENGTH = 140;
export const TEXT_LENGTH = 139;
export const MAX_COUNT = 5;
export const SORT_COUNT = 2;
export const MAX_RAITING = 10;
export const ACTORS_MAX_COUNT = 3;
export const MIN_RANGE = 1;
export const COMMENT_COUNT = 10;
export const STATISTIC_COUNT = 1;

export const ESCAPE = 'Escape';
export const ESC = 'Esc';
export const ENTER = 'Enter';

export const EMOTIONS = ['smile', 'sleeping', 'puke', 'angry'];

export const SortType = {
  DEFAULT: 'default',
  BY_DATE: 'by-date',
  BY_RAITING: 'by-rating',
};

export const UserAction = {
  UPDATE_STATS: 'UPDATE_STATS',
  ADD_COMMENT: 'ADD',
  DELETE_COMMENT: 'DELETE',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export const FilterType = {
  ALL: 'All movies',
  WATCHLIST: 'Watchlist',
  HISTORY: 'History',
  FAVORITES: 'Favorites',
};

export const Mode = {
  DEFAULT: 'DEFAULT',
  EDIT: 'EDIT'
};

export const MenuItem = {
  FILMS: 'FILMS',
  STATS: 'STATS',
};

export const userRank = {
  'None': {
    MIN: 0,
    MAX: 0
  },
  'Novice': {
    MIN: 1,
    MAX: 10
  },
  'Fan': {
    MIN: 11,
    MAX: 20
  },
  'Movie Buff': {
    MIN: 21,
    MAX: Infinity
  }
};

export const StatisticsType = {
  ALL: 'all-time',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

export const DateQuantity = {
  WEEK: 7,
  ANOTHER: 1
};
