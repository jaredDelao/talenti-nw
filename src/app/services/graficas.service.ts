import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, pluck } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GraficasService {

  constructor(private http: HttpClient) { }


  getGraficaCliente(params) {
    let body = new HttpParams({fromObject: params});
    return this.http.post(environment.urlProd, body);
  }

  getGraficaEmpleado(params) {
    let body = new HttpParams({fromObject: params});
    return this.http.post(environment.urlProd, body);
  }


  // Graficas GNP
  graficaGnpRiesgo1(mes, anio): Observable<any> {
    const req = {
      sService: 'getGraficaEstatusDictamen',
      iEstatusDictamen: '11',
      iIdCliente: '23',
      mes,
      anio
    }

    let body = new HttpParams({fromObject: req});
    return this.http.post(environment.urlProd, body).pipe(
      pluck('cantidad'),
      catchError<any, Observable<any> >((e) => of(0))
    )
  }

  graficaGnpRiesgo2(mes, anio): Observable<any> {
    const req = {
      sService: 'getGraficaEstatusDictamen',
      iEstatusDictamen: '12',
      iIdCliente: '23',
      mes,
      anio
    }

    let body = new HttpParams({fromObject: req});
    return this.http.post(environment.urlProd, body).pipe(
      pluck('cantidad'),
      catchError<number, Observable<number> >((e) => of(0))
    )
  }

  graficaGnpRiesgo3(mes, anio): Observable<any> {
    const req = {
      sService: 'getGraficaEstatusDictamen',
      iEstatusDictamen: '13',
      iIdCliente: '23',
      mes,
      anio
    }

    let body = new HttpParams({fromObject: req});
    return this.http.post(environment.urlProd, body).pipe(
      pluck('cantidad'),
      catchError<number, Observable<number> >((e) => of(0))
    )
  }

  graficaGnpSinRiesgo(mes, anio): Observable<any> {
    const req = {
      sService: 'getGraficaEstatusDictamen',
      iEstatusDictamen: '14',
      iIdCliente: '23',
      mes,
      anio
    }

    let body = new HttpParams({fromObject: req});
    return this.http.post(environment.urlProd, body).pipe(
      pluck('cantidad'),
      catchError<number, Observable<number> >((e) => of(0))
    )
  }


  // Graficas Cliente normal
  graficaNormalRecomendados(mes, anio): Observable<any> {
    const req = {
      sService: 'getGraficaEstatusDictamen',
      iEstatusDictamen: '2',
      mes,
      anio
    }

    let body = new HttpParams({fromObject: req});
    return this.http.post(environment.urlProd, body).pipe(
      pluck('cantidad'),
      catchError<number, Observable<number> >((e) => of(0))
    )
  }

  graficaNormalNoRecomendados(mes, anio): Observable<any> {
    const req = {
      sService: 'getGraficaEstatusDictamen',
      iEstatusDictamen: '3',
      mes,
      anio
    }

    let body = new HttpParams({fromObject: req});
    return this.http.post(environment.urlProd, body).pipe(
      pluck('cantidad'),
      catchError<number, Observable<number> >((e) => of(0))
    )
  }

  graficaNormalRecomendadosReserva(mes, anio): Observable<any> {
    const req = {
      sService: 'getGraficaEstatusDictamen',
      iEstatusDictamen: '4',
      mes,
      anio
    }

    let body = new HttpParams({fromObject: req});
    return this.http.post(environment.urlProd, body).pipe(
      pluck('cantidad'),
      catchError<number, Observable<number> >((e) => of(0))
    )
  }


  paqueteGraficasGnp(mes, anio): Observable<any> {

    const listaGraficas = [
      { nombre: 'Riesgo 1', func: 'graficaGnpRiesgo1' },
      { nombre: 'Riesgo 2', func: 'graficaGnpRiesgo2' },
      { nombre: 'Riesgo 3', func: 'graficaGnpRiesgo3' },
      { nombre: 'Sin riesgo', func: 'graficaGnpSinRiesgo' },
    ];

    let pckage = listaGraficas.map((grafica) => {
      return this[grafica.func](mes, anio).pipe(
        map((single) => ({ nombre: grafica.nombre, valor: single }))
      )
    })

    return forkJoin(pckage);
  }

  paqueteGraficasClienteNormal(mes, anio): Observable<any> {

    const listaGraficas = [
      { nombre: 'Recomendados', func: 'graficaNormalRecomendados' },
      { nombre: 'No recomendados', func: 'graficaNormalNoRecomendados' },
      { nombre: 'Recomendados con reserva', func: 'graficaNormalRecomendadosReserva' },
    ];

    let pckage = listaGraficas.map((grafica) => {
      return this[grafica.func](mes, anio).pipe(
        map((single) => ({ nombre: grafica.nombre, valor: single }))
      )
    })

    return forkJoin(pckage);
  }
}




// Número de estudios en riesgo 1 (iEstatusDictamen == 11)
// Número de estudios en riesgo 2 (iEstatusDictamen == 12)
// Número de estudios en riesgo 3 (iEstatusDictamen == 13)
// Número de estudios sin riesgo (iEstatusDictamen == 14)


// * Clientes normales
// - Número de estudios recomendados (iEstatusDictamen == 2)
// - Número de estudios no recomendados (iEstatusDictamen == 3)
// - Número de estudios recomendados con reserva (iEstatusDictamen == 4)
