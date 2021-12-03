import { createElement } from '../render';

const createFilmsListTemplate = () => (
  `<section class="films-list">
    <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    <div class="films-list__container">
    </div>
  </section>`
);

export default class FilmsListView {
  #element = null;
  #container = null;

  get element () {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template () {
    return createFilmsListTemplate();
  }

  get container () {
    this.#container = this.element.querySelector('.films-list__container');

    return this.#container;
  }

  removeElement() {
    this.#element = null;
  }
}

