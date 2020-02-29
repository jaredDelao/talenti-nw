import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private _http: HttpClient) { }
  
  login(body) {
    let params = new HttpParams({fromObject:body});
    return this._http.post('http://ec2-54-210-170-110.compute-1.amazonaws.com/WebTalenti/requestsrvrTalenti.php', params);
  }

  assembly() {
    let params = new HttpParams()
    params = params.set('sService','gettest')
    return this._http.post(environment.urlProd,params)
  }

}
