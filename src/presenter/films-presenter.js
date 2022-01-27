// import { generateCommentInfo } from '../mock/comment';
import { FilterType, SortType, UpdateType, UserAction } from '../utils/const';
import { filter } from '../utils/filter';
import { remove, render, RenderPosition, replace } from '../utils/render';
import { sortByDate, sortByRating } from '../utils/utils';
import FilmsListView from '../view/films-list-view';
import FilmsView from '../view/films-view';
import ListEmptyView from '../view/list-empty-view';
import LoadingView from '../view/loading-view';
import ProfileView from '../view/profile-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import SortView from '../view/sort-view';
import FilmPresenter from './film-presenter';

const CARD_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #profileContainer = null;
  #filmsContainer = null;
  #filmsModel = null;
  #filterModel = null;

  #filmsComponent = new FilmsView();

  #filmsListComponent = new FilmsListView();
  #filmsListRatedComponent = new FilmsListView('topRated');
  #filmsListCommentedComponent = new FilmsListView('mostCommented');
  #loadingComponent = new LoadingView();
  #listEmptyComponent = null;
  #sortComponent = null;
  #showMoreButtonComponent = null;
  #profileComponent = null;

  #renderedCardCount = CARD_COUNT_PER_STEP;
  #filmPresenter = new Map();
  #filmRatedPresenter = new Map();
  #filmCommentedPresenter = new Map();

  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;

  #isLoading =  true;

  constructor(profileContainer, filmsContainer, filmsModel, filterModel) {
    this.#profileContainer = profileContainer;
    this.#filmsContainer = filmsContainer;
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;
  }

  get films () {
    this.#filterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filter[this.#filterType](films);

    switch (this.#currentSortType) {
      case SortType.BY_DATE:
        return filteredFilms.sort(sortByDate);
      case SortType.BY_RAITING:
        return filteredFilms.sort(sortByRating);
    }

    return filteredFilms;
  }

  get watchedFilms () {
    return this.#filmsModel.films.filter((film) => film.userDetails.isAlreadyWatched);
  }

  init = () => {
    render(this.#filmsContainer, this.#filmsComponent, RenderPosition.BEFOREEND);

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#renderBoard();
  }

  destroy = () => {
    this.#clearBoard({resetRenderedFilmCount: true, resetSortType: true});

    remove(this.#filmsComponent);

    this.#filmsModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);
  }

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);

    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#filmsComponent, this.#sortComponent, RenderPosition.BEFOREBEGIN);
  }

  #renderFilmsList = () => {
    render(this.#filmsComponent, this.#filmsListComponent, RenderPosition.BEFOREEND);
  }

  #renderFilm = (filmListElement, film, filmMap) => {
    const container = filmListElement.container ? filmListElement.container : filmListElement;

    const filmPresenter = new FilmPresenter(container, this.#handleViewAction, this.#handleOpenPopup, this.#filterType, this.#renderProfileComponent);
    filmPresenter.init(film);

    filmMap.set(film.id, filmPresenter);
  }

  #renderFilmCards = (cards, place, filmMap) => {
    cards.forEach((film) => this.#renderFilm(place, film, filmMap));
  }

  #renderNoFilms = () => {
    this.#listEmptyComponent = new ListEmptyView(this.#filterType);
    render(this.#filmsComponent, this.#listEmptyComponent, RenderPosition.BEFOREEND);
  }

  #renderLoading = () => {
    render(this.#filmsComponent, this.#loadingComponent, RenderPosition.AFTERBEGIN);
  }

  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent = new ShowMoreButtonView();

    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
    render(this.#filmsListComponent, this.#showMoreButtonComponent, RenderPosition.BEFOREEND);
  }

  #renderFilmsListRatedComponent = () => {
    if (this.#filmsModel.topRatedFilms && this.#filmsModel.topRatedFilms.length !== 0) {
      render(this.#filmsComponent, this.#filmsListRatedComponent, RenderPosition.BEFOREEND);
      this.#renderFilmCards(this.#filmsModel.topRatedFilms, this.#filmsListRatedComponent, this.#filmRatedPresenter);
    }
  }

  #renderFilmsListCommentedComponent = () => {
    if (this.#filmsModel.mostCommentedFilms && this.#filmsModel.mostCommentedFilms.length !== 0) {
      render(this.#filmsComponent, this.#filmsListCommentedComponent, RenderPosition.BEFOREEND);
      this.#renderFilmCards(this.#filmsModel.mostCommentedFilms, this.#filmsListCommentedComponent, this.#filmCommentedPresenter);
    }
  }

  #renderProfileComponent = () => {
    const prevProfileComponent = this.#profileComponent;

    this.#profileComponent = new ProfileView(this.watchedFilms.length);

    if (prevProfileComponent === null) {
      render(this.#profileContainer, this.#profileComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#profileContainer.contains(prevProfileComponent.element)) {
      replace(this.#profileComponent, prevProfileComponent);
    }
  }

  #clearBoard = ({resetRenderedFilmCount = false, resetSortType = false} = {}) => {
    const filmCount = this.films.length;

    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();

    [this.#sortComponent,
      this.#loadingComponent,
      this.#showMoreButtonComponent,
      this.#filmsListComponent,
      this.#filmsListRatedComponent,
      this.#filmsListCommentedComponent].forEach((component) => remove(component));

    if (this.#listEmptyComponent) {
      remove(this.#listEmptyComponent);
    }

    if (resetRenderedFilmCount) {
      this.#renderedCardCount = CARD_COUNT_PER_STEP;
    } else {
      this.#renderedCardCount = Math.min(filmCount, this.#renderedCardCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderBoard = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const films = this.films;
    const filmCount = films.length;

    if (filmCount === 0) {
      this.#renderNoFilms();
      return;
    }

    this.#renderSort();
    this.#renderFilmsList();
    this.#renderFilmCards(films.slice(0, Math.min(filmCount, this.#renderedCardCount)), this.#filmsListComponent, this.#filmPresenter);

    if (filmCount > this.#renderedCardCount) {
      this.#renderShowMoreButton();
    }

    this.#renderFilmsListRatedComponent();
    this.#renderFilmsListCommentedComponent();

    if (this.#profileComponent === null) {
      this.#renderProfileComponent();
    }
  }

  #handleOpenPopup = (checkBodyClass = false) => {
    if (document.body.querySelector('.film-details')) {
      document.body.querySelector('.film-details').remove();
    }

    if (checkBodyClass && document.body.classList.contains('hide-overflow')) {
      document.body.classList.remove('hide-overflow');
    }
  }

  #handleShowMoreButtonClick = () => {
    const filmCount = this.films.length;
    const newRenderedFilmCount = Math.min(filmCount, this.#renderedCardCount + CARD_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedCardCount, newRenderedFilmCount);

    this.#renderFilmCards(films, this.#filmsListComponent, this.#filmPresenter);
    this.#renderedCardCount = newRenderedFilmCount;

    if (this.#renderedCardCount >= filmCount) {
      remove(this.#showMoreButtonComponent);
    }
  }

  #initFilmPresenter = (presenter, updatedFilm) => {
    if (presenter.has(updatedFilm.id)) {
      presenter.get(updatedFilm.id).init(updatedFilm);
    }
  }

  #updateFilm = (updatedFilm) => {
    [this.#filmPresenter,
      this.#filmRatedPresenter,
      this.#filmCommentedPresenter].forEach((presenter) => this.#initFilmPresenter(presenter, updatedFilm));
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_STATS:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#filmsModel.updateFilm(updateType, update);
        break;
    }
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#updateFilm(data);
        break;
      case UpdateType.PART:
        remove(this.#filmsListCommentedComponent);
        console.log(this.#filmCommentedPresenter)
        // this.#filmCommentedPresenter.clear();
        this.#renderFilmsListCommentedComponent();

        this.#updateFilm(data);

        // remove(this.#filmsListCommentedComponent);
        // // this.#filmCommentedPresenter.clear();
        // this.#renderFilmsListCommentedComponent();
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#handleOpenPopup(true);
        this.#clearBoard({resetRenderedFilmCount: true, resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard({resetRenderedFilmCount: true});
    this.#renderBoard();
  }
}
