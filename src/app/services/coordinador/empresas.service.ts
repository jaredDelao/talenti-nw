import { Injectable } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmpresasService {

  constructor(private _http: HttpClient) { }

  getEmpresas() {
    let body = new HttpParams();
    body = body.set('sService', 'getEmpresas');
    return this._http.post('http://localhost/bkService/bkService.php', body,);
  }
}
