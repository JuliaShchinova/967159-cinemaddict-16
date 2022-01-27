import { State } from '../presenter/film-presenter';
import { UserAction } from '../utils/const';
import { getDurationTime, getFormatDate } from '../utils/date';
import { render, RenderPosition } from '../utils/render';
import { addClass } from '../utils/utils';
import AbstractView from './abstract-view';
import AddCommentView from './add-comment-view';
import CommentView from './comment-view';

const createPopupTemplate = (film = {}) => {
  const {filmInfo, comments, userDetails} = film;

  const {title,
    alternativeTitle,
    ageRating,
    totalRating,
    poster,
    director,
    writers,
    actors,
    release,
    description,
    runtime,
    genre: genres} = filmInfo;

  const genresTitle = genres.length > 1 ? 'Genres' : 'Genre';

  const getGenresList = (genresList) => genresList.map((genre) => `<span class="film-details__genre">${genre}</span>`).join('');

  const addFilmDetaisActiveClass = addClass('film-details__control-button--active');

  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${poster}" alt="${title}">

            <p class="film-details__age">${ageRating}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">Original: ${alternativeTitle}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${totalRating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${writers.join(', ')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${actors.join(', ')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${getFormatDate(release.date, 'DD MMMM YYYY')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${getDurationTime(runtime, 'minute')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${release.releaseCountry}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${genresTitle}</td>
                <td class="film-details__cell">${getGenresList(genres)}</tr>
            </table>

            <p class="film-details__film-description">${description}</p>
          </div>
        </div>

        <section class="film-details__controls">
          <button type="button" class="film-details__control-button film-details__control-button--watchlist ${addFilmDetaisActiveClass(userDetails.isInWatchlist)}" id="watchlist" name="watchlist">Add to watchlist</button>
          <button type="button" class="film-details__control-button film-details__control-button--watched ${addFilmDetaisActiveClass(userDetails.isAlreadyWatched)}" id="watched" name="watched">Already watched</button>
          <button type="button" class="film-details__control-button film-details__control-button--favorite ${addFilmDetaisActiveClass(userDetails.isFavorites)}" id="favorite" name="favorite">Add to favorites</button>
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

          <ul class="film-details__comments-list">
          </ul>
        </section>
      </div>
    </form>
  </section>`;
};

export default class PopupView extends AbstractView {
  #film = null;
  #filmComments = new Map();
  #container = null;
  #changeCommentData = null;
  #addCommentComponent = new AddCommentView();

  constructor (film, changeCommentData) {
    super();

    this.#film = film;
    this.#changeCommentData = changeCommentData;
  }

  get template() {
    return createPopupTemplate(this.#film);
  }

  get container () {
    this.#container = this.element.querySelector('.film-details__comments-list');

    return this.#container;
  }

  renderCommentInfo = (comments) => {
    if (this.#filmComments.size !== 0) {
      this.#filmComments.clear();
    }
    this.#renderComments(comments);
    this.#renderAddComment();
  }

  setCloseClickHandler = (callback) => {
    this._callback.closeClick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeClickHandler);
  }

  setIsInWatchlistClickHandler = (callback) => {
    this._callback.inWatchListClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#isInWatchlistClickHandler);
  }

  setIsAlreadyWatchedClickHandler = (callback) => {
    this._callback.alreadyWatchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#isAlreadyWatchedClickHandler);
  }

  setIsFavoritesClickHandler = (callback) => {
    this._callback.favoritesClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#isFavoritesClickHandler);
  }

  updateData = (state, id) => {
    switch (state) {
      case State.SAVING:
        this.#addCommentComponent.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this.#filmComments.get(id).updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        if (id !== null) {
          this.#setCommentAborting(id);
        } else {
          this.#setAddCommentAborting();
        }
        break;
    }
  }

  #setAddCommentAborting = () => {
    const resetFormState = () => {
      this.#addCommentComponent.updateData({
        isDisabled: false,
        isSaving: false,
      });
    };

    this.#addCommentComponent.shake(resetFormState);
  }

  #setCommentAborting = (id) => {
    const resetFormState = () => {
      this.#filmComments.get(id).updateData({
        isDisabled: false,
        isDeleting: false,
      });
    };

    this.#filmComments.get(id).shake(resetFormState);
  }

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeClick();
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

  #renderComments = (comments = []) => {
    for (const comment of comments) {
      const commentComponent = new CommentView(comment);
      commentComponent.setDeleteClickHandler(this.#handleDeleteCommentClick);
      render(this.container, commentComponent, RenderPosition.BEFOREEND);
      this.#filmComments.set(comment.id, commentComponent);
    }
  }

  #renderAddComment = () => {
    this.#addCommentComponent.setFormKeydownHandler(this.#addCommentKeydownHandler);
    render(this.container, this.#addCommentComponent, RenderPosition.AFTEREND);
  }

  #handleDeleteCommentClick = (update) => {
    this.#changeCommentData(UserAction.DELETE_COMMENT, update);
  }

  #addCommentKeydownHandler = (update) => {
    this.#changeCommentData(UserAction.ADD_COMMENT, update);
  }
}
