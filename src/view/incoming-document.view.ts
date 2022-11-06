import AbstractStatefulView from "../framework/view/abstract-stateful-view";
import { IncomingDocumentPosition, Mark } from "../model/crpt.model";

type IncomintDocumentState = {
  positions: IncomingDocumentPosition[];
}

export default class IncomingDocument extends AbstractStatefulView<IncomintDocumentState> {

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
            </tr>
          </thead>

          <tbody class="mytab">`;
    positions.forEach((item: IncomingDocumentPosition) => {
      const rowSpan: string = (item.marks.length > 1) ? ` rowspan="${item.marks.length}"`: '';
      const outputChecked: string = item.allChecked ? ' class="table-success"': '';

      item.marks.forEach((mark: Mark, i: number) => {
        const outputMark: string = `<td${mark.checked ? ' class="table-success"' : ''}>${this.#escape(mark.mark)}</td>`;

        contentHTML += `<tr${outputChecked}>`;
        if (i == 0) {
          contentHTML += `<td${rowSpan}>${item.number}</td>`;
          contentHTML += `<td${rowSpan}>${this.#escape(item.name)}</td>`;
          contentHTML += `<td${rowSpan}>${item.quantity}</td>`;
          contentHTML += outputMark;
        } else {
          contentHTML += outputMark;
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

}
