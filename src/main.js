import { CARD_COUNT, MenuItem } from './utils/const';
import { generateFilmInfo } from './mock/film';
import { remove, render, RenderPosition } from './utils/render';
import FooterStatisticView from './view/footer-statistic-view';
import FilmsPresenter from './presenter/films-presenter';
import FilmsModel from './model/films-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';
import StatisticView from './view/statistic-view';


const films = Array.from({length: CARD_COUNT}, generateFilmInfo);

const filmsModel = new FilmsModel();
filmsModel.films = films;

const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footerStatisticElement = document.querySelector('.footer__statistics');

const filmsPresenter = new FilmsPresenter(siteHeaderElement, siteMainElement, filmsModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);

const footerStatisticComponent = new FooterStatisticView(films.length);

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.FILMS:
      filterPresenter.init(handleSiteMenuClick);

      if (!siteMainElement.querySelector('.films')) {
        filmsPresenter.init();
      }

      remove(statisticsComponent);
      break;
    case MenuItem.STATS:
      filterPresenter.init(handleSiteMenuClick, MenuItem.STATS);
      filmsPresenter.destroy();
      statisticsComponent = new StatisticView(filmsModel.films);
      render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

filterPresenter.init(handleSiteMenuClick);
filmsPresenter.init();

render(footerStatisticElement, footerStatisticComponent, RenderPosition.BEFOREEND);
