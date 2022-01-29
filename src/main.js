import { AUTHORIZATION, END_POINT, MenuItem } from './utils/const';
import { remove, render, RenderPosition } from './utils/render';
import FooterStatisticView from './view/footer-statistic-view';
import FilmsPresenter from './presenter/films-presenter';
import FilmsModel from './model/films-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';
import StatisticView from './view/statistic-view';
import ApiService from './api-service';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footerStatisticElement = document.querySelector('.footer__statistics');

const filmsModel = new FilmsModel(new ApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();

const filmsPresenter = new FilmsPresenter(siteHeaderElement, siteMainElement, filmsModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);

let statisticsComponent = null;

const footerStatisticComponent = new FooterStatisticView(filmsModel.films.length);

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.FILMS:
      filterPresenter.init(handleSiteMenuClick);
      filterPresenter.setMenuHandlers();

      if (!siteMainElement.querySelector('.films')) {
        filmsPresenter.init();
      }

      remove(statisticsComponent);
      break;
    case MenuItem.STATS:
      filterPresenter.init(handleSiteMenuClick, MenuItem.STATS);
      filterPresenter.setMenuHandlers();
      filmsPresenter.destroy();
      statisticsComponent = new StatisticView(filmsModel.films);
      render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

render(footerStatisticElement, footerStatisticComponent, RenderPosition.BEFOREEND);

filterPresenter.init(handleSiteMenuClick);
filmsPresenter.init();
filmsModel.init().finally(() => {
  filterPresenter.setMenuHandlers();
  remove(footerStatisticComponent);
  render(footerStatisticElement, new FooterStatisticView(filmsModel.films.length), RenderPosition.BEFOREEND);
});
