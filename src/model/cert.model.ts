import { Certificate, getUserCertificates } from "crypto-pro-js";
import { UpdateType } from "../const";
import Observable from "../framework/observable";

export default class CertModel extends Observable {

  #certificates: Certificate[];

  get certs() {
    return this.#certificates;
  }

  loadCerts = async () => {
    try {
      this.#certificates = await getUserCertificates();
    } catch (error) {
      // ...
    }

    this._notify(UpdateType.INIT, '');
  };

}
