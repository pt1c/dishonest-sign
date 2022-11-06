import AbstractView from "../framework/view/abstract-view";


export default class CheckForm extends AbstractView {
  get template() {
    return (
      `<div>
        <form>
          <div class="input-group mb-3">
            <input type="text" id="mark-input" class="form-control" placeholder="Введи марку для проверки">
            <button class="btn btn-warning" type="submit" id="mark-submit">Проверить</button>
          </div>
        </form>
      </div>`
    );
  }

  setClickHandler = (callback: (markID: string) => void) => {
    this._callback.click = callback;
    this.element.querySelector('#mark-submit').addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt: any) => {
    evt.preventDefault();

    const formInput: HTMLInputElement = this.element.querySelector('#mark-input');
    this._callback.click(formInput.value);
    formInput.value = '';
    formInput.focus();
  };

}
