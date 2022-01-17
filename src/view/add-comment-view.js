import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
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

  // reset = (film) => {
  //   this.updateData(AddCommentView.parseFilmToData());
  // }

  #formKeydownHandler = (evt) => {
    if (evt.key === ENTER && (evt.metaKey === true || evt.ctrlKey === true)) {

      if (!this._data.emoji || !this._data.comment) {
        return;
      }

      evt.preventDefault();
      this.#disableForm();

      const newComment = {
        id: nanoid(), //
        author: 'New Author', //
        text: this._data.comment,
        date: dayjs(Date.now()).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),//
        emotion: this._data.emoji,
      };

      AddCommentView.parseDataToFilm(this._data);
      this._callback.formSubmit(newComment);

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
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#commentInputHandler);
  }

  #disableForm = () => {
    this.element.querySelector('.film-details__comment-input').disabled = true;
    this.element.querySelector('.film-details__emoji-list').disabled = true;
  }

  static parseFilmToData = () => {
    const data = {};

    return {...data,
      emoji: null,
      comment: '',
      emojiChecked: ''
    };
  }

  static parseDataToFilm = (data) => {
    const comment = {...data};

    delete comment.emoji;
    delete comment.comment;
    delete comment.emojiChecked;

    return comment;
  }
}
