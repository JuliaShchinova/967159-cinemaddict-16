import { ACTORS_MAX_COUNT, MAX_COUNT, MAX_RAITING, MIN_RANGE } from '../utils/const';
import { generateDate } from '../utils/date';
import { getRandomArray, getRandomInteger, getRandomWithFloat } from '../utils/common';
import { nanoid } from 'nanoid';

const generateTitle = () => {
  const titles = [
    'Made for each other',
    'Popeye meets sinbad',
    'Sagebrush trail',
    'Santa-claus conquers the martians',
    'The dance of life',
    'The great flamarion',
    'The man with the golden arm'
  ];

  const randomIndex = getRandomInteger(0, titles.length - 1);
  return titles[randomIndex];
};


const generateDescription = () => {
  const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';

  const descriptions = text.split('. ');

  return getRandomArray(descriptions, MIN_RANGE, MAX_COUNT).join('. ');
};

const generatePoster = () => {
  const posters = [
    './images/posters/made-for-each-other.png',
    './images/posters/popeye-meets-sinbad.png',
    './images/posters/sagebrush-trail.jpg',
    './images/posters/santa-claus-conquers-the-martians.jpg',
    './images/posters/the-dance-of-life.jpg',
    './images/posters/the-great-flamarion.jpg',
    './images/posters/the-man-with-the-golden-arm.jpg'
  ];

  const randomIndex = getRandomInteger(0, posters.length - 1);
  return posters[randomIndex];
};

const generateTotalRaiting = () => {
  const raiting = + getRandomWithFloat(0, MAX_RAITING).toFixed(1);

  return raiting;
};

const generateAgeRaiting = () => {
  const ages = [0, 6, 12, 14, 16, 18];

  const randomIndex = getRandomInteger(0, ages.length - 1);
  return ages[randomIndex];
};

const generateDirector = () => {
  const directors = [
    'John Cromwell',
    'Adolph Zucor',
    'Armand Schaefer',
    'Joseph E.Levine'
  ];

  const randomIndex = getRandomInteger(0, directors.length - 1);
  return directors[randomIndex];
};

const generateWriters = () => {
  const writers = [
    'Takeshi Kitano',
    'Dan Barclay',
    'Otto Preminger',
    'John Cromwell',
    'Anne Wigton',
    'Heinz Herald',
    'Richard Weil'
  ];

  return getRandomArray(writers, MIN_RANGE, writers.length - 1);
};

const generateActors = () => {
  const actors = [
    'Morgan Freeman',
    'Franc Sinatra',
    'Eleanor Parker',
    'Kim Novac',
    'James Stewart',
    'Charles Coburn',
  ];

  return getRandomArray(actors, MIN_RANGE, ACTORS_MAX_COUNT);
};

const generateGenres = () => {
  const genres = [
    'Comedy',
    'Tragedy',
    'Horrors',
    'Melodrama',
    'Thriller',
    'Western'
  ];

  return getRandomArray(genres, MIN_RANGE, genres.length - 1);
};

const generateComments = (loadedComments) => {
  const comments = loadedComments.map((comment) => comment.id);

  return getRandomArray(comments, 0, MAX_COUNT);
};

const generateCountry = () => {
  const countries = [
    'Finland',
    'Russia',
    'USA',
    'France',
    'India'
  ];

  const randomIndex = getRandomInteger(0, countries.length - 1);
  return countries[randomIndex];
};

const generateUserDetails = () => ({
  isInWatchlist: Boolean(getRandomInteger(0, 1)),
  isAlreadyWatched: Boolean(getRandomInteger(0, 1)),
  isFavorites: Boolean(getRandomInteger(0, 1)),
  watchingDate: generateDate(2019, 2021),
});


export const generateFilmInfo = (loadedComments) => ({
  id: nanoid(),
  title: generateTitle(),
  alternativeTitle: generateTitle(),
  totalRating: generateTotalRaiting(),
  poster: generatePoster(),
  ageRating: generateAgeRaiting(),
  director: generateDirector(),
  writers: generateWriters(),
  actors: generateActors(),
  release: {
    date: generateDate(1990, 2021),
    releaseCountry: generateCountry()
  },
  runtime: getRandomInteger(60, 180),
  genres: generateGenres(),
  description: generateDescription(),
  comments: generateComments(loadedComments),
  userDetails: generateUserDetails()
});
