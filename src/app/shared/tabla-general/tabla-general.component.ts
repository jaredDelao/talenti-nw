import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { EstudiosAnalistaService } from 'src/app/services/analista/estudios-analista.service';
import { MatDialogRef, MatDialog, MatButton } from '@angular/material';
import { RevisarModalComponent } from '../modals/revisar-modal/revisar-modal.component';
import { EstudiosService } from 'src/app/services/ejecutivo/estudios.service';
import { ActualizarDictamenComponent } from 'src/app/components/talenti/ejecutivo/modals/actualizar-dictamen/actualizar-dictamen.component';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

const ELEMENT_DATA2 = [
  { id: 1, estudios: "Solicitud", documentos: "11/10/2019", cancelados: "VALIDADO" },
  { id: 2, estudios: "Agenda", documentos: "30/11/2019", cancelados: "REAGENDADO" }
];

@Component({
  selector: 'app-tabla-general',
  templateUrl: './tabla-general.component.html',
  styleUrls: ['./tabla-general.component.scss']
})
export class TablaGeneralComponent implements OnInit, AfterViewInit {

  @Output('update') update = new EventEmitter();
  @Input('titulo') titulo: string;
  @Input('columns') columns: Array<string>;
  @Input('data') data: any;
  @Input('archivo') archivo: boolean = false;
  @Input('idSolicitud') idSolicitud: boolean = false;
  // 1 preliminar - 2 estudio - 3 complemento
  @Input('idTipoEstudio') idTipoEstudio: any;
  // Bandera que indica en que estado se encuentra el estudio 1, 2, 3, 4 
  @Input('publicado') publicado: any;
  @ViewChild('revisarBtn', {static: false}) revisarBtn: MatButton;

  displayedColumns: Array<string> = [];
  dataSource: any;
  publicarSlider = new FormControl();
  
  
  constructor(private estudiosAnalistaService: EstudiosAnalistaService, private estudiosService: EstudiosService, 
    public dialog: MatDialog, private router: Router, private cd: ChangeDetectorRef) { }
  
  ngOnInit() {
    this.displayedColumns = this.columns;
    this.dataSource = this.data;
    this.checkPublicado();

    console.log(this.titulo, this.data);
    console.log(this.idTipoEstudio, this.publicado);
    
    
  }

  ngAfterViewInit() {
    
  }

  checkPublicado() {
    this.publicado == 3 ? this.publicarSlider.setValue(true) : this.publicarSlider.setValue(false);
    if (this.publicado == 3 || this.publicado == 4) {
      this.publicarSlider.disable();
    }
  }

  descargar(e) {
    console.log(e);
    this.estudiosAnalistaService.subirArchivo(e).subscribe(console.log);
  }

  openDialogRechazar(): void {
    const dialogRef = this.dialog.open(RevisarModalComponent, {
      width: '450px',
      // maxWidth: '70vw',
      data: {idSolicitud: this.idSolicitud, titulo: 'RECHAZAR ' + this.titulo, sRechazo: this.idTipoEstudio}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.update.emit('recargar');
    });
  }

  openDialogPublicar(id) {
    const dialogRef = this.dialog.open(ActualizarDictamenComponent, {
      width: "60%",
      data: {idSolicitud: this.idSolicitud, id}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.update.emit('recargar');
      setTimeout(() => {
        this.checkPublicado();
      }, 600)
      
      // this.estudiosService.reloadPage.next(1);
      // this.router.navigate([`ejecutivo/detalle-estudio/${this.idSolicitud}`]);
    });
  }

  publicar() {
    let body = {
      sService: '',
      iIdSolicitud: this.idSolicitud
    }

    switch(this.idTipoEstudio) {
      case 1:
        body.sService = 'publicarPreliminar';
        this.openDialogPublicar('publicarPreliminar');
        break;
      case 2:
        body.sService = 'publicarDictamen';
        this.openDialogPublicar('publicarDictamen');

        // this.estudiosService.publicarDictamen(body).subscribe(console.log)
        break;
      case 3:
        body.sService = 'publicarComplemento';
        this.openDialogPublicar('publicarComplemento');
        // this.estudiosService.publicarComplemento(body).subscribe(console.log)
        break;
      
      default:
        return false;
    }

  }

  revisar() {
    this.openDialogRechazar();

  }

}
