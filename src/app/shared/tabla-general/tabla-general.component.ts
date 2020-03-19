import { Component, OnInit, Input } from '@angular/core';
import { EstudiosAnalistaService } from 'src/app/services/analista/estudios-analista.service';
import { MatDialogRef, MatDialog } from '@angular/material';
import { RevisarModalComponent } from '../modals/revisar-modal/revisar-modal.component';

const ELEMENT_DATA2 = [
  { id: 1, estudios: "Solicitud", documentos: "11/10/2019", cancelados: "VALIDADO" },
  { id: 2, estudios: "Agenda", documentos: "30/11/2019", cancelados: "REAGENDADO" }
];

@Component({
  selector: 'app-tabla-general',
  templateUrl: './tabla-general.component.html',
  styleUrls: ['./tabla-general.component.scss']
})
export class TablaGeneralComponent implements OnInit {

  @Input('titulo') titulo: string;
  @Input('columns') columns: Array<string>;
  @Input('data') data: any;
  @Input('archivo') archivo: boolean = false;
  @Input('idSolicitud') idSolicitud: boolean = false;
  // 1 preliminar - 2 estudio - 3 complemento
  @Input('idTipoEstudio') idTipoEstudio: any;

  displayedColumns: Array<string> = [];
  dataSource: any;
  
  constructor(private estudiosAnalistaService: EstudiosAnalistaService, public dialog: MatDialog) { }
  
  ngOnInit() {
    this.displayedColumns = this.columns;
    this.dataSource = this.data;
    console.log(this.idTipoEstudio);
    

    // console.log(this.data, this.idSolicitud);
    
  }

  descargar(e) {
    console.log(e);
    this.estudiosAnalistaService.subirArchivo(e).subscribe(console.log);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(RevisarModalComponent, {
      width: '450px',
      // maxWidth: '70vw',
      data: {idSolicitud: this.idSolicitud, titulo: 'RECHAZAR ' + this.titulo, sRechazo: this.idTipoEstudio}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  revisar() {
    this.openDialog();

  }

}
