import AbstractView from "../framework/view/abstract-view";
import { Certificate } from "crypto-pro-js";
import * as dayjs from 'dayjs'
dayjs().format()


export default class LoginView extends AbstractView {
  #certs: Certificate[];

  constructor(certs: Certificate[]){
    super();
    this.#certs = certs;
  }

  get template() {
    return (
      `
      <div class="login_container">
        <svg class="mb-4" width="72" height="57"><use xlink:href="#perfume"/></svg>
        <form>
          <h1 class="h3 mb-4 fw-normal">Вход в (не)честный знак</h1>

          <div class="form-floating mb-3">
            <select class="form-select" id="cert-list-box" required="">
              ${this.#certs.map((cert: any) => `<option value="${cert.thumbprint}">${cert.name} годен до ${dayjs(cert.validTo).format('DD/MM/YYYY')}</option>`).join('')}
            </select>
            <label for="cert-list-box" class="form-label">Ключ для входа</label>
          </div>

          <button class="w-100 btn btn-lg btn-warning" type="submit"><span id="logintext" class="button-text">Войти</span><span id="loginloader" class="login-loader"> </span></button>
          <p class="mt-5 mb-3 text-muted">2022 &copy; savinov.kirill</p>
        </form>
      </div>
      `
    );
  }

  setClickHandler = (callback: (certID: string) => void) => {
    this._callback.click = callback;
    this.element.querySelector('button[type="submit"]').addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt: Event) => {
    evt.preventDefault();

    const formBox: HTMLSelectElement = this.element.querySelector('#cert-list-box');
    this._callback.click(formBox.options[formBox.selectedIndex].value);
  };

  toggleButton = (mode?: boolean): void => {
    const formButton: HTMLButtonElement = this.element.querySelector('button[type="submit"]');
    mode ? formButton.disabled = mode : formButton.disabled = !formButton.disabled;

    const logintext: HTMLSpanElement = this.element.querySelector('#logintext');
    const loginloader: HTMLSpanElement = this.element.querySelector('#loginloader');
    if(mode){
      logintext.style.display = 'none';
      loginloader.style.display = 'inline-block';
    } else {
      logintext.style.display = 'inline-block';
      loginloader.style.display = 'none';
    }
  }
}
