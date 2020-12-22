import { Injectable, EventEmitter } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, pluck } from 'rxjs/operators';
import { Kpis } from 'src/app/models/kpis.model';
// import { Estudios, Estudio } from 'src/app/interfaces/talenti/ejecutivo/estudios';

@Injectable({
  providedIn: 'root'
})
export class EstudiosService {

  detalleSolicitud: BehaviorSubject<any> = new BehaviorSubject(0);
  $detalleSolicitud = this.detalleSolicitud.asObservable();

  reloadPage: BehaviorSubject<any> = new BehaviorSubject(0);
  $reloadPage = this.reloadPage.asObservable();

  constructor(private http: HttpClient) { }

  getEstudiosCliente(req): Observable<any> {
    let body = new HttpParams({fromObject: req})
    return this.http.post<any>(environment.urlProd, body);
  }

  getEstudioById(params) {
    let body = new HttpParams({fromObject: params});
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

  publicarPreliminar(params) {
    let body = new HttpParams({fromObject: params})
    return this.http.post(environment.urlProd, body);
  }

  publicarDictamen(params) {
    let body = new HttpParams({fromObject: params})
    return this.http.post(environment.urlProd, body);
  }

  publicarComplemento(params) {
    let body = new HttpParams({fromObject: params})
    return this.http.post(environment.urlProd, body);
  }

  declinarSolicitud(params) {
    let body = new HttpParams({fromObject: params})
    return this.http.post(environment.urlProd, body);
  }

  getEstudiosClienteAdmin(params) {
    let body = new HttpParams({fromObject: params})
    return this.http.post(environment.urlProd, body);
  }

  getsolicitudCanceladaById(params) {
    let body = new HttpParams({fromObject: params})
    return this.http.post(environment.urlProd, body);
  }

  solicitarCancelacion(params) {
    let body = new HttpParams({fromObject: params})
    return this.http.post(environment.urlProd, body);
  }

  aprobarCancelacion(params) {
    let body = new HttpParams({fromObject: params})
    return this.http.post(environment.urlProd, body);
  }

  solicitarCancelEjecutivo(params) {
    let body = new HttpParams({fromObject: params})
    return this.http.post(environment.urlProd, body);
  }

  aprobarCalidad(params) {
    let body = new HttpParams({fromObject: params})
    return this.http.post(environment.urlProd, body);
  }

  getSolicitudesCalidad() {
    let body = new HttpParams();
    body = body.append('sService', 'getSolicitudesCalidad');
    return this.http.post(environment.urlProd, body);
  }

  actualizarSolicitud(params) {
    let body = new HttpParams({fromObject: params})
    return this.http.post(environment.urlProd, body);
  }


  getKpis(idSolicitud): Observable<Kpis[]> {
    let req = {
      sService: 'getKpis',
      iIdSolicitud: idSolicitud
    }
    let body = new HttpParams({fromObject: req})
    return this.http.post<Kpis[]>(environment.urlProd, body).pipe(
      pluck('resultado'),
      catchError<Kpis[], Observable<any[]>>((e) => of([]))
    )
  }

}
