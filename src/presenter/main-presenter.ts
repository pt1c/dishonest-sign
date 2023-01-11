import { remove, render } from "../framework/render";
import LoginView from "../view/login.view";
import CertModel from "../model/cert.model";
import LoginErrorView from "../view/login-error.view";
import CRPTModel from "../model/crpt.model";
import { AlertType, CRPTEvent, MarkCheck } from "../const";
import IncomingDocumentsList from "../view/incoming-documents-list.view";
import IncomingDocument from "../view/incoming-document.view";
import CheckForm from "../view/check-form.view";
import ContentWrapper from "../view/content-wrapper.view";
import BadgeElement from "../view/badge-element.view";


export default class MainPresenter {
  #mainContainer: HTMLElement = null;

  #loginView: LoginView = null;
  #incomingDocumentsList: IncomingDocumentsList = null;
  #incomingDocument: IncomingDocument = null;
  #checkForm: CheckForm = null;
  #contentWrapper: ContentWrapper = null;
  #badgeElement: BadgeElement = null;

  //models
  #certModel = new CertModel();
  #CRPTModel = new CRPTModel();

  constructor(mainContainer: HTMLElement){
    this.#mainContainer = mainContainer;

    this.#certModel.addObserver(this.#handleCertEvent);
    this.#CRPTModel.addObserver(this.#handleCRPTEvent);
  }


  init = async () => {
    if(this.#CRPTModel.crptKey) {
      // если попали сюда ключ валидный
      this.#CRPTModel.getAllUPD();

    } else {
      // загружаем сертификаты и форму логина
      this.#certModel.loadCerts();
    }

  }

  //показывает форму логина. обновляет ее при событии от модели церт.модел
  #showLoginForm = () => {
    if(!this.#certModel.certs){
      render(new LoginErrorView(), this.#mainContainer);
      return;
    }

    this.#loginView = new LoginView(this.#certModel.certs);
    render(this.#loginView, this.#mainContainer);

    this.#loginView.setClickHandler(this.#handleClickSignIn);
  }

  //отрабатывает клик на кнопку входа
  #handleClickSignIn = (certID: string): void => {
    //блокируем кнопку
    this.#loginView.toggleButton(true);

    //пробуем залогинится
    this.#CRPTModel.complitAuth(certID);
  }

  //выводит компонент с документами
  #showIncomingDocumentsList = () => {
    this.#incomingDocumentsList = new IncomingDocumentsList(this.#CRPTModel.incomingDocuments);
    render(this.#incomingDocumentsList, this.#mainContainer);

    this.#incomingDocumentsList.setClickHandler(this.#handleClickDocument);
  }

  //отрабатывает клик на документ из спика
  #handleClickDocument = (documentId: string): void => {
    this.#CRPTModel.getOneUPD(documentId);
  }

  //выводит один документ
  #showIncomingDocument = () => {
    if(this.#incomingDocument){
      remove(this.#incomingDocument);
      remove(this.#checkForm);
      remove(this.#badgeElement);
    }

    if(!this.#contentWrapper){
      this.#contentWrapper = new ContentWrapper();
      render(this.#contentWrapper, this.#mainContainer);
    }

    this.#checkForm = new CheckForm();
    render(this.#checkForm, this.#contentWrapper.element);
    this.#checkForm.setClickHandler(this.#handleClickCheckForm);

    this.#badgeElement = new BadgeElement();
    render(this.#badgeElement, this.#contentWrapper.element);

    this.#incomingDocument = new IncomingDocument(this.#CRPTModel.incomingDocumentPositions);
    render(this.#incomingDocument, this.#contentWrapper.element);
    this.#incomingDocument.setClickHandler(this.#handleClickCopyMark);
  }

  //отрабатывает клик на кнопку проверки марки
  #handleClickCheckForm = (markId: string): void => {
    this.#CRPTModel.checkMark(markId);
  }

  //отрабатывает клик на кнопку копирования марки
  #handleClickCopyMark = (markId: string): void => {
    navigator.clipboard.writeText(markId);
  }

  //хендлы обсервера
  //ловит обновление от модели церт.модел
  #handleCertEvent = (): void => {
    this.#showLoginForm();
  };

  //ловит обновление от модели CRPTModel
  #handleCRPTEvent = (crptEvent: CRPTEvent, payload: any): void => {
    switch (crptEvent) {
      case CRPTEvent.DATA_INIT:
        this.#showIncomingDocumentsList();
        break;

      case CRPTEvent.DATA_INIT_ONE:
        this.#showIncomingDocument();
        break;

      case CRPTEvent.LOGIN_SUCCESS:
        window.location.reload();
        break;

      case CRPTEvent.LOGIN_ERROR:
        //разблокируем кнопку
        this.#loginView.toggleButton(false);
        break;

      case CRPTEvent.LOGIN_INFO:
        console.log(crptEvent, payload);
        break;

      case CRPTEvent.MARK_CHECK:
        switch(payload.result){
          case MarkCheck.OK:
            this.#incomingDocument.updateElement(payload.positions);
            this.#badgeElement.updateElement({message: payload.message, messageType: AlertType.SUCCESS});
            break;

          case MarkCheck.NOT_FOUND:
            this.#badgeElement.updateElement({message: payload.message, messageType: AlertType.DANGER});
            break;
        }
        break;
    }
  };

}
