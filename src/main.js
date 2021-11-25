import { RenderPosition, renderTemplate } from './render';
import { createFilmCardTemplate } from './view/film-card-view';
import { createFilmsListTemplate } from './view/films-list-view';
import { createFilmsTemplate } from './view/films-view';
import { createFooterStatisticTemplate } from './view/footer-statistic-view';
import { createMainNavTemplate } from './view/main-nav-view';
import { createProfileTemplate } from './view/profile-view';
import { createShowMoreButtonTemplate } from './view/show-more-button-view';
import { createStatiisticTemplate } from './view/statistic-view';

const CARD_COUNT = 5;

const siteHeaderElement = document.querySelector('.header');

renderTemplate(siteHeaderElement, createProfileTemplate(), RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector('.main');

renderTemplate(siteMainElement, createMainNavTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createFilmsTemplate(), RenderPosition.BEFOREEND);

const filmsElement = siteMainElement.querySelector('.films');

renderTemplate(filmsElement, createFilmsListTemplate(), RenderPosition.BEFOREEND);

const filmsListElement = filmsElement.querySelector('.films-list');
const filmsListContainer = filmsListElement.querySelector('.films-list__container');

for (let i = 0; i < CARD_COUNT; i++) {
  renderTemplate(filmsListContainer, createFilmCardTemplate(), RenderPosition.BEFOREEND);
}

renderTemplate(filmsListElement, createShowMoreButtonTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createStatiisticTemplate(), RenderPosition.BEFOREEND);

const footerStatisticElement = document.querySelector('.footer__statistics');
renderTemplate(footerStatisticElement, createFooterStatisticTemplate(),  RenderPosition.BEFOREEND);

