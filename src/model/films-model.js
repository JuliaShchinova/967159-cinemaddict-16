import AbstractObservable from '../utils/abstract-observable';
import { SORT_COUNT, UpdateType } from '../utils/const';

export default class FilmsModel extends AbstractObservable {
  #apiService = null;
  #films = [];

  constructor (apiService) {
    super();
    this.#apiService = apiService;
  }

  get films () {
    return this.#films;
  }

  get topRatedFilms () {
    return this.#films
      .filter((film) => film.totalRating !== 0)
      .sort((a, b) => b.totalRating - a.totalRating)
      .slice(0, SORT_COUNT);
  }

  get mostCommentedFilms () {
    return this.#films
      .filter((film) => film.comments.length !==0)
      .sort((a, b) => b.comments.length - a.comments.length)
      .slice(0, SORT_COUNT);
  }

  init = async () => {
    try {
      const films = await this.#apiService.films;
      this.#films = films.map(this.#adaptToClient);
    } catch (err) {
      this.#films = [];
    }

    this._notify(UpdateType.INIT);
  }

  updateFilm = async (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    try {
      const response = await this.#apiService.updateFilm(update);
      const updatedFilm = this.#adaptToClient(response);

      this.#films = [
        ...this.#films.slice(0, index),
        updatedFilm,
        ...this.#films.slice(index + 1),
      ];

      this._notify(updateType, updatedFilm);
    } catch (err) {
      throw new Error('Can\'t update film');
    }
  }

  #adaptToClient = (film) => {
    const adaptedFilm = {...film,
      filmInfo: {...film['film_info'],
        alternativeTitle: film['film_info']['alternative_title'],
        totalRating: film['film_info']['total_rating'],
        ageRating: film['film_info']['age_rating'],
        release: {...film['film_info'].release, releaseCountry: film['film_info'].release['release_country']
        }
      },
      userDetails: {
        isInWatchlist: film['user_details'].watchlist,
        isAlreadyWatched: film['user_details']['already_watched'],
        watchingDate: new Date(film['user_details']['watching_date']),
        isFavorites: film['user_details'].favorite,
      },
    };

    delete adaptedFilm['film_info'];
    delete adaptedFilm['user_details'];
    delete adaptedFilm.filmInfo['alternative_title'];
    delete adaptedFilm.filmInfo['total_rating'];
    delete adaptedFilm.filmInfo['age_rating'];
    delete adaptedFilm.filmInfo.release['release_country'];

    return adaptedFilm;
  }
}
