import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { EmpresasService } from 'src/app/services/coordinador/empresas.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { EncriptarDesencriptarService } from 'src/app/services/encriptar-desencriptar.service';
import { EstudiosAnalistaService } from 'src/app/services/analista/estudios-analista.service';

@Component({
  selector: 'app-solicitar-cancelacion-empleado',
  templateUrl: './solicitar-cancelacion-empleado.component.html',
  styleUrls: ['./solicitar-cancelacion-empleado.component.scss']
})
export class SolicitarCancelacionEmpleadoComponent implements OnInit {

  @ViewChild('label', {static: false}) label1: ElementRef;
  loader: boolean = false;
  controlEvidencia = new FormControl(null);
  form: FormGroup;
  idEmpleado: any;

  constructor(private empresasService: EmpresasService, private fb: FormBuilder, public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any, public decryptService: EncriptarDesencriptarService, public estudiosAnalistaService: EstudiosAnalistaService) { }

  ngOnInit() {
    this.formInit();
    this.getIdEmpleado();
  }

  getIdEmpleado() {
    let idEmpleado = localStorage.getItem('idEmpleado');
    this.decryptService.desencriptar(idEmpleado).subscribe((idEmpleado) => {
      this.form.get('iIdEmpleadoSolicitante').patchValue(idEmpleado);
    }, (err) => Swal.fire('Error', 'Error al traer el idEmpleado', 'error'))
  }

  formInit() {
    this.form = this.fb.group({
      sService: ['solicitarCancelacionEmpleado', Validators.required],
      idSolicitud: [this.data.idSolicitud, Validators.required],
      iIdEmpleadoSolicitante: [null, Validators.required],
      sTokenEvidencia: [null, Validators.required],
      sComentarios: [null, Validators.required],
    })
  }

  // SUBIR ARCHIVO Y CAMBIAR COMPLEMENTO O PRELIMINAR
  subirArchivo(e) {

    // Set value en label
    
    let blob = e.target.files[0];
    let name = e.target.files[0].name;
    this.label1.nativeElement.innerText = name;
    
    this.empresasService.subirArchivo(blob, name).subscribe((resp: {resultado: string, Identificador: string} ) => { 

      if (!resp.Identificador || resp.resultado != 'Ok') {
        // this.reqArchivo.ArchivoPreliminar = null;
        this.controlEvidencia.setValue(null)
        this.label1.nativeElement.innerText = 'Seleccionar evidencia';
        return Swal.fire('Error al cargar archivo', 'Revisa que sea un formato DOCX o PDF', 'error');
      }
     
      this.form.get('sTokenEvidencia').patchValue(resp.Identificador);
      
    }, (err) => {
      
      return Swal.fire('Error al cargar archivo', 'Revisa que sea un formato DOCX o PDF', 'error');
    }), () => {
    } 
    console.log(this.form);
  }

  cerrar() {
    this.dialogRef.close();
  }

  enviar() {

    this.estudiosAnalistaService.solicitarCancelacionEmpleado(this.form.getRawValue()).subscribe((value) => {
      console.log(value);
      
    })

  }

  

}
