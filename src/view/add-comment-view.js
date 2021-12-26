import { EMOTIONS, ENTER } from '../utils/const';
import SmartView from './smart-view';

const addCommentTemplate = (data) => (
  `<div class="film-details__new-comment">
    <div class="film-details__add-emoji-label">
      ${data.emoji !== null ? `<img src="images/emoji/${data.emoji}.png" width="55" height="55" alt="emoji-${data.emoji}"></img>` : '' }
    </div>

    <label class="film-details__comment-label">
      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${data.comment}</textarea>
    </label>

    <div class="film-details__emoji-list">
      ${EMOTIONS.map((emoji) => `
        <input class="film-details__emoji-item visually-hidden"
        name="comment-emoji"
        type="radio"
        id="emoji-${emoji}"
        value="${emoji}"
        ${data.emojiChecked === `emoji-${emoji}` ? 'checked' : ''}>
        <label class="film-details__emoji-label" for="emoji-${emoji}">
          <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
        </label>
      `).join('')}
    </div>
  </div>`
);

export default class AddCommentView extends SmartView {
  #film = null;
  #commentInput = null;

  constructor (film) {
    super();

    this._data = AddCommentView.parseFilmToData(film);
    this.setFormSubmitHandler(this.#commentSubmit);//
    this.#setInnerHandlers();
  }

  get template () {
    return addCommentTemplate(this._data);
  }

  restoreHandlers = () => {
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.#setInnerHandlers();
  }

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.#commentInput = this.element.querySelector('.film-details__comment-input');
    this.#commentInput.addEventListener('keydown', this.#formSubmitHandler);
  }

  // reset = (film) => {
  //   this.updateData(AddCommentView.parseFilmToData(film));
  // }

  #formSubmitHandler = (evt) => {
    if (evt.key === ENTER && (evt.metaKey === true || evt.ctrlKey === true)) {

      if (!this._data.emoji || !this._data.comment) {
        return;
      }

      evt.preventDefault();
      this._callback.formSubmit(AddCommentView.parseDataToFilm(this._data));
    }
  }

  #emojiChangeHandler = (evt) => {
    evt.preventDefault();

    if (this._data.emoji === evt.target.value) {
      return;
    }

    this.updateData({
      emoji: evt.target.value,
      emojiChecked: evt.target.id,
    });
  }

  #commentInputHandler = (evt) => {
    this.updateData({
      comment: evt.target.value,
    }, true);
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list').addEventListener('change', this.#emojiChangeHandler);
    this.#commentInput.addEventListener('input', this.#commentInputHandler);
  }

  #commentSubmit = () => {
    this.#commentInput.disabled = true;
  }//

  static parseFilmToData = (film) => ({...film,
    emoji: null,
    comment: '',
    emojiChecked: ''
  });

  static parseDataToFilm = (data) => {
    const film = {...data};

    delete film.emoji;
    delete film.comment;
    delete film.emojiChecked;

    return film;
  }
}
