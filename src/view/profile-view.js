import { userRank } from '../utils/const';
import { getUserRank } from '../utils/utils';
import AbstractView from './abstract-view';


const createProfileTemplate = (count) => {
  const profileUserRank = getUserRank(count, userRank);

  return `<section class="header__profile profile">
    ${profileUserRank !== 'None' ? `<p class="profile__rating">${profileUserRank}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35"></img>` : ''}
    </section>
  `;
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
