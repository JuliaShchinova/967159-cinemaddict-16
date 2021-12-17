import { CARD_COUNT, COMMENT_COUNT } from './utils/const';
import { generateCommentInfo } from './mock/comment';
import { generateFilmInfo } from './mock/film';
import { generateFilter } from './mock/filter';
import { render, RenderPosition } from './utils/render';
import FooterStatisticView from './view/footer-statistic-view';
import MainNavView from './view/main-nav-view';
import ProfileView from './view/profile-view';
import FilmsPresenter from './presenter/films-presenter';

const comments = Array.from({length: COMMENT_COUNT}, generateCommentInfo);
const films = [];

for (let i = 0; i < CARD_COUNT; i++) {
  const film = generateFilmInfo(comments);
  films.push(film);
}

const filters = generateFilter(films);

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

render(siteMainElement, new MainNavView(filters), RenderPosition.BEFOREEND);

if (films.length !== 0) {
  const profileComponent = new ProfileView(films.length);
  render(siteHeaderElement, profileComponent, RenderPosition.BEFOREEND);
}

const filmsPresenter = new FilmsPresenter(siteMainElement);
filmsPresenter.init(films, comments);

const footerStatisticElement = document.querySelector('.footer__statistics');
const footerStatisticComponent = new FooterStatisticView(films.length);
render(footerStatisticElement, footerStatisticComponent, RenderPosition.BEFOREEND);
