import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable, BehaviorSubject } from "rxjs";
import { Clientes } from "src/app/interfaces/talenti/coordinador/clientes";
import { Empresas } from "src/app/interfaces/talenti/coordinador/empresas";
import { Ejecutivos } from "src/app/interfaces/talenti/coordinador/ejecutivos";
import { Perfiles } from 'src/app/interfaces/talenti/coordinador/perfiles';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: "root"
})
export class ClientesService {
  constructor(private http: HttpClient) {}

  idTipoSubject = new BehaviorSubject(0);
  $idTipoSubject = this.idTipoSubject.asObservable();

  getClientes(): Observable<Clientes> {
    let body = new HttpParams();
    body = body.set("sService", "lstClientes");
    return this.http.post<Clientes>(environment.urlProd, body);
  }

  getTipoUsuario() {
    let body = new HttpParams();
    body = body.set("sService", "getPerfiles");
    return this.http.post(environment.urlProd, body).pipe(
      map((perfiles: any) => perfiles.Perfiles));
  }

  getEmpresas(): Observable<Empresas> {
    let body = new HttpParams();
    body = body.set("sService", "getEmpresas");
    return this.http.post<Empresas>(environment.urlProd, body);
  }

  getEjecutivos(): Observable<Ejecutivos> {
    let body = new HttpParams();
    body = body.set("sService", "getEjecutivos");
    return this.http.post<Ejecutivos>(environment.urlProd, body);
  }

  registroCliente(cliente) {
    let body = new HttpParams({fromObject: cliente});
    return this.http.post(environment.urlProd, body);
  }

  getClienteById(cliente) {
    let body = new HttpParams({fromObject: cliente});
    return this.http.post(environment.urlProd, body);
  }

  updateCliente(cliente) {
    let body = new HttpParams({fromObject: cliente});
    return this.http.post(environment.urlProd, body);
  }

}
