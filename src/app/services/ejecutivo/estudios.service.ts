import { Injectable } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
// import { Estudios, Estudio } from 'src/app/interfaces/talenti/ejecutivo/estudios';

@Injectable({
  providedIn: 'root'
})
export class EstudiosService {

  constructor(private http: HttpClient) { }

  getEstudios(req): Observable<any> {
    let body = new HttpParams({fromObject: req})
    return this.http.post<any>(environment.urlProd, body);
  }
}
