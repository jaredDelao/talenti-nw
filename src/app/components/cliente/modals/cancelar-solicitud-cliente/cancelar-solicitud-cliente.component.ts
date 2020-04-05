import { Component, OnInit, Inject, ViewChild, ElementRef } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { EncriptarDesencriptarService } from 'src/app/services/encriptar-desencriptar.service';
import Swal from 'sweetalert2';
import { EmpresasService } from 'src/app/services/coordinador/empresas.service';
import { ClienteService } from 'src/app/services/cliente/cliente.service';
import { Router } from '@angular/router';

@Component({
  selector: "app-cancelar-solicitud-cliente",
  templateUrl: "./cancelar-solicitud-cliente.component.html",
  styleUrls: ["./cancelar-solicitud-cliente.component.scss"]
})
export class CancelarSolicitudClienteComponent implements OnInit {

  @ViewChild('label1', {static: false}) label1: ElementRef;
  form: FormGroup;
  idCliente: any;
  controlEvidencia = new FormControl(null);
  public reqArchivo = {
    sService: 'subirArchivo',
    ArchivoPreliminar: '',
    p: '()_A81523[]'
  }

  loadArchivo: boolean = false;
  catMotivo: any;
  dataArchivo: any = null;

  constructor( private fb: FormBuilder, private encryptDecryptService: EncriptarDesencriptarService, private router: Router,
    public dialogRef: MatDialogRef<any>, private empresasService: EmpresasService, private clienteService: ClienteService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.formInit();
    this.getTiposCancelacion();
    this.getIdCliente();
  }

  getIdCliente() {
    let idClienteEncrypt = localStorage.getItem('idCliente');
    if (idClienteEncrypt) {
      this.encryptDecryptService.desencriptar(idClienteEncrypt).subscribe((idCliente) => {
        this.idCliente = idCliente;
      })
    }
  }

  getTiposCancelacion() {
    this.clienteService.getTiposCancelacion().subscribe((resp: any) => {
      console.log(resp);
      this.catMotivo = resp.Tipos;
    })
  }

  formInit() {
    this.form = this.fb.group({
      sService: ['solicitarCancelacionCliente', Validators.required],
      idSolicitud: [this.data.idSolicitud, Validators.required],
      iIdClienteSolicitante: [null],
      sTokenEvidencia: [null],
      sComentarios: [null, Validators.required]
    })

  }

  close() {
    this.dialogRef.close();
  }

  // SUBIR ARCHIVO
  subirArchivo() {

    if (this.dataArchivo) {
      this.loadArchivo = true;
      let blob = this.dataArchivo.target.files[0];
      let name = this.dataArchivo.target.files[0].name;

      console.log(blob, name);
      
      return this.empresasService.subirArchivo(blob, name).toPromise();
    }
    //   if (!resp.Identificador || resp.resultado != 'Ok') {
    //     this.controlEvidencia.setValue(null)
    //     this.loadArchivo = false;
    //     this.label1.nativeElement.innerText = 'Seleccionar Archivo';
    //     return Swal.fire('Error al cargar archivo', 'Revisa que sea un formato DOCX o PDF', 'error');
    //   }
    //   this.loadArchivo = false;
    //   this.form.get('sTokenEvidencia').setValue(resp.Identificador)
      
    // }, (err) => {
    //   this.loadArchivo = false;
    //   return Swal.fire('Error al cargar archivo', 'Revisa que sea un formato DOCX o PDF', 'error');
    // }), () => {
    // } 
  }

  getArchivo(e) {
    this.dataArchivo = e;
    let name = this.dataArchivo.target.files[0].name;
    this.label1.nativeElement.innerText = name;
  }

  async enviar() {
    this.loadArchivo = true;

    // archivo
    try {
      let resp: any = await this.subirArchivo();
      if (!resp.Identificador || resp.resultado != 'Ok') {
        this.controlEvidencia.setValue(null)
        this.loadArchivo = false;
        this.label1.nativeElement.innerText = 'Seleccionar Archivo';
        return Swal.fire('Error al cargar archivo', 'Revisa que sea un formato DOCX o PDF', 'error');
      }
      this.loadArchivo = false;
      this.form.get('sTokenEvidencia').setValue(resp.Identificador)
    } catch(err) {
      this.loadArchivo = false;
      this.controlEvidencia.setValue(null)
      return Swal.fire('Error', 'Falta cargar el archivo', 'error');
    }

    // Request
    this.form.get('iIdClienteSolicitante').patchValue(this.idCliente);
    let req = this.form.getRawValue();
    console.log(req);
    this.clienteService.solicitarCancelacionCliente(req).subscribe((resp: any) => {
      if (resp.resultado != 'Ok') return Swal.fire('Aviso', 'La solicitud ya ha sido enviada anteriormente', 'warning').then(() => {
        this.dialogRef.close();
      })

      return Swal.fire('Solicitud enviada', 'La solicitud se ha enviado exitosamente', 'success').then(() => {
        this.dialogRef.close();
        return this.router.navigate(['/cliente/detalle-estudio/', this.data.idSolicitud]);
      })
    })
  }
}
