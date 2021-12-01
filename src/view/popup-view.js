import { addActiveClass, getDurationTime, getFormatDate } from '../utils/utils';
import { addCommentTemplate } from './add-comment-view';
import { createCommentItemTemplate } from './comment-view';

export const createPopupTemplate = (film = {}, allComments = []) => {
  const {title, alternativeTitle, totalRating, ageRating, poster, director, writers, actors, comments, release, description, runtime, genres, userDetails} = film;

  const genresTitle = genres.length > 1 ? 'Genres' : 'Genre';

  const getGenresList = (genresList) => genresList.map((genre) => `<span class="film-details__genre">${genre}</span>`).join('');

  const addFilmDetaisActiveClass = addActiveClass('film-details__control-button--active');

  const createCommentsTemplate = () => {
    const templates = [];

    for (const commentId of comments) {
      const comment = allComments.find((c) => commentId === c.id);
      templates.push(createCommentItemTemplate(comment));
    }

    return templates.join('');
  };

  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${poster}" alt="${title}">

            <p class="film-details__age">${ageRating}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">Original: ${alternativeTitle}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${totalRating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${writers.join(', ')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${actors.join(', ')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${getFormatDate(release.date, 'DD MMMM YYYY')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${getDurationTime(runtime, 'minute')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${release.releaseCountry}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${genresTitle}</td>
                <td class="film-details__cell">${getGenresList(genres)}</tr>
            </table>

            <p class="film-details__film-description">${description}</p>
          </div>
        </div>

        <section class="film-details__controls">
          <button type="button" class="film-details__control-button film-details__control-button--watchlist ${addFilmDetaisActiveClass(userDetails.isInWatchlist)}" id="watchlist" name="watchlist">Add to watchlist</button>
          <button type="button" class="film-details__control-button film-details__control-button--watched ${addFilmDetaisActiveClass(userDetails.isAlreadyWatched)}" id="watched" name="watched">Already watched</button>
          <button type="button" class="film-details__control-button film-details__control-button--favorite ${addFilmDetaisActiveClass(userDetails.isFavorites)}" id="favorite" name="favorite">Add to favorites</button>
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

          <ul class="film-details__comments-list">${createCommentsTemplate()}
          </ul>

          ${addCommentTemplate()}
        </section>
      </div>
    </form>
  </section>`;
};
