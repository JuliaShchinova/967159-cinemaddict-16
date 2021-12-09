import { CARD_COUNT, CARD_COUNT_PER_STEP, COMMENT_COUNT, SORT_COUNT } from './utils/const';
import { generateCommentInfo } from './mock/comment';
import { generateFilmInfo } from './mock/film';
import { generateFilter } from './mock/filter';
import { remove, render, RenderPosition } from './utils/render';
import FilmCardView from './view/film-card-view';
import FilmsListView from './view/films-list-view';
import FilmsView from './view/films-view';
import FooterStatisticView from './view/footer-statistic-view';
import ListEmptyView from './view/list-empty-view';
import MainNavView from './view/main-nav-view';
import PopupView from './view/popup-view';
import ProfileView from './view/profile-view';
import ShowMoreButtonView from './view/show-more-button-view';
import SortView from './view/sort-view';

const comments = Array.from({length: COMMENT_COUNT}, generateCommentInfo);
const films = [];

for (let i = 0; i < CARD_COUNT; i++) {
  const film = generateFilmInfo(comments);
  films.push(film);
}

const ratedFilms = films
  .filter((film) => film.totalRating !== 0)
  .sort((a, b) => b.totalRating - a.totalRating)
  .slice(0, SORT_COUNT);

const commentedFilms = films
  .filter((film) => film.comments.length !==0)
  .sort((a, b) => b.comments.length - a.comments.length)
  .slice(0, SORT_COUNT);

const filters = generateFilter(films);

const renderPopup = (film) => {
  if (document.body.querySelector('.film-details')) {
    document.body.querySelector('.film-details').remove();
  }

  const PopupComponent = new PopupView(film, comments);

  render(document.body, PopupComponent, RenderPosition.BEFOREEND);
  PopupComponent.renderComments();
  PopupComponent.renderAddComment();
  document.body.classList.add('hide-overflow');

  const removePopup = () => {
    remove(PopupComponent);
    document.body.classList.remove('hide-overflow');
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      removePopup();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  PopupComponent.setCloseClickHandler(() => {
    removePopup();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  document.addEventListener('keydown', onEscKeyDown);
};

const renderFilm = (filmListElement, film) => {
  const filmComponent = new FilmCardView(film);

  filmComponent.setLinkClickHandler(() => {
    renderPopup(film);
  });

  const parent = filmListElement.container ? filmListElement.container : filmListElement;
  render(parent, filmComponent, RenderPosition.BEFOREEND);
};

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const filmsComponent = new FilmsView();

const renderFilmsElement = (filmsContainer, filmCards) => {
  const sortComponent = new SortView();
  const filmsListComponent = new FilmsListView();

  render(filmsContainer, sortComponent, RenderPosition.BEFOREBEGIN);
  render(filmsContainer, filmsListComponent, RenderPosition.BEFOREEND);

  for (let i = 0; i < Math.min(filmCards.length, CARD_COUNT_PER_STEP); i++) {
    renderFilm(filmsListComponent, filmCards[i]);
  }

  if (filmCards.length > CARD_COUNT_PER_STEP) {
    let renderedFilmCount = CARD_COUNT_PER_STEP;

    const ShowMoreButtonComponent = new ShowMoreButtonView();
    render(filmsListComponent, ShowMoreButtonComponent, RenderPosition.BEFOREEND);

    ShowMoreButtonComponent.setClickHandler(() => {
      filmCards.
        slice(renderedFilmCount, renderedFilmCount + CARD_COUNT_PER_STEP).
        forEach((film) => renderFilm(filmsListComponent, film));

      renderedFilmCount += CARD_COUNT_PER_STEP;

      if (renderedFilmCount >= filmCards.length) {
        remove(ShowMoreButtonComponent);
      }
    });
  }

  if (ratedFilms.length !== 0) {
    const FilmsListRatedComponent = new FilmsListView('topRated');
    render(filmsContainer, FilmsListRatedComponent, RenderPosition.BEFOREEND);

    for (let i = 0; i < SORT_COUNT; i++) {
      renderFilm(FilmsListRatedComponent, ratedFilms[i]);
    }
  }

  if (commentedFilms.length !== 0) {
    const FilmsListCommentedComponent = new FilmsListView('mostCommented');
    render(filmsContainer, FilmsListCommentedComponent, RenderPosition.BEFOREEND);

    for (let i = 0; i < SORT_COUNT; i++) {
      renderFilm(FilmsListCommentedComponent, commentedFilms[i]);
    }
  }
};


render(siteMainElement, new MainNavView(filters), RenderPosition.BEFOREEND);
render(siteMainElement, filmsComponent, RenderPosition.BEFOREEND);

if (films.length === 0) {
  render(siteMainElement, new ListEmptyView(), RenderPosition.BEFOREEND);
} else {
  const profileComponent = new ProfileView(films.length);
  render(siteHeaderElement, profileComponent, RenderPosition.BEFOREEND);

  renderFilmsElement(filmsComponent, films);
}

const footerStatisticElement = document.querySelector('.footer__statistics');
const footerStatisticComponent = new FooterStatisticView(films.length);
render(footerStatisticElement, footerStatisticComponent, RenderPosition.BEFOREEND);


