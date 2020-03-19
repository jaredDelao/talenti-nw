import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubirArchivoService {

  constructor(private _http: HttpClient) { }

  subirArchivo(blob, nombre) {
    const formData = new FormData();
    formData.append('sService', 'SubirArchivo');
    formData.append('Archivo', blob, nombre);
    formData.append('p', '()__A81523_[]');
    
    return this._http.post(environment.urlArchivo, formData);
  }
}
