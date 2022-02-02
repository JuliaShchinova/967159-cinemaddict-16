import dayjs from 'dayjs';

const addClass = (className) => (detail) => detail ? className : '';

const getUserRank = (count, rank = {}) => Object.keys(rank).find((key) => count >= rank[key].MIN && count <= rank[key].MAX);

const sortByDate = (a, b) => dayjs(b.filmInfo.release.date).diff(dayjs(a.filmInfo.release.date));

const sortByRating = (a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating;

export {
  addClass,
  getUserRank,
  sortByDate,
  sortByRating
};
