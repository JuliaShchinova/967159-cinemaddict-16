import { FilterType, MenuItem } from '../utils/const';
import { addClass } from '../utils/utils';
import AbstractView from './abstract-view';

const createFilterItemTemplate = (filter, currentFilterType, menuItem) => {
  const {type, name, count} = filter;

  const addFilterActiveClass = addClass('main-navigation__item--active');

  return (`<a
    href="#${type.toLowerCase()}"
    class="main-navigation__item ${addFilterActiveClass(menuItem === MenuItem.FILMS && type === currentFilterType)}"
    data-filter="${type}"
    >
    ${name}
    ${name !== FilterType.ALL ? `<span data-filter="${type}" class="main-navigation__item-count">${count}</span>` : ''}
  </a>`);
};

const createFilterTemplate = (filterItems, currentFilterType, menuItem) => {
  const filterItemsTemplate = filterItems.map((filter) => createFilterItemTemplate(filter, currentFilterType, menuItem)).join('');

  const addStatsActiveClass = addClass('main-navigation__additional--active');

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filterItemsTemplate}
    </div>
      <a href="#stats" class="main-navigation__additional ${addStatsActiveClass(menuItem === MenuItem.STATS)}">Stats</a>
  </nav>`;
};

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;
  #menuItem = null;

  constructor (filters, currentFilterType, menuItem) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
    this.#menuItem = menuItem;
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter, this.#menuItem);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.querySelector('.main-navigation__items').addEventListener('click', this.#filterTypeChangeHandler);
  }

  setMenuClickHandler = (callback) => {
    this._callback.menuClick = callback;
    this.element.addEventListener('click', this.#menuClickHandler);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();

    if (!evt.target.dataset.filter) {
      return;
    }

    this._callback.filterTypeChange(evt.target.dataset.filter);
  }

  #menuClickHandler = (evt) => {
    evt.preventDefault();

    if (evt.target.classList.contains('main-navigation__additional')) {
      this._callback.menuClick(MenuItem.STATS);
    } else if (evt.target.dataset.filter) {
      this._callback.menuClick(MenuItem.FILMS);
    }
  }
}
