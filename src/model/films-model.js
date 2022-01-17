import AbstractObservable from '../utils/abstract-observable';
import { SORT_COUNT } from '../utils/const';

export default class FilmsModel extends AbstractObservable {
  #films = [];

  set films (films) {
    this.#films = [...films];
  }

  get films () {
    return this.#films;
  }

  get topRatedFilms () {
    return this.#films
      .filter((film) => film.totalRating !== 0)
      .sort((a, b) => b.totalRating - a.totalRating)
      .slice(0, SORT_COUNT);
  }

  get mostCommentedFilms () {
    return this.#films
      .filter((film) => film.comments.length !==0)
      .sort((a, b) => b.comments.length - a.comments.length)
      .slice(0, SORT_COUNT);
  }

  updateFilm = (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this.#films = [
      ...this.#films.slice(0, index),
      update,
      ...this.#films.slice(index + 1),
    ];

    this._notify(updateType, update);
  }
}
