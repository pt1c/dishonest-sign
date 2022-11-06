import AbstractView from './abstract-view';

/**
 * Абстрактный класс представления с состоянием
 */
export default class AbstractStatefulView<T> extends AbstractView {
  /** @type {Object} Объект состояния */
  _state: T;

  /**
   * Метод для обновления состояния и перерисовки элемента
   * @param {Object} update Объект с обновлённой частью состояния
   */
  updateElement = (update: any) => {
    if (!update) {
      return;
    }

    this._setState(update);

    this.#rerenderElement();
  };

  /**
   * Метод для восстановления обработчиков после перерисовки элемента
   * @abstract
   */
  _restoreHandlers = (): void => {};

  /**
   * Метод для обновления состояния
   * @param {Object} update Объект с обновлённой частью состояния
   */
  _setState = (update: any) => {
    this._state = {...this._state, ...update};
  };

  /** Метод для перерисовки элемента */
  #rerenderElement = () => {
    const prevElement = this.element;
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.element;

    parent.replaceChild(newElement, prevElement);

    this._restoreHandlers();
  };
}
