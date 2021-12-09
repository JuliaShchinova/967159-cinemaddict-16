import AbstractView from './abstract-view';

const createProfileTemplate = (count) => {
  const raiting = {
    'Novice': {
      min: 1,
      max: 10
    },
    'Fan': {
      min: 11,
      max: 20
    },
    'Movie Buff': {
      min: 21,
      max: Infinity
    }
  };

  const defineRank = () => {
    const rank = Object.keys(raiting).find((key) => count >= raiting[key].min && count < raiting[key].max);

    return rank;
  };

  return `<section class="header__profile profile">
    <p class="profile__rating">${defineRank()}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class ProfileView extends AbstractView {
  #count = null;

  constructor (count) {
    super();
    this.#count = count;
  }

  get template () {
    return createProfileTemplate(this.#count);
  }
}
