import { EMOTIONS } from '../utils/const';
import { generateDate } from '../utils/date';
import { getRandomArray, getRandomInteger } from '../utils/common';

const generateAuthor = () => {
  const authors = [
    'Mr X',
    'Ivan Petrov',
    'John Smith',
    'Ann Dolores',
    'Bill Gates',
    'Tim Macoveev',
    'John Doe',
  ];

  const randomIndex = getRandomInteger(0, authors.length - 1);
  return authors[randomIndex];
};

const generateCommentText = () => {
  const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';

  const comments = text.split('. ');

  return getRandomArray(comments, 1, comments.length - 1).join('. ');
};

const generateEmotion = () => {
  const randomIndex = getRandomInteger(0, EMOTIONS.length - 1);
  return EMOTIONS[randomIndex];
};

export const generateCommentInfo = (id) => ({
  id: id,
  author: generateAuthor(),
  text: generateCommentText(),
  date: generateDate(2019, 2021),
  emotion: generateEmotion()
});
