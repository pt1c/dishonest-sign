import AbstractView from "../framework/view/abstract-view"

export default class ContentWrapper extends AbstractView {
  get template() {
    return (`<div class="content_wrapper"></div>`);
  }
}
