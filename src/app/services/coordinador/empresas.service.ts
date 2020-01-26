import { Injectable } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Empresas } from 'src/app/interfaces/talenti/coordinador/empresas';
import { CatalogoEstudios } from 'src/app/interfaces/talenti/coordinador/catalogo-estudios';

@Injectable({
  providedIn: 'root'
})
export class EmpresasService {

  constructor(private _http: HttpClient) { }

  getEmpresas(): Observable<Empresas> {
    let body = new HttpParams();
    body = body.set('sService', 'getEmpresas');
    return this._http.post<Empresas>(environment.urlGet, body,);
  }

  getCatalogoEstudios(): Observable<CatalogoEstudios> {
    let body = new HttpParams();
    body = body.set('sService', 'getLstEstudios');
    return this._http.post<CatalogoEstudios>(environment.urlGet, body);
  }
}
