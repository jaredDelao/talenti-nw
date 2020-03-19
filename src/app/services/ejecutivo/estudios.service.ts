import { Injectable, EventEmitter } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
// import { Estudios, Estudio } from 'src/app/interfaces/talenti/ejecutivo/estudios';

@Injectable({
  providedIn: 'root'
})
export class EstudiosService {

  detalleSolicitud: BehaviorSubject<any> = new BehaviorSubject(0);
  $detalleSolicitud = this.detalleSolicitud.asObservable();

  constructor(private http: HttpClient) { }

  getEstudios(req): Observable<any> {
    let body = new HttpParams({fromObject: req})
    return this.http.post<any>(environment.urlProd, body);
  }

  crearEstudio(req) {
    let body = new HttpParams({fromObject: req})
    return this.http.post(environment.urlProd, body);
  }

  validarSolicitud(params) {
    let body = new HttpParams({fromObject: params})
    return this.http.post(environment.urlProd, body);
  }

}
