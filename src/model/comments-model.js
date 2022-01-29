import AbstractObservable from '../utils/abstract-observable';
import { UserAction } from '../utils/const';

export default class CommentsModel extends AbstractObservable {
  #apiService = null;
  #comments = [];

  constructor (apiService) {
    super();
    this.#apiService = apiService;
  }

  get comments () {
    return this.#comments;
  }

  init = async (film) => {
    try {
      const comments = await this.#apiService.getComments(film);
      this.#comments = comments.map(this.#adaptToClient);
    } catch (err) {
      this.#comments = [];
    }

    this._notify(UserAction.INIT_COMMENTS);
  }

  addComment = async (actionType, update, id) => {
    try {
      const response = await this.#apiService.addComment(id, update);
      this.#comments = response.comments.map(this.#adaptToClient);
      this._notify(actionType, response);
    } catch (err) {
      throw new Error('Can\'t add comment');
    }
  }

  deleteComment = async (actionType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    try {
      await this.#apiService.deleteComment(update);

      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];

      this._notify(actionType, update);
    } catch (err) {
      throw new Error('Can\'t delete comment');
    }
  }

  #adaptToClient = (comment) => {
    const adaptedComment = {...comment, text: comment.comment};
    delete adaptedComment.comment;

    return adaptedComment;
  }
}
