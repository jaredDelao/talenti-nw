import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private http: HttpClient) { }

  solicitarEstudioCliente(params): Observable<any> {
    let body = new HttpParams({fromObject: params})
    return this.http.post(environment.urlProd, body);
  }

  getTiposCancelacion() {
    let params = {
      sService: 'GetTiposCancelaciones'
    }
    let body = new HttpParams({fromObject: params})
    return this.http.post(environment.urlProd, body);
  }

  solicitarCancelacionCliente(params) {
    let body = new HttpParams({fromObject: params})
    return this.http.post(environment.urlProd, body);
  }
}
