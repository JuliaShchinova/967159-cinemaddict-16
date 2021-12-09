import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import { getRandomInteger } from './common';

dayjs.extend(duration);

export const generateDate = (min, max) => {
  const year = getRandomInteger(min, max);
  const month = getRandomInteger(1, 12);
  const day = getRandomInteger(1, 29);

  const date = [year, month, day].join('-');

  return dayjs(date).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
};

export const getFormatDate = (date, format) => dayjs(date).format(format);

export const getDurationTime = (time, type) => {
  const { hours, minutes } = dayjs.duration(time, type).$d;

  return `${hours}h ${minutes}m`;
};
