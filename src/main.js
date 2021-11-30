import { CARD_COUNT, CARD_COUNT_PER_STEP, COMMENT_COUNT } from './const';
import { generateCommentInfo } from './mock/comment';
import { generateFilmInfo } from './mock/film';
import { generateFilter } from './mock/filter';
import { RenderPosition, renderTemplate } from './render';
import { createFilmCardTemplate } from './view/film-card-view';
import { createFilmsListTemplate } from './view/films-list-view';
import { createFilmsTemplate } from './view/films-view';
import { createFooterStatisticTemplate } from './view/footer-statistic-view';
import { createMainNavTemplate } from './view/main-nav-view';
import { createPopupTemplate } from './view/popup-view';
import { createProfileTemplate } from './view/profile-view';
import { createShowMoreButtonTemplate } from './view/show-more-button-view';
import { createStatiisticTemplate } from './view/statistic-view';


const comments = Array.from({length: COMMENT_COUNT}, generateCommentInfo);
const films = [];

for (let i = 0; i < CARD_COUNT; i++) {
  const film = generateFilmInfo(comments);
  films.push(film);
}

const filters = generateFilter(films);

const siteHeaderElement = document.querySelector('.header');

renderTemplate(siteHeaderElement, createProfileTemplate(), RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector('.main');

renderTemplate(siteMainElement, createMainNavTemplate(filters), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createFilmsTemplate(), RenderPosition.BEFOREEND);

const filmsElement = siteMainElement.querySelector('.films');

renderTemplate(filmsElement, createFilmsListTemplate(), RenderPosition.BEFOREEND);

const filmsListElement = filmsElement.querySelector('.films-list');
const filmsListContainer = filmsListElement.querySelector('.films-list__container');

for (let i = 0; i < Math.min(films.length, CARD_COUNT_PER_STEP); i++) {
  renderTemplate(filmsListContainer, createFilmCardTemplate(films[i]), RenderPosition.BEFOREEND);
}

if (films.length > CARD_COUNT_PER_STEP) {
  let renderedFilmCount = CARD_COUNT_PER_STEP;

  renderTemplate(filmsListElement, createShowMoreButtonTemplate(), RenderPosition.BEFOREEND);

  const loadMoreButton = filmsListElement.querySelector('.films-list__show-more');

  loadMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();

    films.
      slice(renderedFilmCount, renderedFilmCount + CARD_COUNT_PER_STEP).
      forEach((film) => renderTemplate(filmsListContainer, createFilmCardTemplate(film), RenderPosition.BEFOREEND));

    renderedFilmCount += CARD_COUNT_PER_STEP;

    if (renderedFilmCount >= films.length) {
      loadMoreButton.remove();
    }
  });
}

renderTemplate(siteMainElement, createStatiisticTemplate(), RenderPosition.BEFOREEND);

renderTemplate(document.body, createPopupTemplate(films[0], comments), RenderPosition.BEFOREEND);

const filmDelails = document.querySelector('.film-details');

if (filmDelails) {
  const closeButton = filmDelails.querySelector('.film-details__close-btn');
  closeButton.addEventListener('click', () => filmDelails.remove());
}

const footerStatisticElement = document.querySelector('.footer__statistics');
renderTemplate(footerStatisticElement, createFooterStatisticTemplate(),  RenderPosition.BEFOREEND);

