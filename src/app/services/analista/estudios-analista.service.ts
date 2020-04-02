import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstudiosAnalistaService {

  url = 'http://ec2-54-210-170-110.compute-1.amazonaws.com/WebTalenti';

  detalleSolicitud: BehaviorSubject<any> = new BehaviorSubject(0);
  $detalleSolicitud = this.detalleSolicitud.asObservable();

  constructor(private http: HttpClient) { }

  getEstudios(params): Observable<any> {
    let body = new HttpParams({fromObject: params});
    return this.http.post(environment.urlProd, body);
  }

  crearEstudio(req) {
    let body = new HttpParams({fromObject: req})
    return this.http.post(environment.urlProd, body);
  }
  
  subirArchivo(params) {
    let body = new HttpParams({fromObject: params})
    return this.http.post(environment.urlProd, body);
  }
  subirArchivosDictamen(params) {
    let body = new HttpParams({fromObject: params})
    return this.http.post(environment.urlProd, body);
  }

  descargarPreliminar(params) {
    return this.http.get(`https://backtalenti.automatizate.mx/WebTalenti/GetFile.php?Token=__-Talenti&file=${params.token}`);
  }

  rechazarPreliminar(params) {
    let body = new HttpParams({fromObject: params})
    return this.http.post(environment.urlProd, body);
  }
  rechazarEstudioSoc(params) {
    let body = new HttpParams({fromObject: params})
    return this.http.post(environment.urlProd, body);
  }
  rechazarComplemento(params) {
    let body = new HttpParams({fromObject: params})
    return this.http.post(environment.urlProd, body);
  }

  solicitarCancelacionEmpleado(params) {
    let body = new HttpParams({fromObject: params})
    return this.http.post(environment.urlProd, body);
  }
}
