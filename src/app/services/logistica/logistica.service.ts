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
}
