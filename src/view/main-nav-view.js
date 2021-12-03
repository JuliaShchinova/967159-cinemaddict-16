import { createElement } from '../render';

const createFilterItemTemplate = (filters) => {
  const {name, count} = filters;

  const allMoviesTemplate = () => `<a href="#all" class="main-navigation__item main-navigation__item--active">${name}</a>`;

  return name === 'All movies' ?
    allMoviesTemplate() :
    `<a href="#${name.toLowerCase()}" class="main-navigation__item">${name}
      <span class="main-navigation__item-count">${count}</span>
    </a>`;
};

const createMainNavTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems.map((filter, index) => createFilterItemTemplate(filter, index === 0)).join('');

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filterItemsTemplate}
    </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class MainNavView {
  #element = null;
  #filters = null;

  constructor(filters) {
    this.#filters = filters;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createMainNavTemplate(this.#filters);
  }

  removeElement() {
    this.#element = null;
  }
}
