import { FilterType, MenuItem, UpdateType } from '../utils/const';
import { filter } from '../utils/filter';
import { remove, render, RenderPosition, replace } from '../utils/render';
import FilterView from '../view/filter-view';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #filmsModel = null;
  #handleMenuClick = null;

  #filterComponent = null;

  constructor(filterContainer, filterModel, filmsModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#filmsModel = filmsModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const films = this.#filmsModel.films;

    return [
      {
        type: FilterType.ALL,
        name: 'All movies',
        count: filter[FilterType.ALL](films).length,
      },
      {
        type: FilterType.WATCHLIST,
        name: 'Watchlist',
        count: filter[FilterType.WATCHLIST](films).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'History',
        count: filter[FilterType.HISTORY](films).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: filter[FilterType.FAVORITES](films).length,
      },
    ];
  }

  init = (handleMenuClick, menuItem = MenuItem.FILMS) => {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    if (this.#handleMenuClick === null) {
      this.#handleMenuClick = handleMenuClick;
    }

    this.#filterComponent = new FilterView(filters, this.#filterModel.filter, menuItem);

    if (prevFilterComponent === null) {
      render(this.#filterContainer, this.#filterComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  setMenuHandlers = () => {
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);
    this.#filterComponent.setMenuClickHandler(this.#handleMenuClick);
  }

  #handleModelEvent = () => {
    this.init(this.#handleMenuClick);
    this.setMenuHandlers();
  }

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  }
}
