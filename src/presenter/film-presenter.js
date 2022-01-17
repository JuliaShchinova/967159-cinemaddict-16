import CommentsModel from '../model/comments-model';
import { ESC, ESCAPE, FilterType, Mode, UpdateType, UserAction } from '../utils/const';
import { remove, render, RenderPosition, replace } from '../utils/render';
import FilmCardView from '../view/film-card-view';
import PopupView from '../view/popup-view';

export default class FilmPresenter {
  #filmListContainer = null;
  #changeData = null;
  #closePopup = null;
  #filterType = null;
  #changeWatchedData = null;

  #filmComponent = null;
  #popupComponent = null;

  #film = null;
  #commentsModel = null;
  #mode = null;

  constructor (filmListContainer, comments, changeData, closePopup, filterType, changeWatchedData) {
    this.#filmListContainer = filmListContainer;
    this.#changeData = changeData;
    this.#closePopup = closePopup;
    this.#filterType = filterType;
    this.#changeWatchedData = changeWatchedData;

    this.#mode = Mode.DEFAULT;

    this.#commentsModel = new CommentsModel();
    this.#commentsModel.comments = comments;//потом в сетях перенести в init
    this.#commentsModel.addObserver(this.#handleModelEvent);
  }

  init = (film) => {
    this.#film = film;

    const prevFilmComponent = this.#filmComponent;
    const prevPopupComponent = this.#popupComponent;//

    this.#filmComponent = new FilmCardView(film);
    this.#popupComponent = new PopupView(film, this.#commentsModel.comments, this.#handleViewAction);//

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

    // this.#initPopup(film);

    if (document.body.contains(prevPopupComponent.element)) {
      const scrollPosition = prevPopupComponent.element.scrollTop;

      replace(this.#popupComponent, prevPopupComponent);
      this.#popupComponent.renderCommentInfo();

      this.#popupComponent.element.scrollTop = scrollPosition;

      this.#setPopupHandlers();
      remove(prevPopupComponent);

      console.log('init-1');
    }//

    remove(prevFilmComponent);
  }

  destroy = () => {
    remove(this.#filmComponent);
  }

  #initPopup = (film) => {
    this.#film = film;

    const prevPopupComponent = this.#popupComponent;

    this.#popupComponent = new PopupView(film, this.#commentsModel.comments, this.#handleViewAction);

    if (document.body.contains(prevPopupComponent.element)) {
      const scrollPosition = prevPopupComponent.element.scrollTop;

      replace(this.#popupComponent, prevPopupComponent);
      this.#popupComponent.renderCommentInfo();

      this.#popupComponent.element.scrollTop = scrollPosition;

      this.#setPopupHandlers();
      remove(prevPopupComponent);
      console.log('init-2');
    }
  }//

  #renderPopup = () => {
    render(document.body, this.#popupComponent, RenderPosition.BEFOREEND);
    this.#popupComponent.renderCommentInfo();
    document.body.classList.add('hide-overflow');

    this.#setPopupHandlers();

    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.EDIT;
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
    this.#mode = Mode.DEFAULT;
  }

  #handleViewAction = (actionType, update) => {
    switch (actionType) {
      case UserAction.ADD_COMMENT:
        this.#commentsModel.addComment(actionType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentsModel.deleteComment(actionType, update);
        break;
    }
  }

  #handleModelEvent = (actionType, data) => {
    switch (actionType) {
      case UserAction.ADD_COMMENT:
        this.#changeData(
          UserAction.ADD_COMMENT,
          UpdateType.PATCH,
          {...this.#film, comments: this.#film.comments.concat([data.id])});
        break;
      case UserAction.DELETE_COMMENT:
        this.#changeData(
          UserAction.DELETE_COMMENT,
          UpdateType.PATCH,
          {...this.#film, comments: this.#film.comments.filter((comment) => comment !== data)});
        break;
    }
  }

  #handleLinkClick = () => {
    if (!document.body.contains(this.#popupComponent.element)) {
      this.#closePopup();
      this.#renderPopup();
    }
  }

  #handleIsInWatchlistClick = () => {
    const updated = Object.assign(
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
    );

    this.#changeData(
      UserAction.UPDATE_STATS,
      this.#filterType !== FilterType.WATCHLIST ? UpdateType.PATCH : UpdateType.MINOR,
      updated);


    if ( this.#mode === Mode.EDIT) {
      this.#initPopup(updated);
    }//
  }

  #handleIsAlreadyWatchedClick = () => {
    const updated = Object.assign(
      {},
      this.#film,
      {
        userDetails:
        {
          isInWatchlist: this.#film.userDetails.isInWatchlist,
          isAlreadyWatched: !this.#film.userDetails.isAlreadyWatched,
          isFavorites: this.#film.userDetails.isFavorites,
          watchingDate: !this.#film.userDetails.watchingDate ? new Date() : null,
        },
      },
    );

    this.#changeData(
      UserAction.UPDATE_STATS,
      this.#filterType !== FilterType.HISTORY ? UpdateType.PATCH : UpdateType.MINOR,
      updated);

    if ( this.#mode === Mode.EDIT) {
      this.#initPopup(updated);
    }//

    this.#changeWatchedData();//
  }

  #handleIsFavoritesClick = () => {
    const updated = Object.assign(
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
    );

    this.#changeData(
      UserAction.UPDATE_STATS,
      this.#filterType !== FilterType.FAVORITES ? UpdateType.PATCH : UpdateType.MINOR,
      updated);

    if ( this.#mode === Mode.EDIT) {
      this.#initPopup(updated);
    }//
  }


  #escKeyDownHandler = (evt) => {
    if (evt.key === ESCAPE || evt.key === ESC) {
      evt.preventDefault();
      this.#removePopup();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  }
}
