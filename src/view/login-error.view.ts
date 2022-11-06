import AbstractView from "../framework/view/abstract-view";

export default class LoginErrorView extends AbstractView {
  get template() {
    return (
      `<div>
        <p>В системе не обнаружено сертификатов или ошибка установки крипто-плагина</p>
      </div>`
    );
  }
}
