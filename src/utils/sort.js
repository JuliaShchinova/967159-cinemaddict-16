import dayjs from 'dayjs';

export const sortByDate = (a, b) => dayjs(b.release.date).diff(dayjs(a.release.date));

export const sortByRating = (a, b) => b.totalRating - a.totalRating;


