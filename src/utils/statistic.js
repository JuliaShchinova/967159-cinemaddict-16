import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { StatisticsType } from './const';

dayjs.extend(isBetween);

const STATISTIC_COUNT = 1;

const DateForCompare = {
  TODAY: dayjs(Date.now()).toDate(),
  WEEK: dayjs().subtract(STATISTIC_COUNT, 'week').toDate(),
  MONTH: dayjs().subtract(STATISTIC_COUNT, 'month').toDate(),
  YEAR: dayjs().subtract(STATISTIC_COUNT, 'year').toDate(),
};

const statisticFilter = {
  [StatisticsType.ALL]: (films) => films.filter((film) => film),
  [StatisticsType.TODAY]: (films) => films.filter((film) => dayjs(film.userDetails.watchingDate).isSame(DateForCompare.TODAY, 'day')),
  [StatisticsType.WEEK]: (films) => films.filter((film) => dayjs(film.userDetails.watchingDate).isBetween(DateForCompare.WEEK, DateForCompare.TODAY, 'week', '[]')),
  [StatisticsType.MONTH]: (films) => films.filter((film) => dayjs(film.userDetails.watchingDate).isBetween(DateForCompare.MONTH, DateForCompare.TODAY, 'month', '[]')),
  [StatisticsType.YEAR]: (films) => films.filter((film) => dayjs(film.userDetails.watchingDate).isBetween(DateForCompare.YEAR, DateForCompare.TODAY, 'year', '[]')),
};

const getTotalDuration = (films) => {
  const totalDuration = films.map((film) => film.filmInfo.runtime).reduce((sum, current) => sum + current, 0);

  return totalDuration;
};

const getGenres = (films) => {
  const genresMap = {};

  films.map((film) => {
    film.filmInfo.genre.forEach((genre) => {
      if (genre in genresMap) {
        genresMap[genre] ++;
        return;
      }
      genresMap[genre] = 1;
    });
  });

  return genresMap;
};

const getTopGenre = (films) => {
  if (films.length === 0) {
    return '';
  }

  const genresMap = getGenres(films);
  const topGenre = Object.entries(genresMap).sort((a, b) => b[1] - a[1])[0][0];

  return topGenre;
};

export {
  statisticFilter,
  getTotalDuration,
  getGenres,
  getTopGenre
};
