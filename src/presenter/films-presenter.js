import { updateItem } from '../utils/common';
import { SortType } from '../utils/const';
import { remove, render, RenderPosition } from '../utils/render';
import { sortByDate, sortByRating } from '../utils/sort';
import FilmsListView from '../view/films-list-view';
import FilmsView from '../view/films-view';
import ListEmptyView from '../view/list-empty-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import SortView from '../view/sort-view';
import FilmPresenter from './film-presenter';

const CARD_COUNT_PER_STEP = 5;
const SORT_COUNT = 2;

export default class FilmsPresenter {
  #filmsContainer = null;

  #filmsComponent = new FilmsView();;
  #sortComponent = new SortView();
  #filmsListComponent = new FilmsListView();
  #filmsListRatedComponent = new FilmsListView('topRated');
  #filmsListCommentedComponent = new FilmsListView('mostCommented');
  #listEmptyComponent = new ListEmptyView();
  #showMoreButtonComponent = new ShowMoreButtonView();

  #filmCards = [];
  #filmComments = [];
  #ratedFilms = [];
  #commentedFilms = [];
  #renderedCardCount = CARD_COUNT_PER_STEP;
  #filmPresenter = new Map();

  #currentSortType = SortType.DEFAULT;
  #sourcedfilmCards = [];

  constructor(filmsContainer) {
    this.#filmsContainer = filmsContainer;
  }

  init = (filmCards, filmComments) => {
    this.#filmCards = [...filmCards];
    this.#sourcedfilmCards = [...filmCards];
    this.#filmComments = [...filmComments];

    this.#ratedFilms = this.#sourcedfilmCards
      .filter((film) => film.totalRating !== 0)
      .sort((a, b) => b.totalRating - a.totalRating)
      .slice(0, this.SORT_COUNT);

    this.#commentedFilms = this.#sourcedfilmCards
      .filter((film) => film.comments.length !==0)
      .sort((a, b) => b.comments.length - a.comments.length)
      .slice(0, this.SORT_COUNT);

    render(this.#filmsContainer, this.#filmsComponent, RenderPosition.BEFOREEND);

    this.#renderFilms();
  }

  #renderSort = () => {
    render(this.#filmsComponent, this.#sortComponent, RenderPosition.BEFOREBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderFilmsList = () => {
    render(this.#filmsComponent, this.#filmsListComponent, RenderPosition.BEFOREEND);
  }

  #renderFilm = (filmListElement, film) => {
    const container = filmListElement.container ? filmListElement.container : filmListElement;

    const filmPresenter = new FilmPresenter(container, this.#handleFilmChange);
    filmPresenter.init(film, this.#filmComments);

    if (filmListElement === this.#filmsListComponent) {
      this.#filmPresenter.set(film.id, filmPresenter);
    }

    // this.#filmPresenter.set(film.id, filmPresenter);
  }

  #renderFilmCards = (cards, place, from, to) => {
    cards
      .slice(from, to)
      .forEach((film) => this.#renderFilm(place, film));
  }

  #renderCardsList = () => {
    this.#renderFilmCards(this.#filmCards, this.#filmsListComponent, 0, Math.min(this.#filmCards.length, CARD_COUNT_PER_STEP));

    if (this.#filmCards.length > CARD_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  }

  #renderNoFilms = () => {
    render(this.#filmsContainer, this.#listEmptyComponent, RenderPosition.BEFOREEND);
  }

  #renderShowMoreButton = () => {
    render(this.#filmsListComponent, this.#showMoreButtonComponent, RenderPosition.BEFOREEND);

    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
  }

  #renderFilmsListRatedComponent = () => {
    if (this.#ratedFilms.length !== 0) {
      render(this.#filmsComponent, this.#filmsListRatedComponent, RenderPosition.BEFOREEND);
      this.#renderFilmCards(this.#ratedFilms, this.#filmsListRatedComponent, 0, SORT_COUNT);
    }
  }

  #renderFilmsListCommentedComponent = () => {
    if (this.#commentedFilms.length !== 0) {
      render(this.#filmsComponent, this.#filmsListCommentedComponent, RenderPosition.BEFOREEND);
      this.#renderFilmCards(this.#commentedFilms, this.#filmsListCommentedComponent, 0, SORT_COUNT);
    }
  }

  #renderFilms = () => {
    if (this.#filmCards.length === 0) {
      this.#renderNoFilms();
      return;
    }

    this.#renderSort();
    this.#renderFilmsList();
    this.#renderCardsList();
    this.#renderFilmsListRatedComponent();
    this.#renderFilmsListCommentedComponent();
  }

  #clearCardsList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedCardCount = CARD_COUNT_PER_STEP;
    remove(this.#showMoreButtonComponent);
  }

  #sortFilms = (sortType) => {
    switch (sortType) {
      case SortType.BY_DATE:
        this.#filmCards.sort(sortByDate);
        break;
      case SortType.BY_RAITING:
        this.#filmCards.sort(sortByRating);
        break;
      default:
        this.#filmCards = [...this.#sourcedfilmCards];
    }

    this.#currentSortType = sortType;
  }

  #handleShowMoreButtonClick = () => {
    this.#renderFilmCards(this.#filmCards, this.#filmsListComponent, this.#renderedCardCount, this.#renderedCardCount + CARD_COUNT_PER_STEP);
    this.#renderedCardCount += CARD_COUNT_PER_STEP;

    if (this.#renderedCardCount >= this.#filmCards.length) {
      remove(this.#showMoreButtonComponent);
    }
  }

  #handleFilmChange = (updatedFilm) => {
    this.#filmCards = updateItem(this.#filmCards, updatedFilm);
    this.#sourcedfilmCards = updateItem(this.#sourcedfilmCards, updatedFilm);
    this.#filmPresenter.get(updatedFilm.id).init(updatedFilm, this.#filmComments);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortFilms(sortType);
    this.#clearCardsList();
    this.#renderCardsList();
  }
}
