import { addClass } from '../utils/utils';
import AbstractView from './abstract-view';

const createFilmsListTemplate = (header) => {
  let headerText;
  const addFilmsListExtraClass = addClass('films-list--extra');
  const addTitleHiddenClass = addClass('visually-hidden');

  switch (header) {
    case 'topRated':
      headerText = 'Top rated';
      break;
    case 'mostCommented':
      headerText = 'Most commented';
      break;
    default:
      headerText = 'All movies. Upcoming';
      break;
  }

  return `<section class="films-list ${addFilmsListExtraClass(header)}">
    <h2 class="films-list__title ${addTitleHiddenClass(!header)}">${headerText}</h2>
    <div class="films-list__container">
    </div>
  </section>`;
};

export default class FilmsListView extends AbstractView {
  #container = null;
  #header = null

  constructor (header) {
    super();
    this.#header = header;
  }

  get template () {
    return createFilmsListTemplate(this.#header);
  }

  get container () {
    this.#container = this.element.querySelector('.films-list__container');

    return this.#container;
  }
}

