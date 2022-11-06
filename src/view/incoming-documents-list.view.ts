import AbstractView from "../framework/view/abstract-view";
import { IncomingDocument } from "../model/crpt.model";

export default class IncomingDocumentsList extends AbstractView {
  #documents: IncomingDocument[];
  #prevAnchor: HTMLAnchorElement = null;

  constructor(documents: IncomingDocument[]){
    super();
    this.#documents = documents;
  }

  get template() {
    return (
      `<div class="d-flex flex-column align-items-stretch flex-shrink-0 bg-white" style="width: 380px;">
        <a href="/" class="d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none border-bottom">
          <svg class="bi pe-none me-2" width="30" height="24"><use xlink:href="#crpt"/></svg>
          <span class="fs-5 fw-semibold">Входящие УПД</span>
        </a>
        <div class="list-group list-group-flush border-bottom scrollarea" id="incoming-documents">
          ${this.#documents.map((document: IncomingDocument) => (
            `
            <a href="\#" class="list-group-item list-group-item-action py-3 lh-sm" data-id="${document.id}">
              <div class="d-flex w-100 align-items-center justify-content-between">
                <strong class="mb-1">${document.number}</strong>
                <small>${(document.total_price / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₽</small>
              </div>
              <div class="col-10 mb-1 small">${document.sender_name}</div>
            </a>
            `
          )).join('')}
        </div>
      </div>`
    );
  }

  setClickHandler = (callback: (documentId: string) => void) => {
    this._callback.click = callback;
    this.element.querySelector('#incoming-documents').addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt: any) => {
    this.#prevAnchor && this.#prevAnchor.classList.remove('active');

    const currentAnchor = evt.path.find((element: any) => element.tagName === 'A');
    currentAnchor.classList.add('active');
    this.#prevAnchor = currentAnchor;

    this._callback.click(currentAnchor.dataset.id);
  };
}
