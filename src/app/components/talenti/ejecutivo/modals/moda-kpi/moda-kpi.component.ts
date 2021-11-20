import { DatePipe } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Kpis, TipoKpi } from 'src/app/models/kpis.model';
import { EstudiosService } from 'src/app/services/ejecutivo/estudios.service';
import { GenerateExcelService } from 'src/app/services/generate-excel.service';
import { TiempoKpisPipe } from 'src/app/shared/pipes/tiempo-kpis.pipe';

@Component({
  selector: 'app-moda-kpi',
  templateUrl: './moda-kpi.component.html',
  styleUrls: ['./moda-kpi.component.scss']
})
export class ModaKpiComponent implements OnInit, OnDestroy {

  loader: boolean;

  displayedColumns: string[] = ['Descripcion', 'fechaRegistro', 'tiempo'];

  $unsubscribe = new Subject();

  kpisComplete: boolean = false;

  Screacion: Kpis = new KPIClass('','','6', 'Creación estudio');
  Svalidacion: Kpis = new KPIClass('','', '4', 'Validación estudio');
  Sasignacion: Kpis = new KPIClass('','','7', 'Asignación estudio');
  Sagenda: Kpis = new KPIClass('','','1', 'Agenda estudio');
  Saplicacion: Kpis = new KPIClass('','','8', 'Aplicación estudio');
  Sarchivos: Kpis = new KPIClass('','','9', 'Archivos dictamen');
  Spublicacion: Kpis = new KPIClass('','','2', 'Publicación estudio');

  displayedKpis = [ 'Screacion', 'Svalidacion', 'Sasignacion', 'Sagenda', 'Saplicacion', 'Sarchivos', 'Spublicacion'];

  dataSource: Kpis[] = [
    this.Screacion,
    this.Svalidacion,
    this.Sasignacion,
    this.Sagenda,
    this.Saplicacion,
    this.Sarchivos,
    this.Spublicacion,
  ];

  dataTabla: MatTableDataSource<any>;

  constructor(public dialogRef: MatDialogRef<ModaKpiComponent>, private datePipe: DatePipe, private timeKpis: TiempoKpisPipe,
    @Inject(MAT_DIALOG_DATA) public data: {idEstudio: number}, public _estudiosService: EstudiosService, private excelGenerate: GenerateExcelService) { }

  ngOnInit() {
    this.obtenerKpis();
  }

  ngOnDestroy() {
    this.$unsubscribe.next(true);
    this.$unsubscribe.complete();
  }


  obtenerKpis() {
    this._estudiosService.getKpis(this.data.idEstudio).pipe(takeUntil(this.$unsubscribe))
      .subscribe((kpis) => {
        // console.log(kpis);
        if (kpis.length > 0) {

          let valoresEnum = Object.keys((TipoKpi)).reduce((acc, v) => {
            if (Number(v)) acc.push(Number(v));
            return acc;
          }, []);
          
          valoresEnum.forEach((k) => {
            // let variable;
  
            // if (TipoKpi.VALIDACION == k) variable = 'Svalidacion';
            // if (TipoKpi.PUBLICACION == k) variable = 'Spublicacion';
            // if (TipoKpi.ASIGNACION == k) variable = 'Sasignacion';
            // if (TipoKpi.APLICACION == k) variable = 'Saplicacion';
            // if (TipoKpi.AGENDA == k) variable = 'Sagenda';
                      
            let validacion = kpis.filter((y) => y.iEstatusGeneral == k);
            if (validacion.length <= 0) return;
            

            if (validacion.length == 1) {
              let i:number = this.dataSource.findIndex((z) => z.iEstatusGeneral == validacion[0].iEstatusGeneral);
              validacion[0].sDescripcion = this.dataSource[i].sDescripcion;
              this.dataSource[i] = validacion[0];
            }

            if (validacion.length > 1) {
              let x = this.obtenerUltimoProceso(validacion);
              if (x) {
                let i:number = this.dataSource.findIndex((z) => z.iEstatusGeneral == x.iEstatusGeneral);                
                x.sDescripcion = this.dataSource[i].sDescripcion;
                this.dataSource[i] = x;
              }
            }

          })
          this.dataTabla = new MatTableDataSource(this.dataSource);          
          this.kpisComplete = true;
        }
    });
  }


  obtenerUltimoProceso(kpis: Kpis[]): Kpis {    
    const sort = kpis.sort((a, b) => {
      let bd = new Date(b.dFechaRegistro).getTime(), ad = new Date(a.dFechaRegistro).getTime()
      return bd - ad;
    });    
    return sort[(sort.length - 1)];    
  }

  exportExcel() {

    this.loader = true;
    // let data: Array<any> = this.dataSource.filteredData;

    const exportExc = this.dataSource.reduce((acc, v) => {
        let arr = [
          v.sDescripcion,
          this.datePipe.transform(v.dFechaRegistro, 'dd/MMM/yyyy HH:MM'),
          this.timeKpis.transform(v, this.dataSource, v.iEstatusGeneral),
          this.timeKpis.transform(v, this.dataSource),
        ];
        acc.push(arr);
        return acc;
    }, [])
    

    let headers = ['Descripción', 'Fecha de registro', 'Procesos', 'Tiempo transcurrido'];
    this.excelGenerate.createExcel('exportExc', headers, exportExc, 'kpis.xlsx' );
    
    this.loader = false;
    

  }

}


class KPIClass {

  dFechaRegistro: string;
  iIdEstudio: string;
  iEstatusGeneral: string;
  sDescripcion: string;

  constructor(fecha?, idEstudio?, estatus?, descripcion?) {
    this.dFechaRegistro = fecha;
    this.iIdEstudio = idEstudio;
    this.iEstatusGeneral = estatus;
    this.sDescripcion = descripcion;

  }
}
