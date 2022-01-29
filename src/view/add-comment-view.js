import SmartView from './smart-view';

const ENTER = 'Enter';
const EMOTIONS = ['smile', 'sleeping', 'puke', 'angry'];

const addCommentTemplate = (data) => {
  const {
    emoji,
    text,
    emojiChecked,
    isDisabled,
  } = data;

  return `<div class="film-details__new-comment">
    <div class="film-details__add-emoji-label">
      ${emoji !== null ? `<img src="images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}"></img>` : '' }
    </div>

    <label class="film-details__comment-label">
      <textarea ${isDisabled ? 'disabled' : ''} class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${text}</textarea>
    </label>

    <div class="film-details__emoji-list">
      ${EMOTIONS.map((emotion) => `
        <input class="film-details__emoji-item visually-hidden"
        ${isDisabled ? 'disabled' : ''}
        name="comment-emoji"
        type="radio"
        id="emoji-${emotion}"
        value="${emotion}"
        ${emojiChecked === `emoji-${emotion}` ? 'checked' : ''}>
        <label class="film-details__emoji-label" for="emoji-${emotion}">
          <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji">
        </label>
      `).join('')}
    </div>
  </div>`;
};

export default class AddCommentView extends SmartView {
  constructor () {
    super();

    this._data = AddCommentView.parseFilmToData();
    this.#setInnerHandlers();
  }

  get template () {
    return addCommentTemplate(this._data);
  }

  restoreHandlers = () => {
    this.setFormKeydownHandler(this._callback.formSubmit);
    this.#setInnerHandlers();
  }

  setFormKeydownHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('.film-details__comment-input').addEventListener('keydown', this.#formKeydownHandler);
  }

  #formKeydownHandler = (evt) => {
    if (evt.key === ENTER && (evt.metaKey === true || evt.ctrlKey === true)) {

      if (!this._data.emoji || !this._data.text) {
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
      text: evt.target.value,
    }, true);
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list').addEventListener('change', this.#emojiChangeHandler);
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#commentInputHandler);
  }

  static parseFilmToData = () => {
    const data = {};

    return {...data,
      emoji: null,
      text: '',
      emojiChecked: '',
      isDisabled: false,
      isSaving: false,
    };
  }

  static parseDataToFilm = (data) => {
    const comment = {...data};

    delete comment.emojiChecked;
    delete comment.isDisabled;
    delete comment.isSaving;

    return comment;
  }
}
