const AUTHORIZATION = 'Basic 29bkmz2014';
const END_POINT = 'https://16.ecmascript.pages.academy/cinemaddict';

const SortType = {
  DEFAULT: 'default',
  BY_DATE: 'by-date',
  BY_RAITING: 'by-rating',
};

const UserAction = {
  UPDATE_STATS: 'UPDATE_STATS',
  ADD_COMMENT: 'ADD',
  DELETE_COMMENT: 'DELETE',
  INIT_COMMENTS: 'INIT_COMMENTS',
};

const UpdateType = {
  PATCH: 'PATCH',
  PART: 'PART',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const FilterType = {
  ALL: 'All movies',
  WATCHLIST: 'Watchlist',
  HISTORY: 'History',
  FAVORITES: 'Favorites',
};

const MenuItem = {
  FILMS: 'FILMS',
  STATS: 'STATS',
};

const userRank = {
  'None': {
    MIN: 0,
    MAX: 0,
  },
  'Novice': {
    MIN: 1,
    MAX: 10,
  },
  'Fan': {
    MIN: 11,
    MAX: 20,
  },
  'Movie Buff': {
    MIN: 21,
    MAX: Infinity,
  },
};

const StatisticsType = {
  ALL: 'all-time',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

export {
  AUTHORIZATION,
  END_POINT,
  SortType,
  UserAction,
  UpdateType,
  FilterType,
  MenuItem,
  userRank,
  StatisticsType
};
