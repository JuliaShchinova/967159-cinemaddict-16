import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const getFormatDate = (date, format) => dayjs(date).format(format);

const getDurationTime = (time, type) => {
  const HOURS_IN_DAY = 24;
  const { days, hours, minutes } = dayjs.duration(time, type).$d;

  return `${(days * HOURS_IN_DAY + hours)}h ${minutes}m`;
};

const getRelativeTimeFormat = (date) => dayjs(date).fromNow();

export {
  getFormatDate,
  getDurationTime,
  getRelativeTimeFormat
};
