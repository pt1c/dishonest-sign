import AbstractView from './view/abstract-view';

/** @enum {string} Перечисление возможных позиций для отрисовки */
const enum RenderPosition {
  BEFOREBEGIN = 'beforebegin',
  AFTERBEGIN = 'afterbegin',
  BEFOREEND = 'beforeend',
  AFTEREND = 'afterend',
};

/**
 * Функция для создания элемента на основе разметки
 * @param {string} template Разметка в виде строки
 * @returns {HTMLElement} Созданный элемент
 */
const createElement = (template: string): HTMLElement => {
  const newElement: HTMLElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstElementChild as HTMLElement;
};

/**
 * Функция для отрисовки элемента
 * @param {AbstractView} component Компонент, который должен был отрисован
 * @param {HTMLElement} container Элемент в котором будет отрисован компонент
 * @param {string} place Позиция компонента относительно контейнера. По умолчанию - `beforeend`
 */
const render = (component: AbstractView, container: HTMLElement, place = RenderPosition.BEFOREEND): void => {
  container.insertAdjacentElement(place, component.element);
};

/**
 * Функция для замены одного компонента на другой
 * @param {AbstractView} newComponent Компонент, который нужно показать
 * @param {AbstractView} oldComponent Компонент, который нужно скрыть
 */
const replace = (newComponent: AbstractView, oldComponent: AbstractView): void => {
  const newElement = newComponent.element;
  const oldElement = oldComponent.element;

  const parent = oldElement.parentElement;

  if (parent === null) {
    throw new Error('Parent element doesn\'t exist');
  }

  parent.replaceChild(newElement, oldElement);
};

/**
 * Функция для удаления компонента
 * @param {AbstractView} component Компонент, который нужно удалить
 */
const remove = (component: AbstractView): void => {
  component.element.remove();
  component.removeElement();
};

export {RenderPosition, createElement, render, replace, remove};
