import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private _http: HttpClient) { }

  cargarStorage() {
    if (localStorage.getItem('token')) {
      if (localStorage.getItem('token').length > 0) {
        return true
      } else {
        return false;
      }

    } else {
      return false;
    }
  }
  
  login() {
    // const header = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    // let body = new HttpParams();
    // body = body.set('sService', 'login');
    // return this._http.post('http://34.234.225.159/bkService.php', body, {headers: header});

  }
}
