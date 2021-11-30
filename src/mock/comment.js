import { COMMENT_COUNT } from '../const';
import { generateDate, getRandomArray, getRandomInteger } from '../utils/utils';

const generateId = () => {
  const numders = [];

  for (let i = 1; i < COMMENT_COUNT; i++) {
    numders.push(i);
  }

  const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'j', 'h', 'i', 'g', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

  const id = numders[getRandomInteger(0, numders.length - 1)] + letters [getRandomInteger(0, numders.length - 1)];

  return id;
};

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
  const emotions = ['smile', 'sleeping', 'puke', 'angry'];

  const randomIndex = getRandomInteger(0, emotions.length - 1);
  return emotions[randomIndex];
};

export const generateCommentInfo = () => ({
  id: generateId(),
  author: generateAuthor(),
  text: generateCommentText(),
  date: generateDate(2019, 2021),
  emotion: generateEmotion()
});
