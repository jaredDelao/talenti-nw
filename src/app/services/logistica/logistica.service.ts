import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LogisticaService {

  constructor(private http: HttpClient) { }

  getSolicitudesLogistica() {
    let body = {sService: 'getSolicitudesLogistica'};
    let params = new HttpParams({fromObject: body});
    return this.http.post(environment.urlProd, params);
  }

  getSolicitudesLogisticaById(params) {
    let body = new HttpParams({fromObject: params});
    return this.http.post(environment.urlProd, body);
  }

  agendar(params) {
    let body = new HttpParams({fromObject: params});
    return this.http.post(environment.urlProd, body);
  }

  asignarLogistica(params) {
    let body = new HttpParams({fromObject: params});
    return this.http.post(environment.urlProd, body);
  }

  solicitarCancelacion(params) {
    let body = new HttpParams({fromObject: params});
    return this.http.post(environment.urlProd, body);
  }

  tiposCancelaciones() {
    let body = new HttpParams();
    body = body.append('sService', 'GetTiposCancelaciones')
    return this.http.post(environment.urlProd, body);
  }

  AprobarAsignacion(params) {
    let body = new HttpParams({fromObject: params});
    return this.http.post(environment.urlProd, body);
  }

  
}
