import { SortType } from '../utils/const';
import AbstractView from './abstract-view';
import { addClass } from '../utils/utils';

const createSortTemplate = (currentSortType) => {
  const addSortActiveClass = addClass('sort__button--active');

  return `<ul class="sort">
    <li><a href="#" class="sort__button ${addSortActiveClass(currentSortType === SortType.DEFAULT)}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button ${addSortActiveClass(currentSortType === SortType.BY_DATE)}" data-sort-type="${SortType.BY_DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button ${addSortActiveClass(currentSortType === SortType.BY_RAITING)}" data-sort-type="${SortType.BY_RAITING}">Sort by rating</a></li>
  </ul>`;
};

export default class SortView extends AbstractView {
  #currentSortType = null;

  constructor (currentSortType) {
    super();

    this.#currentSortType = currentSortType;
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }
}

