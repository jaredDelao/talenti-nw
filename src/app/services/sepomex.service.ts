import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SepomexService {

  constructor(private http: HttpClient) { }


  getEstadoByCp(cp) {
    let req = {
      sService: 'GetEstadobyCp',
      sCodigoPostal: cp,
    }
    let body = new HttpParams({fromObject: req})
    return this.http.post(environment.urlProd, body);
  }
  getMunicipioByCp(cp) {
    let req = {
      sService: 'GetMunicipiobyCp',
      sCodigoPostal: cp,
    }
    let body = new HttpParams({fromObject: req})
    return this.http.post(environment.urlProd, body);
  }
  getColoniasByCp(cp) {
    let req = {
      sService: 'GetColoniasbyCp',
      sCodigoPostal: cp,
    }
    let body = new HttpParams({fromObject: req})
    return this.http.post(environment.urlProd, body);
  }
}
