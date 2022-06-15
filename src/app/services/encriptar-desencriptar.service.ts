import { Injectable } from "@angular/core";
import * as cryptoJS from "crypto-js";
import { of } from "rxjs";
import * as bcryptjs from "bcryptjs";

type ProfileLS = "Admin" | "Ejecutivo" | "Analista";

@Injectable({
  providedIn: "root",
})
export class EncriptarDesencriptarService {
  key: string = "secret";

  constructor() {}

  encriptarLocalStorage(value, nombreStorage) {
    let textoCrypt = cryptoJS.AES.encrypt(value, this.key).toString();
    localStorage.setItem(nombreStorage, textoCrypt);
    return true;
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

  isProfile(profile: ProfileLS): boolean {
    let perfil = localStorage.getItem("perfil");
    return bcryptjs.compareSync(profile, perfil);
  }
}
