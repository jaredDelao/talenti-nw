import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable, BehaviorSubject } from "rxjs";
import { Clientes } from "src/app/interfaces/talenti/coordinador/clientes";
import { TipoUsuario } from "src/app/interfaces/talenti/coordinador/tipo-usuario";
import { Empresas } from "src/app/interfaces/talenti/coordinador/empresas";
import { Ejecutivos } from "src/app/interfaces/talenti/coordinador/ejecutivos";

@Injectable({
  providedIn: "root"
})
export class ClientesService {
  constructor(private http: HttpClient) {}

  idTipoSubject = new BehaviorSubject(0);
  $idTipoSubject = this.idTipoSubject.asObservable();

  getClientes(): Observable<Clientes> {
    let body = new HttpParams();
    body = body.set("sService", "listarclientes");
    return this.http.post<Clientes>(environment.urlGet, body);
  }

  getTipoUsuario(): Observable<TipoUsuario> {
    let body = new HttpParams();
    body = body.set("sService", "getPerfiles");
    return this.http.post<TipoUsuario>(environment.urlGet, body);
  }

  getEmpresas(): Observable<Empresas> {
    let body = new HttpParams();
    body = body.set("sService", "getEmpresas");
    return this.http.post<Empresas>(environment.urlGet, body);
  }

  getEjecutivos(): Observable<Ejecutivos> {
    let body = new HttpParams();
    body = body.set("sService", "getEjecutivos");
    return this.http.post<Ejecutivos>(environment.urlGet, body);
  }

}
