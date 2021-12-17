import { remove, render, RenderPosition, replace } from '../utils/render';
import FilmCardView from '../view/film-card-view';
import PopupView from '../view/popup-view';

export default class FilmPresenter {
  #filmListContainer = null;
  #changeData = null;

  #filmComponent = null;
  #popupComponent = null;

  #film = null;
  #comments = [];

  constructor (filmListContainer, changeData) {
    this.#filmListContainer = filmListContainer;
    this.#changeData = changeData;
  }

  init = (film, comments) => {
    this.#film = film;
    this.#comments = comments;

    const prevFilmComponent = this.#filmComponent;
    const prevPopupComponent = this.#popupComponent;

    this.#filmComponent = new FilmCardView(film);
    this.#popupComponent = new PopupView(film, comments);

    this.#filmComponent.setLinkClickHandler(this.#handleLinkClick);
    this.#filmComponent.setIsInWatchlistClickHandler(this.#handleIsInWatchlistClick);
    this.#filmComponent.setIsAlreadyWatchedClickHandler(this.#handleIsAlreadyWatchedClick);
    this.#filmComponent.setIsFavoritesClickHandler(this.#handleIsFavoritesClick);

    if (prevFilmComponent === null) {
      render(this.#filmListContainer, this.#filmComponent, RenderPosition.BEFOREEND);
      return;
    }


    if (this.#filmListContainer.contains(prevFilmComponent.element)) {
      replace(this.#filmComponent, prevFilmComponent);
    }

    if (document.body.contains(prevPopupComponent.element)) {
      replace(this.#popupComponent, prevPopupComponent);
      this.#popupComponent.renderCommentInfo();
      this.#setPopupHandlers();
      remove(prevPopupComponent);
    }

    remove(prevFilmComponent);
  }

  destroy = () => {
    remove(this.#filmComponent);
  }

  #renderPopup = () => {
    if (document.body.querySelector('.film-details')) {
      document.body.querySelector('.film-details').remove();
    }

    render(document.body, this.#popupComponent, RenderPosition.BEFOREEND);
    this.#popupComponent.renderCommentInfo();
    document.body.classList.add('hide-overflow');

    this.#setPopupHandlers();

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #setPopupHandlers = () => {
    this.#popupComponent.setCloseClickHandler(() => {
      this.#removePopup();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    });

    this.#popupComponent.setIsInWatchlistClickHandler(this.#handleIsInWatchlistClick);
    this.#popupComponent.setIsAlreadyWatchedClickHandler(this.#handleIsAlreadyWatchedClick);
    this.#popupComponent.setIsFavoritesClickHandler(this.#handleIsFavoritesClick);
  }

  #removePopup = () => {
    remove(this.#popupComponent);
    document.body.classList.remove('hide-overflow');
  }

  #handleLinkClick = () => {
    this.#renderPopup();
  }

  #handleIsInWatchlistClick = () => {
    this.#changeData(Object.assign(
      {},
      this.#film,
      {
        userDetails:
        {
          isInWatchlist: !this.#film.userDetails.isInWatchlist,
          isAlreadyWatched: this.#film.userDetails.isAlreadyWatched,
          isFavorites: this.#film.userDetails.isFavorites,
          watchingDate: this.#film.userDetails.watchingDate
        },
      },
    ));
  }

  #handleIsAlreadyWatchedClick = () => {
    this.#changeData(Object.assign(
      {},
      this.#film,
      {
        userDetails:
        {
          isInWatchlist: this.#film.userDetails.isInWatchlist,
          isAlreadyWatched: !this.#film.userDetails.isAlreadyWatched,
          isFavorites: this.#film.userDetails.isFavorites,
          watchingDate: this.#film.userDetails.watchingDate,
        },
      },
    ));
  }

  #handleIsFavoritesClick = () => {
    this.#changeData(Object.assign(
      {},
      this.#film,
      {
        userDetails:
        {
          isInWatchlist: this.#film.userDetails.isInWatchlist,
          isAlreadyWatched: this.#film.userDetails.isAlreadyWatched,
          isFavorites: !this.#film.userDetails.isFavorites,
          watchingDate: this.#film.userDetails.watchingDate,
        },
      },
    ));
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#removePopup();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  }
}
