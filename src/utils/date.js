import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const getFormatDate = (date, format) => dayjs(date).format(format);

const getDurationTime = (time, type) => {
  const { hours, minutes } = dayjs.duration(time, type).$d;

  return `${hours}h ${minutes}m`;
};

const getRelativeTimeFormat = (date) => dayjs(date).fromNow();

export {
  getFormatDate,
  getDurationTime,
  getRelativeTimeFormat
};
