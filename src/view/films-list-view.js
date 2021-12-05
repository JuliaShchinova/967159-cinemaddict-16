import { createElement } from '../render';
import { addClass } from '../utils/utils';

const createFilmsListTemplate = (header) => {
  let h2;
  const addFilmsListExtraClass = addClass('films-list--extra');
  const addTitleHiddenClass = addClass('visually-hidden');

  switch (header) {
    case 'topRated':
      h2 = 'Top rated';
      break;
    case 'mostCommented':
      h2 = 'Most commented';
      break;
    default:
      h2 = 'All movies. Upcoming';
      break;
  }

  return `<section class="films-list ${addFilmsListExtraClass(header)}">
    <h2 class="films-list__title ${addTitleHiddenClass(!header)}">${h2}</h2>
    <div class="films-list__container">
    </div>
  </section>`;
};

export default class FilmsListView {
  #element = null;
  #container = null;
  #header = null

  constructor (header) {
    this.#header = header;
  }

  get element () {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template () {
    return createFilmsListTemplate(this.#header);
  }

  get container () {
    this.#container = this.element.querySelector('.films-list__container');

    return this.#container;
  }

  removeElement() {
    this.#element = null;
  }
}

