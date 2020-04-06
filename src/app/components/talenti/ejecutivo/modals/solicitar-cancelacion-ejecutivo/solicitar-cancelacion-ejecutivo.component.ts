import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EstudiosService } from 'src/app/services/ejecutivo/estudios.service';
import { ClienteService } from 'src/app/services/cliente/cliente.service';
import Swal from 'sweetalert2';
import { EncriptarDesencriptarService } from 'src/app/services/encriptar-desencriptar.service';
import { EmpresasService } from 'src/app/services/coordinador/empresas.service';

@Component({
  selector: 'app-solicitar-cancelacion-ejecutivo',
  templateUrl: './solicitar-cancelacion-ejecutivo.component.html',
  styleUrls: ['./solicitar-cancelacion-ejecutivo.component.scss']
})
export class SolicitarCancelacionEjecutivoComponent implements OnInit {

  @ViewChild('label', {static: false}) label1: ElementRef;
  form: FormGroup;
  tiposCancelacionList: any[] = [];
  idEmpleado: any;
  dataArchivo: any;
  loading: boolean = false;

  constructor(public dialogRef: MatDialogRef<any>, private fb: FormBuilder, public estudiosService: EstudiosService, public encriptarService: EncriptarDesencriptarService,
    @Inject(MAT_DIALOG_DATA) public data: any, private clienteService: ClienteService, public empresasService: EmpresasService) { }

  ngOnInit() {
    this.formInit();
    this.getTiposCancelacion();
    this.getIdEmpleado();
  }

  formInit() {
    this.form = this.fb.group({
      sService: ['aprobarCancelacion'],
      iIdSolicitud: [null],
      bcosto: [null, Validators.required],
      iTipoCancelacion: [null, Validators.required],
      iIdEmpleadoSolicitante: [null],
      sTokenEvidencia: [null],
      sComentarios: [null, Validators.required]
    })
  }

  getDataArchivo(e) {
    this.dataArchivo = e;
    let name = e.target.files[0].name;
    this.label1.nativeElement.innerText = name;
  }

  subirArchivo() {
    if (this.dataArchivo){
      let name = this.dataArchivo.target.files[0].name;
      let blob = this.dataArchivo.target.files[0];
      
      return this.empresasService.subirArchivo(blob, name).toPromise();
    }
  }

  getIdEmpleado() {
    let idEmpleadoCrypt = localStorage.getItem('idEmpleado');
    this.encriptarService.desencriptar(idEmpleadoCrypt).subscribe((resp) => {
      this.idEmpleado = resp;
      this.form.get('iIdEmpleadoSolicitante').patchValue(resp);
    })
  }


  getTiposCancelacion() {
    this.clienteService.getTiposCancelacion().subscribe((resp: any) => {
      this.tiposCancelacionList = resp.Tipos;
    })
  }

  async enviar() {
    this.loading=true;
    try {
      const resp: any = await this.subirArchivo();
      if (!resp.Identificador || resp.resultado != 'Ok') {
        this.loading = false;
        this.label1.nativeElement.innerText = 'Subir evidencia';
        return Swal.fire('Error al cargar archivo', 'Revisa que sea un formato DOCX o PDF' + resp, 'error');
      }
     console.log(resp);
     this.loading = false;
      this.form.get('sTokenEvidencia').patchValue(resp.Identificador);
    } catch(err) {
      this.loading = false;
      return Swal.fire('Error al cargar archivo', 'Revisa que sea un formato DOCX o PDF' + err, 'error');
    }

    this.form.get('iIdSolicitud').patchValue(this.data.idSolicitud);    
    this.estudiosService.solicitarCancelEjecutivo(this.form.getRawValue()).subscribe((resp: any) => {
      console.log(resp);
      if (resp.resultado != 'Ok') {
        this.loading = false;
        return Swal.fire('Error', 'Error al aprobar cancelacion', 'error');
      }

      this.loading = false;
      return Swal.fire('Aprobación exitosa', 'El estudio se ha cancelado exitosamente', 'success').then(() => {
        this.dialogRef.close();
        location.reload();
      })
    })
  }
}
