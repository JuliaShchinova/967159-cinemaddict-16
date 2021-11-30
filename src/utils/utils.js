import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';

dayjs.extend(duration);

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomWithFloat = (a = 1, b = 0) => {
  const lower = Math.min(a, b);
  const upper = Math.max(a, b);
  return lower + Math.random() * (upper - lower);
};

const shuffle = (arr) => {
  const newArr = [...arr];

  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }

  return newArr;
};

const getRandomArray = (arr, minRange, maxRange) => {
  const newArray = shuffle(arr);

  return newArray.slice(0, getRandomInteger(minRange, maxRange));
};

const generateDate = (min, max) => {
  const year = getRandomInteger(min, max);
  const month = getRandomInteger(1, 12);
  const day = getRandomInteger(1, 29);

  const date = [year, month, day].join('-');

  return dayjs(date).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
};

const getFormatDate = (date, format) => dayjs(date).format(format);

const getDurationTime = (time, type) => {
  const { hours, minutes } = dayjs.duration(time, type).$d;

  return `${hours}h ${minutes}m`;
};

const addActiveClass = (active) => {
  const checkDetail = (detail) => {
    const className = detail ? active : '';
    return className;
  };

  return checkDetail;
};

export { getRandomInteger, getRandomWithFloat, getRandomArray, generateDate, getDurationTime, getFormatDate, addActiveClass };
