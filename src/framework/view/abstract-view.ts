import { createElement } from "../render";

/**
 * Абстрактный класс представления
 */
export default class AbstractView {

  /** @type {HTMLElement|null} Элемент представления */
  #element: HTMLElement | null = null;

  /** @type {Object} Объект с колбэками. Может использоваться для хранения обработчиков событий */
  _callback: { [key: string]: any } = {};

  constructor() {
    if (new.target === AbstractView) {
      throw new Error('Can\'t instantiate AbstractView, only concrete one.');
    }
  }

  /**
   * Геттер для получения элемента
   * @returns {HTMLElement} Элемент представления
   */
  get element(): HTMLElement {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  /**
   * Геттер для получения разметки элемента
   * @abstract
   * @returns {string} Разметка элемента в виде строки
   */
  get template(): string {
    throw new Error('Abstract method not implemented: get template');
  }

  /** Метод для удаления элемента */
  removeElement(): void {
    this.#element = null;
  }

}
