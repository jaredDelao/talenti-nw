import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LogisticaService } from 'src/app/services/logistica/logistica.service';
import Swal from 'sweetalert2';
import { EmpresasService } from 'src/app/services/coordinador/empresas.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-cancelar-solicitud',
  templateUrl: './cancelar-solicitud.component.html',
  styleUrls: ['./cancelar-solicitud.component.scss']
})
export class CancelarSolicitudComponent implements OnInit {

  @ViewChild('label1', {static: false}) label1: ElementRef;

  catTiposCancelaciones: any[] = [];
  loader: boolean = false;
  form: FormGroup;
  tokenFile = new FormControl(null, Validators.required);

  constructor(public dialogRef: MatDialogRef<any>, public logisticaService: LogisticaService, private empresasService: EmpresasService, private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    console.log(this.data);
    this.formInit();
    this.getCatTiposCancelaciones();
  }

  formInit() {
    this.form = this.fb.group({
      idSolicitud: new FormControl(this.data.idSolicitud),
      sTipoCancelacion: new FormControl(null, Validators.required),
      iIdClientesolicitante: new FormControl(null, Validators.required),
      sTokenEvidencia: new FormControl(null),
      sComentarios: new FormControl(null, Validators.required),
    })
  }

  getCatTiposCancelaciones() {
    this.logisticaService.tiposCancelaciones().subscribe((resp: any) => {
      console.log(resp);
      if (resp.status != 'Ok') {
        return Swal.fire('Error', 'Error al traer catalogo de tipo cancelaciones', 'error');
      }
      this.catTiposCancelaciones = resp.Tipos;
    }, (err) => Swal.fire('Error', 'Error al traer catalogo de tipo cancelaciones - ' + err, 'error'))
  }

  subirArchivo(e) {

    let blob = e.target.files[0];
    let name = e.target.files[0].name;

    this.label1.nativeElement.innerText = name;

    this.loader = true;
    this.empresasService.subirArchivo(blob, name).subscribe((resp: any ) => { 

      if (!resp.Identificador || resp.resultado != 'Ok') {
        this.loader = false;
        // this.reqArchivo.ArchivoPreliminar = null;
        this.form.get('sTokenEvidencia').patchValue(null);
        this.label1.nativeElement.innerText = 'Seleccionar archivo';
        return Swal.fire('Error al cargar archivo', 'Revisa que sea un formato DOCX o PDF', 'error');
      }

      // Valid
      console.log(resp);
      this.form.get('sTokenEvidencia').patchValue(this.tokenFile.value);
      this.loader = false;
      
    }, (err) => {
      this.loader = false;
      this.label1.nativeElement.innerText = 'Seleccionar archivo';
      return Swal.fire('Error al cargar archivo', 'Revisa que sea un formato DOCX o PDF', 'error');
    }), () => {
      this.loader = false;
    } 
    
  }

  cancelar() {
    this.dialogRef.close();
  }

  enviar() {

  }

}
