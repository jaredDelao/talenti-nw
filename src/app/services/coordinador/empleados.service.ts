import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { Empleados } from 'src/app/interfaces/talenti/coordinador/empleados';
import { Perfiles } from 'src/app/interfaces/talenti/coordinador/perfiles';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {

  constructor(private http: HttpClient) { }

  idTipo = new BehaviorSubject(0);
  $idTipo = this.idTipo.asObservable();

  getEmpleados(): Observable<Empleados> {
    let params = new HttpParams().set('sService','getEmpleados');
    return this.http.post<Empleados>(environment.urlProd,params);
  }

  getPerfiles(): Observable<Perfiles> {
    let params = new HttpParams().set('sService','getPerfiles');
    return this.http.post<Perfiles>(environment.urlProd,params);
  }

  registroEmpleado(empleado){
    let params = new HttpParams({fromObject:empleado});
    return this.http.post(environment.urlProd, params);
  }

  getEmpleadoById(body) {
    let params = new HttpParams({fromObject:body});
    return this.http.post(environment.urlProd, params);
  }

  updateEmpleado(body) {
    let params = new HttpParams({fromObject: body});
    return this.http.post(environment.urlProd, params);
  }
}
