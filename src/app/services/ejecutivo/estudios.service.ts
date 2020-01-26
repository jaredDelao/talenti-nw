import { Injectable } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Estudios, Estudio } from 'src/app/interfaces/talenti/ejecutivo/estudios';

@Injectable({
  providedIn: 'root'
})
export class EstudiosService {

  constructor(private http: HttpClient) { }

  getEstudios(): Observable<Estudios> {
    let body = new HttpParams;
    body = body.set('sService', 'getEstudios');
    return this.http.post<Estudios>(environment.urlGet, body);
  }
}
