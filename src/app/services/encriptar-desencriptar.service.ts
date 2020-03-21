import { Injectable } from '@angular/core';
import * as cryptoJS from 'crypto-js';
import { of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EncriptarDesencriptarService {

  key: string = 'secret';

  constructor() { }

  encriptarLocalStorage(value, nombreStorage) {
    let textoCrypt = cryptoJS.AES.encrypt(value, this.key).toString();
    localStorage.setItem(nombreStorage, textoCrypt);
    return of({ok: true});
  }

  encriptar(value) {
    let textoCrypt = cryptoJS.AES.encrypt(value, this.key).toString();
    return of(textoCrypt);
  }

  desencriptar(code) {
    let bytes = cryptoJS.AES.decrypt(code, this.key);
    let ci = bytes.toString(cryptoJS.enc.Utf8);
    return of(ci);
  }
}
