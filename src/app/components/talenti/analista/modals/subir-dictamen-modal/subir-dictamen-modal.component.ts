import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EstudiosAnalistaService } from 'src/app/services/analista/estudios-analista.service';
import Swal from 'sweetalert2';
import { EmpresasService } from 'src/app/services/coordinador/empresas.service';

@Component({
  selector: 'app-subir-dictamen-modal',
  templateUrl: './subir-dictamen-modal.component.html',
  styleUrls: ['./subir-dictamen-modal.component.scss']
})
export class SubirDictamenModalComponent implements OnInit {

  @ViewChild('label1', {static: false}) label1: ElementRef;
  @ViewChild('label2', {static: false}) label2: ElementRef;

  form: FormGroup;
  // catalogo estatus dictamen
  catDictamen = [
    {id: '1', name: 'EN PROCESO'},
    {id: '2', name: 'RECOMENDADO'},
    {id: '3', name: 'NO RECOMENDADO'},
    {id: '4', name: 'RECOMENDADO CON RESERVA'},
  ];
  catDictamenGNP = [
    {id: '10', name: 'EN PROCESO'},
    {id: '11', name: 'RIESGO 1'},
    {id: '12', name: 'RIESGO 2'},
    {id: '13', name: 'RIESGO 3'},
    {id: '14', name: 'SIN RIESGO'},
  ];

  catSelectDisctamen: any[];
  loader: boolean = false;
  constructor(public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
  public estudiosAnalistaService: EstudiosAnalistaService, public empresasService: EmpresasService) { }

  ngOnInit() {
    this.formInit();
    console.log(this.data);
    this.catSelectDisctamen = this.catDictamen;
  }

  formInit() {
    this.form = this.fb.group({
      sService: new FormControl('subirArchivosDictamen'),
      iIdSolicitud: new FormControl(this.data.idSolicitud),
      documento1: new FormControl(null, Validators.required),
      documento2: new FormControl(null, Validators.required),
      estatusDictamen: new FormControl(null, Validators.required),
    });
  }

  subirArchivo(e, idLabel) {
    this.loader = true;
    let blob = e.target.files[0];
    let name = e.target.files[0].name;

    // Set value en label
    if (idLabel == 1) this.label1.nativeElement.innerText = name;
    if (idLabel == 2) this.label2.nativeElement.innerText = name;
  
    this.empresasService.subirArchivo(blob, name).subscribe((resp: any ) => { 

      if (!resp.Identificador || resp.resultado != 'Ok') {
        if (idLabel == 1) {
          this.label1.nativeElement.innerText = 'Seleccionar Archivo 1';
          this.form.get('documento1').setValue(null);
        };
        if (idLabel == 2) {
          this.label2.nativeElement.innerText = 'Seleccionar Archivo 2';
          this.form.get('documento2').setValue(null);
        };
        this.loader = false;
        return Swal.fire('Error al cargar archivo', 'Revisa que sea un formato DOCX o PDF', 'error');
      }

      if (idLabel == 1) {
        this.form.get('documento1').setValue(resp.Identificador);
      } else {
        this.form.get('documento2').setValue(resp.Identificador);
      }
      this.loader = false;
    }, (err) => {
     this.loader = false;
      return Swal.fire('Error al cargar archivo', 'Revisa que sea un formato DOCX o PDF', 'error');
    }), () => {}
    
  }

  enviar() {

    // Validar formulario
    if (this.form.invalid) {
      return Swal.fire('Error', 'Faltan campos por ingresar', 'error');
    }

    let body = this.form.getRawValue();
    console.log(body);
    
    this.estudiosAnalistaService.subirArchivosDictamen(body).subscribe((res: any) => {
      console.log(res);
      if (res.resultado !== 'Ok') {
        return Swal.fire('Error', 'Error al subir archivo', 'error').then(() => {
          this.dialogRef.close();
        })
      }

      return Swal.fire('Archivo subido correctamente', 'Tu archivo ha sido subido exitosamente', 'success').then(() => {
        this.dialogRef.close();
      })
    })
  }

}
