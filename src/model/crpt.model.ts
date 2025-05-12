import axios from "axios";
import { createAttachedSignature } from "crypto-pro-js";
import { CORSProxy, CRPTEvent, MarkCheck } from "../const";
import Observable from "../framework/observable";
import { getKeyFromStorage, setKeyToStorage } from "../utils/token";

type PreAuthResponse = {
  uuid: string;
  data: string;
};

type AuthRequest = PreAuthResponse;

type AuthResponse = {
  token: string;
  mchdUser: string;
}

type IncomingDocument = {
  id: string,
  number: string,
  total_price: number,
  created_at: number,
  date: number,
  sender_name: string
}

type Mark = {
  mark: string,
  checked: boolean
}

type IncomingDocumentPosition = {
  number: number,
  name: string,
  quantity: number,
  marks: Mark[],
  allChecked: boolean
}

export default class CRPTModel extends Observable {
  #crptKey: string = '';
  #incomingDocuments: IncomingDocument[] = [];
  #incomingDocumentPositions: IncomingDocumentPosition[] = [];

  constructor(){
    super();
    this.#crptKey = getKeyFromStorage();
  }

  get crptKey() {
    return this.#crptKey;
  }

  get incomingDocuments() {
    return this.#incomingDocuments;
  }

  get incomingDocumentPositions() {
    return this.#incomingDocumentPositions;
  }

  #getPreAuth = async (): Promise<PreAuthResponse> => {
    const response = await axios.get(CORSProxy + '/https://markirovka.crpt.ru/api/v3/auth/cert/key');
    return await response.data;
  }

  #getAuth = async (hashed: AuthRequest): Promise<AuthResponse> => {
    const response = await axios.post(CORSProxy + '/https://markirovka.crpt.ru/api/v3/auth/cert/', hashed);
    return await response.data;
  }

  #getIncomingUPD = async(updHash?: string) => {
    const response = await axios.get(CORSProxy + '/https://edo-gismt.crpt.ru/api/v1/incoming-documents' + (updHash ? '/' + updHash : ''), {
      headers: {
        'Authorization': 'Bearer ' + this.#crptKey,
      }
    });
    return await response.data;
  }

  complitAuth = async (certId: string) =>{

    this._notify(CRPTEvent.LOGIN_INFO, 'Прохожу предавторизацию');
    try {
      const { uuid, data } = await this.#getPreAuth();
      this._notify(CRPTEvent.LOGIN_INFO, 'Предавторизация пройдена, данные получены');

      this._notify(CRPTEvent.LOGIN_INFO, 'Начинаю шифровать данные');
      try {
        const hash = await createAttachedSignature(certId, data);
        this._notify(CRPTEvent.LOGIN_INFO, 'Данные зашифрованы');

        const hashed: AuthRequest = {
          uuid: uuid,
          data: hash
        }

        this._notify(CRPTEvent.LOGIN_INFO, 'Пробую войти в ЦРПТ');
        try {
          this.#crptKey = (await this.#getAuth(hashed)).token;
          setKeyToStorage(this.#crptKey);
          //console.log(uuid, data, hash, this.#crptKey);

          this._notify(CRPTEvent.LOGIN_SUCCESS, 'Вход успешный, токен получен');
        } catch (error) {
          this._notify(CRPTEvent.LOGIN_ERROR, 'Не получилось войти в ЦРПТ');
        }
      } catch (error) {
        this._notify(CRPTEvent.LOGIN_ERROR, 'Ошибка шифрования данных');
      }
    } catch (error) {
      this._notify(CRPTEvent.LOGIN_ERROR, 'Ошибка предавторизации');
    }
  }

  getAllUPD = async () => {
    const data = await this.#getIncomingUPD();
    //console.log(data.items);

    this.#incomingDocuments = [];
    data.items.forEach((item: any) => item.documents.forEach((document: any) =>
      this.#incomingDocuments.push({
        id: document.id,
        number: document.number,
        total_price: document.total_price,
        created_at: document.created_at,
        date: document.date,
        sender_name: item.sender.name
      })));

    this._notify(CRPTEvent.DATA_INIT, '');
  }

  getOneUPD = async (documentId: string) => {
    const data = await this.#getIncomingUPD(documentId);
    //console.log(data.content.products);

    this.#incomingDocumentPositions = [];
    data.content.products.forEach((product: any) => {
      const marks: string[] = [];

      //обновление после появления extra_inf
      if(Object.hasOwn(product, 'extra_inf')){
        product.extra_inf.good_identification_numbers.forEach((good: any) => {
          marks.push(...good.cis);
        });
      } else {
        product.good_identification_numbers.forEach((good: any) => {
          marks.push(...good.cis);
        });
      }

      this.#incomingDocumentPositions.push({
        number: product.number,
        name: product.name,
        quantity: product.quantity,
        marks: marks.map((mark: string) => ({mark, checked: false}) ),
        allChecked: false,
      })
    });
    //console.log(this.#incomingDocumentPositions);

    this._notify(CRPTEvent.DATA_INIT_ONE, '');
  }

  checkMark = (inputMark: string) => {
    let isFound: boolean = false;
    let checkMark = inputMark;

    if(checkMark.length > 31) {
      checkMark = checkMark.substring(0, 31);
    }

    this.#incomingDocumentPositions.forEach((item) =>
      item.marks.forEach((mark) => {
        if(mark.mark === checkMark){
          isFound = true;
          mark.checked = true;

          //проверка на остальные марки в одной позиции
          if(item.marks.every((otherMark) => otherMark.checked)){
            item.allChecked = true;
          }
        }
      })
    );

    if(isFound){
      const isAllFound = this.#incomingDocumentPositions.every((position: IncomingDocumentPosition) => position.allChecked) || false;

      this._notify(CRPTEvent.MARK_CHECK, {
        result: MarkCheck.OK,
        message: (isAllFound) ? 'Все марки найдены и проверены' : '',
        positions: this.#incomingDocumentPositions } );
    } else {
      this._notify(CRPTEvent.MARK_CHECK, { result: MarkCheck.NOT_FOUND, message: 'Марка не найдена'});
    }
  }

}

export type { PreAuthResponse, AuthRequest, AuthResponse, IncomingDocument, IncomingDocumentPosition, Mark };
