import AbstractStatefulView from "../framework/view/abstract-stateful-view";
import { IncomingDocumentPosition, Mark } from "../model/crpt.model";

type IncomintDocumentState = {
  positions: IncomingDocumentPosition[];
}

export default class IncomingDocument extends AbstractStatefulView<IncomintDocumentState> {
  #prevButton: HTMLButtonElement = null;

  constructor(incomingDocumentPositions: IncomingDocumentPosition[]){
    super();
    this._state = IncomingDocument.parseIncomingDocumentPositionsToState(incomingDocumentPositions);
  }

  get template() {
    const { positions } = this._state;
    let contentHTML = "";

    contentHTML += `
        <table class="table table-light table-hover table-bordered table-sm">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Название</th>
              <th scope="col">Количество</th>
              <th scope="col">Марка</th>
              <th scope="col"><span class="copy-column"><svg width="16" height="16"><use xlink:href="#copy-result"/></span></th>
            </tr>
          </thead>

          <tbody class="mytab">`;
    positions.forEach((item: IncomingDocumentPosition) => {
      const rowSpan: string = (item.marks.length > 1) ? ` rowspan="${item.marks.length}"`: '';
      const outputChecked: string = item.allChecked ? ' class="table-success"': '';

      item.marks.forEach((mark: Mark, i: number) => {
        const outputMark: string = `<td${mark.checked ? ' class="table-success"' : ''}>${this.#escape(mark.mark)}</td>`;

        const copyButton: string = `
          <td>
            <button class="copy-button" title="Копировать" data-copymark="${this.#escape(mark.mark)}">
              <span class="copy-button-icon"><svg width="16" height="16"><use xlink:href="#copy"/></svg></span>
              <span class="copy-button-result hidden"><svg width="16" height="16"><use xlink:href="#copy-result"/></svg></span>
            </button>
          </td>
        `;

        contentHTML += `<tr${outputChecked}>`;
        if (i == 0) {
          contentHTML += `<td${rowSpan}>${item.number}</td>`;
          contentHTML += `<td${rowSpan}>${this.#escape(item.name)}</td>`;
          contentHTML += `<td${rowSpan}>${item.quantity}</td>`;
          contentHTML += outputMark;
          contentHTML += copyButton;
        } else {
          contentHTML += outputMark;
          contentHTML += copyButton;
        }
        contentHTML += `</tr>`;
      });
    });
    contentHTML += `
      </tbody>
      </table>`;

    return (
      `<div class="table-responsive">${contentHTML}</div>`
    );
  }

  #escape = (html: string) => {
    const rules = [
        { expression: /&/g, replacement: '&amp;'  }, // keep this rule at first position
        { expression: /</g, replacement: '&lt;'   },
        { expression: />/g, replacement: '&gt;'   },
        { expression: /"/g, replacement: '&quot;' },
        { expression: /'/g, replacement: '&#039;' } // or  &#39;  or  &#0039;
                                                    // &apos;  is not supported by IE8
                                                    // &apos;  is not defined in HTML 4
    ];

    let result = html;
    for (let i = 0; i < rules.length; ++i) {
        let rule = rules[i];
        result = result.replace(rule.expression, rule.replacement);
    }
    return result;
  }

  static parseIncomingDocumentPositionsToState(positions: IncomingDocumentPosition[]): IncomintDocumentState{
    return ({ positions });
  }

  setClickHandler = (callback: any) => {
    this._callback.click = callback;
    this.element.querySelector('table').addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt: any) => {
    const path = evt.path || (evt.composedPath && evt.composedPath()); //fix path bug
    const currentButton = path.find((element: any) => element.tagName === 'BUTTON');

    if(!currentButton){
      return;
    }

    if(this.#prevButton){
      this.#prevButton.querySelector('.copy-button-result')?.classList.add('hidden');
      this.#prevButton.querySelector('.copy-button-icon')?.classList.remove('hidden');
    }

    this.#prevButton = currentButton as HTMLButtonElement;

    currentButton.querySelector('.copy-button-icon')?.classList.add('hidden');
    currentButton.querySelector('.copy-button-result')?.classList.remove('hidden');

    this._callback.click(currentButton.dataset.copymark);
  };

  _restoreHandlers = (): void => {
    this.setClickHandler(this._callback.click);
  };
}
