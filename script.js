"use strict";

const myTab = document.querySelector(".mytab");
const inputElement = document.querySelector("textarea");
const buttonElement = document.querySelector("button");
const divname = document.querySelector(".divname");
let rowSpan = "";
let contentHTML = "";

buttonElement.addEventListener('click', (evt) => {
    evt.preventDefault();
    const json_data = JSON.parse(inputElement.value);
    myTab.innerHTML = '';
    divname.innerHTML = '';

    divname.innerHTML = json_data.content.author.name;

    json_data.content.products.forEach(item => {
        if(item.good_identification_numbers[0].cis.length > 1){
            rowSpan = ` rowspan="${item.good_identification_numbers[0].cis.length}"`;
        } else {
            rowSpan = "";
        }
    
        item.good_identification_numbers[0].cis.forEach((cis, i) =>{
            contentHTML = `<tr>`;
            if (i == 0) {
                contentHTML += `<td${rowSpan}>${item.number}</td>`;
                contentHTML += `<td${rowSpan}>${HTMLUtils.escape(item.name)}</td>`;
                contentHTML += `<td${rowSpan}>${item.quantity}</td$>`;
                contentHTML += `<td>${HTMLUtils.escape(cis)}</td>`;
            } else {
                contentHTML += `<td>${HTMLUtils.escape(cis)}</td>`;
            }
            
            contentHTML += `</tr>`;
    
            myTab.innerHTML += contentHTML;
        });
    });
});

const HTMLUtils = new function() {
    const rules = [
        { expression: /&/g, replacement: '&amp;'  }, // keep this rule at first position
        { expression: /</g, replacement: '&lt;'   },
        { expression: />/g, replacement: '&gt;'   },
        { expression: /"/g, replacement: '&quot;' },
        { expression: /'/g, replacement: '&#039;' } // or  &#39;  or  &#0039;
                                                    // &apos;  is not supported by IE8
                                                    // &apos;  is not defined in HTML 4
    ];
    this.escape = function(html) {
        let result = html;
        for (let i = 0; i < rules.length; ++i) {
            let rule = rules[i];
            result = result.replace(rule.expression, rule.replacement);
        }
        return result;
    }
};