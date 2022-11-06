import { AlertType } from "../const";
import AbstractStatefulView from "../framework/view/abstract-stateful-view";

type BadgeElemenState = {
  message?: string,
  messageType: AlertType,
}

export default class BadgeElement extends AbstractStatefulView<BadgeElemenState> {
  constructor(message?: string, messageType?: AlertType){
    super();
    this._state = BadgeElement.parseDataToState(message, messageType);
  }

  get template() {
    const { message, messageType } = this._state;
    return message ? (`<div class="alert alert-${messageType}" role="alert">${message}</div>`) : '<div></div>';
  }

  static parseDataToState = (message?: string, messageType?: AlertType) => (
    { message, messageType: (messageType) ? messageType : AlertType.INFO }
  );
}
