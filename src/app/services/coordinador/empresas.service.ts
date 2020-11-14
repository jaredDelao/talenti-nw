import { Injectable } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { Empresas } from 'src/app/interfaces/talenti/coordinador/empresas';
import { CatalogoEstudios } from 'src/app/interfaces/talenti/coordinador/catalogo-estudios';
import { map } from 'rxjs/operators';
import { Empresa } from 'src/app/models/empresas.model';

@Injectable({
  providedIn: 'root'
})
export class EmpresasService {

  idTipo = new BehaviorSubject(0);
  $idTipo = this.idTipo.asObservable();
  
  constructor(private _http: HttpClient) { 
    
  }

  getEmpresas(): Observable<Empresas> {
    let body = new HttpParams();
    body = body.set('sService', 'getEmpresas');
    return this._http.post<Empresas>(environment.urlProd, body).pipe(
      map((emp:any) => emp.Empresas)
    )
  }

  registrarEmpresa(body) {
    let params = new HttpParams({fromObject: body});
    return this._http.post(environment.urlProd, params);
  }

  getCatalogoEstudios(p): Observable<CatalogoEstudios> {
    // let param = {
    //   sService: "getLstEstudios",
    //   iIdEmpresa: 0
    // }
    let body = new HttpParams();
    body = body.set('sService', 'getLstEstudios');
    body = body.set('iIdEmpresa', '0');
    return this._http.post<CatalogoEstudios>(environment.urlProd, body);
  }

  getAllEstudios(): Observable<Empresa[]> {
    let body = new HttpParams().set('sService', 'getAllEstudios');
    return this._http.post<Empresa[]>(environment.urlProd, body);
  }

  subirArchivo(blob, nombre) {
    const formData = new FormData();
    formData.append('sService', 'SubirArchivo');
    formData.append('Archivo', blob, nombre);
    formData.append('p', '()__A81523_[]');
    
    return this._http.post(environment.urlArchivo, formData);
  }

  registraTarifa(tarifa) {
    let body = new HttpParams({fromObject: tarifa});
    return this._http.post(environment.urlProd, body);
  }

  getEmpresaById(id) {
    let req = {
      sService: 'getEmpresabyId',
      iIdEmpresa: id
    }

    let body = new HttpParams({fromObject: req});
    return this._http.post(environment.urlProd, body);
  }

  getTarifas(params) {
    let body = new HttpParams({fromObject: params});
    return this._http.post(environment.urlProd, body);
  }
  
}
