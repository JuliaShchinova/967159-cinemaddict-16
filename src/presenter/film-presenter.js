import ApiService from '../api-service';
import CommentsModel from '../model/comments-model';
import { AUTHORIZATION, END_POINT, FilterType, UpdateType, UserAction } from '../utils/const';
import { remove, render, RenderPosition, replace } from '../utils/render';
import FilmCardView from '../view/film-card-view';
import PopupView from '../view/popup-view';

const ESCAPE = 'Escape';
const ESC = 'Esc';

export const Mode = {
  DEFAULT: 'DEFAULT',
  EDIT: 'EDIT'
};

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

export default class FilmPresenter {
  #filmListContainer = null;
  #changeData = null;
  #closePopup = null;
  #filterType = null;

  #filmComponent = null;
  #popupComponent = null;

  #film = null;
  #commentsModel = null;

  constructor (filmListContainer, changeData, closePopup, filterType) {
    this.#filmListContainer = filmListContainer;
    this.#changeData = changeData;
    this.#closePopup = closePopup;
    this.#filterType = filterType;

    this.mode = Mode.DEFAULT;

    this.#commentsModel = new CommentsModel(new ApiService(END_POINT, AUTHORIZATION));
    this.#commentsModel.addObserver(this.#handleModelEvent);
  }

  init = (film) => {
    this.#film = film;

    const prevFilmComponent = this.#filmComponent;
    const prevPopupComponent = this.#popupComponent;

    this.#filmComponent = new FilmCardView(film);
    this.#popupComponent = new PopupView(film, this.#handleViewAction);

    this.#filmComponent.setLinkClickHandler(this.#handleLinkClick);
    this.#filmComponent.setIsInWatchlistClickHandler(this.#handleIsInWatchlistClick);
    this.#filmComponent.setIsAlreadyWatchedClickHandler(this.#handleIsAlreadyWatchedClick);
    this.#filmComponent.setIsFavoritesClickHandler(this.#handleIsFavoritesClick);

    if (prevFilmComponent === null && prevPopupComponent === null) {
      render(this.#filmListContainer, this.#filmComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#filmListContainer.contains(prevFilmComponent.element)) {
      replace(this.#filmComponent, prevFilmComponent);
    }

    if (document.body.contains(prevPopupComponent.element)) {
      const scrollPosition = prevPopupComponent.element.scrollTop;

      replace(this.#popupComponent, prevPopupComponent);
      this.#popupComponent.renderCommentInfo(this.#commentsModel.comments);

      this.#popupComponent.element.scrollTop = scrollPosition;

      this.#setPopupHandlers();
    }

    remove(prevFilmComponent);
    remove(prevPopupComponent);
  }

  destroy = () => {
    remove(this.#filmComponent);
  }

  setViewState = (state, id = null) => {
    if (this.mode === Mode.DEFAULT) {
      return;
    }

    this.#popupComponent.updateData(state, id);
  }

  removePopup = () => {
    remove(this.#popupComponent);
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#escKeyDownHandler);

    this.mode = Mode.DEFAULT;
  }

  #renderPopup = () => {
    this.#commentsModel.init(this.#film);

    render(document.body, this.#popupComponent, RenderPosition.BEFOREEND);
    document.body.classList.add('hide-overflow');

    this.#setPopupHandlers();

    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.mode = Mode.EDIT;
  }

  #handleViewAction = async (actionType, update) => {
    switch (actionType) {
      case UserAction.ADD_COMMENT:
        this.setViewState(State.SAVING);
        try {
          await this.#commentsModel.addComment(actionType, update, this.#film.id);
        } catch (err) {
          this.setViewState(State.ABORTING);
        }
        break;
      case UserAction.DELETE_COMMENT:
        this.setViewState(State.DELETING, update);
        try {
          await this.#commentsModel.deleteComment(actionType, update);
        } catch (err) {
          this.setViewState(State.ABORTING, update);
        }
        break;
    }
  }

  #handleModelEvent = (actionType, data) => {
    switch (actionType) {
      case UserAction.ADD_COMMENT:
        this.#changeData(
          UserAction.ADD_COMMENT,
          UpdateType.PART,
          {...this.#film, comments: data.comments.map((comment) => comment.id)});
        break;
      case UserAction.DELETE_COMMENT:
        this.#changeData(
          UserAction.DELETE_COMMENT,
          UpdateType.PART,
          {...this.#film, comments: this.#film.comments.filter((comment) => comment !== data)});
        break;
      case UserAction.INIT_COMMENTS:
        this.#popupComponent.renderCommentInfo(this.#commentsModel.comments);
        break;
    }
  }

  #setPopupHandlers = () => {
    this.#popupComponent.setCloseClickHandler(this.removePopup);
    this.#popupComponent.setIsInWatchlistClickHandler(this.#handleIsInWatchlistClick);
    this.#popupComponent.setIsAlreadyWatchedClickHandler(this.#handleIsAlreadyWatchedClick);
    this.#popupComponent.setIsFavoritesClickHandler(this.#handleIsFavoritesClick);
  }

  #handleLinkClick = () => {
    if (!document.body.contains(this.#popupComponent.element)) {
      this.#closePopup();
      this.#renderPopup();
    }
  }

  #handleIsInWatchlistClick = () => {
    const updated = {...this.#film,
      userDetails: {...this.#film.userDetails, isInWatchlist: !this.#film.userDetails.isInWatchlist}
    };

    this.#changeData(
      UserAction.UPDATE_STATS,
      this.#filterType !== FilterType.WATCHLIST ? UpdateType.PATCH : UpdateType.MINOR,
      updated);

    if (this.#filterType === FilterType.WATCHLIST && this.mode === Mode.EDIT) {
      this.removePopup();
    }
  }

  #handleIsAlreadyWatchedClick = () => {
    const updated = {...this.#film,
      userDetails: {...this.#film.userDetails,
        isAlreadyWatched: !this.#film.userDetails.isAlreadyWatched,
        watchingDate: !this.#film.userDetails.isAlreadyWatched ? new Date() : null
      }
    };

    this.#changeData(
      UserAction.UPDATE_STATS,
      this.#filterType !== FilterType.HISTORY ? UpdateType.PATCH : UpdateType.MINOR,
      updated);

    if (this.#filterType === FilterType.HISTORY && this.mode === Mode.EDIT) {
      this.removePopup();
    }
  }

  #handleIsFavoritesClick = () => {
    const updated = {...this.#film,
      userDetails: {...this.#film.userDetails, isFavorites: !this.#film.userDetails.isFavorites}
    };

    this.#changeData(
      UserAction.UPDATE_STATS,
      this.#filterType !== FilterType.FAVORITES ? UpdateType.PATCH : UpdateType.MINOR,
      updated);

    if (this.#filterType === FilterType.FAVORITES && this.mode === Mode.EDIT) {
      this.removePopup();
    }
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === ESCAPE || evt.key === ESC) {
      evt.preventDefault();
      this.removePopup();
    }
  }
}
