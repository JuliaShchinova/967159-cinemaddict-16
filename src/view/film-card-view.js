import { MAX_DESCRIPTION_LENGTH, TEXT_LENGTH } from '../utils/const';
import { getDurationTime, getFormatDate } from '../utils/date';
import { addClass } from '../utils/utils';
import AbstractView from './abstract-view';

const createFilmCardTemplate = (film) => {
  const {id, filmInfo, comments, userDetails} = film;

  const {title,
    totalRating,
    poster,
    release,
    description,
    runtime,
    genre} = filmInfo;

  const text = description.length < MAX_DESCRIPTION_LENGTH ? description : `${description.slice(0, TEXT_LENGTH)}...`;

  const addFilmCardActiveClass = addClass('film-card__controls-item--active');

  return `<article class="film-card" id="${id}">
    <a class="film-card__link">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${getFormatDate(release.date, 'YYYY')}</span>
        <span class="film-card__duration">${getDurationTime(runtime, 'minute')}</span>
        <span class="film-card__genre">${genre[0]}</span>
      </p>
      <img src="${poster}" alt="${title}" class="film-card__poster">
      <p class="film-card__description">${text}</p>
      <span class="film-card__comments">${comments.length} comments</span>
    </a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${addFilmCardActiveClass(userDetails.isInWatchlist)}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${addFilmCardActiveClass(userDetails.isAlreadyWatched)}" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite ${addFilmCardActiveClass(userDetails.isFavorites)}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class FilmCardView extends AbstractView {
  #film = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createFilmCardTemplate(this.#film);
  }

  setLinkClickHandler = (callback) => {
    this._callback.linkClick = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#linkClickHandler);
  }

  setIsInWatchlistClickHandler = (callback) => {
    this._callback.inWatchListClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#isInWatchlistClickHandler);
  }

  setIsAlreadyWatchedClickHandler = (callback) => {
    this._callback.alreadyWatchedClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#isAlreadyWatchedClickHandler);
  }

  setIsFavoritesClickHandler = (callback) => {
    this._callback.favoritesClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#isFavoritesClickHandler);
  }

  #linkClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.linkClick(this.#film);
  }

  #isInWatchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.inWatchListClick();
  }

  #isAlreadyWatchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.alreadyWatchedClick();
  }

  #isFavoritesClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoritesClick();
  }
}
