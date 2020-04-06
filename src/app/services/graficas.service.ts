import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GraficasService {

  constructor(private http: HttpClient) { }


  getGraficaCliente(params) {
    let body = new HttpParams({fromObject: params});
    return this.http.post(environment.urlProd, body);
  }

  getGraficaEmpleado(params) {
    let body = new HttpParams({fromObject: params});
    return this.http.post(environment.urlProd, body);
  }
}
