import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private http: HttpClient) { }

  solicitarEstudioCliente(params) {
    let body = new HttpParams({fromObject: params})
    return this.http.post(environment.urlProd, body);
  }
}
