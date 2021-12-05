import { CARD_COUNT, CARD_COUNT_PER_STEP, COMMENT_COUNT, SORT_COUNT } from './const';
import { generateCommentInfo } from './mock/comment';
import { generateFilmInfo } from './mock/film';
import { generateFilter } from './mock/filter';
import { render, RenderPosition } from './render';
import AddCommentView from './view/add-comment-view';
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

  document.body.appendChild(PopupComponent.element);
  PopupComponent.renderComments();
  render(PopupComponent.container, new AddCommentView().element, RenderPosition.AFTEREND);document.body.classList.add('hide-overflow');

  const removePopup = () => {
    document.body.removeChild(PopupComponent.element);
    PopupComponent.removeElement();
    document.body.classList.remove('hide-overflow');
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      removePopup();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  PopupComponent.closeButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    removePopup();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  document.addEventListener('keydown', onEscKeyDown);
};

const renderFilm = (filmListElement, film) => {
  const filmComponent = new FilmCardView(film);

  filmComponent.link.addEventListener('click', (evt) => {
    evt.preventDefault();
    renderPopup(film);
  });

  render(filmListElement, filmComponent.element, RenderPosition.BEFOREEND);
};


const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const filmsComponent = new FilmsView();

const renderFilmsElement = (filmsContainer, filmCards) => {
  const sortComponent = new SortView();
  const filmsListComponent = new FilmsListView();

  render(filmsContainer.element, sortComponent.element, RenderPosition.BEFOREBEGIN);
  render(filmsContainer.element, filmsListComponent.element, RenderPosition.BEFOREEND);

  for (let i = 0; i < Math.min(filmCards.length, CARD_COUNT_PER_STEP); i++) {
    renderFilm(filmsListComponent.container, filmCards[i]);
  }

  if (filmCards.length > CARD_COUNT_PER_STEP) {
    let renderedFilmCount = CARD_COUNT_PER_STEP;

    const ShowMoreButtonComponent = new ShowMoreButtonView();
    render(filmsListComponent.element, ShowMoreButtonComponent.element, RenderPosition.BEFOREEND);

    ShowMoreButtonComponent.element.addEventListener('click', (evt) => {
      evt.preventDefault();

      filmCards.
        slice(renderedFilmCount, renderedFilmCount + CARD_COUNT_PER_STEP).
        forEach((film) => renderFilm(filmsListComponent.container, film));

      renderedFilmCount += CARD_COUNT_PER_STEP;

      if (renderedFilmCount >= filmCards.length) {
        ShowMoreButtonComponent.element.remove();
        ShowMoreButtonComponent.removeElement();
      }
    });
  }

  if (ratedFilms.length !== 0) {
    const FilmsListRatedComponent = new FilmsListView('topRated');
    render(filmsContainer.element, FilmsListRatedComponent.element, RenderPosition.BEFOREEND);

    for (let i = 0; i < SORT_COUNT; i++) {
      renderFilm(FilmsListRatedComponent.container, ratedFilms[i]);
    }
  }

  if (commentedFilms.length !== 0) {
    const FilmsListCommentedComponent = new FilmsListView('mostCommented');
    render(filmsContainer.element, FilmsListCommentedComponent.element, RenderPosition.BEFOREEND);

    for (let i = 0; i < SORT_COUNT; i++) {
      renderFilm(FilmsListCommentedComponent.container, commentedFilms[i]);
    }
  }
};


render(siteMainElement, new MainNavView(filters).element, RenderPosition.BEFOREEND);
render(siteMainElement, filmsComponent.element, RenderPosition.BEFOREEND);

if (films.length === 0) {
  render(siteMainElement, new ListEmptyView().element, RenderPosition.BEFOREEND);
} else {
  const profileComponent = new ProfileView(films.length);
  render(siteHeaderElement, profileComponent.element, RenderPosition.BEFOREEND);

  renderFilmsElement(filmsComponent, films);
}

const footerStatisticElement = document.querySelector('.footer__statistics');
const footerStatisticComponent = new FooterStatisticView(films.length);
render(footerStatisticElement, footerStatisticComponent.element,  RenderPosition.BEFOREEND);


