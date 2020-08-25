import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { SelectionModel } from "@angular/cdk/collections";
import { MatPaginator } from "@angular/material/paginator";
import Swal from "sweetalert2";
import { ActivatedRoute, Router } from '@angular/router';
import { EmpresasService } from 'src/app/services/coordinador/empresas.service';
import { CatalogoEstudios, CatalogoEstudio } from 'src/app/interfaces/talenti/coordinador/catalogo-estudios';
import { pluck, catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Empresa } from 'src/app/models/empresas.model';
import { Estudio } from 'src/app/interfaces/talenti/ejecutivo/estudios';

@Component({
  selector: "app-registro-empresa",
  templateUrl: "./registro-empresa.component.html",
  styleUrls: ["./registro-empresa.component.scss"]
})
export class RegistroEmpresaComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  validEstudios: Boolean = false;
  idEmpresa: any;
  displayedColumns: string[] = ["select","descripcion","costoReal","costoCancelado"];
  selection = new SelectionModel<CatalogoEstudios>(true, []);
  catalogoEstudios: Array<Empresa>;
  dataSource: MatTableDataSource<CatalogoEstudio>;
  loader: boolean = false;

  //Token img
  tokenImg: string = '';
  previewImg: any = null;

  form: FormGroup;

  public registerEmpresa = {
    sService: 'registraEmpresa',
    sNombreEmpresa: null,
    sTipoFolio: null,
    logotipo: '',
  };

  public reqTarifasEmpresa = {
    sService: 'getTarifasxempresa',
    iIdEmpresa: ''
  }

  public reqArchivo = {
    sService: 'subirArchivo',
    Archivo: '',
    p: '()_A81523[]'
  }

  dataFolio: Object[] = [
    { id: 'e', descripcion: "Folio Editable" },
    { id: 'f', descripcion: "Folio Fijo" }
  ];

  empresaById: any;

  // Tabla consulta
  displayedColumnsConsulta: string[] = ['estudio', 'costo1', 'costo2'];
  dataSourceConsulta: any = [];

  constructor(private _route: ActivatedRoute, private empresasService: EmpresasService, private router: Router,
    private fb: FormBuilder) {}

  ngOnInit() {
    this.formInit();
    this.getIdEmpresa();
    this.getAllEstudios();
  }

  formInit() {
    this.form = this.fb.group({
      estudios: new FormArray([])
    })
  }

  getIdEmpresa() {
    this.idEmpresa = this._route.snapshot.paramMap.get('id');
    this.reqTarifasEmpresa.iIdEmpresa = this.idEmpresa;
    console.log('IdEmpresa::', this.idEmpresa);
    if (this.idEmpresa) {
      this.empresasService.getEmpresaById(this.idEmpresa).subscribe((empresa: any) => {
        this.empresaById = empresa.Empresas[0];
        this.setValue(this.empresaById);
        // this.consultarEmpresa();
        // Validacion error
        if (empresa.status !== 'Ok') return Swal.fire('Error', 'Error al consultar empresa', 'error').then(() => {
          return this.router.navigate(['/coordinador/empresas']);
        })
      })
    }
  }

  setValue(value) {
    this.registerEmpresa.sNombreEmpresa = value.sNombreEmpresa;
    this.registerEmpresa.sTipoFolio = value.sTipoFolio; 
  }

  get getEstudios(): Array<any> {
    return this.form.get('estudios').value;
  }


  // Lista de estudios
  getAllEstudios() {
    this.empresasService.getAllEstudios().pipe(
      pluck('LstEstudios'),
      catchError((err) => of([])),
      switchMap((res: Empresa[]) => {
        if (res.length <= 0) return;
        this.agregarEstudios(res);
        this.catalogoEstudios = res;

        return this.empresasService.getTarifas(this.reqTarifasEmpresa)
      }),
      pluck('resultado')
    ).subscribe((empresa: Empresa[]) => {
      console.log(empresa);

      this.getEstudios.forEach((estudio, i) => {
        empresa.forEach((emp) => {
          if (estudio.id == emp.iIdEstudio) {
            (<FormArray>this.form.get('estudios')).at(i).patchValue({
              check: true,
              costo: emp.dCosto1,
              costoCancelado: emp.dCosto3,
            })
          }
        })
      })

      this.loader = false;
    }, (err) => Swal.fire('Error', 'Error al mostrar lista de estudios', 'error'));
  }


  agregarEstudios(estudios: Empresa[]) {
    estudios.map(estudio => {
      const group = this.crearGroup(estudio);
      (<FormArray>this.form.get('estudios')).push(group);
    })
  }

  crearGroup(estudio): FormGroup {
    return this.fb.group({
      id: [estudio.iIdEstudio],
      check: [false],
      descripcion: [estudio.sNombreEstudio],
      costo: [null],
      costoCancelado: [null],
    });
  }


  stop() {
    event.stopPropagation();
  }

  subirImagen(e) {
    let blob = e.target.files[0];
    let name = e.target.files[0].name;
    
    this.previewImage(blob)

    this.loader = true;
    this.empresasService.subirArchivo(blob, name).subscribe((resp: any ) => {
      
      if (!resp.Identificador || resp.resultado != 'Ok') {
        this.loader = false;
        this.reqArchivo.Archivo = null;
        return Swal.fire('Error al cargar imagen', 'Revisa que sea un formato válido', 'error');
      }

      this.registerEmpresa.logotipo = resp.Identificador;
      
    }, (err) => {
      this.loader = false;
      this.reqArchivo.Archivo = null;
      return Swal.fire('Error al cargar imagen', 'Revisa que sea un formato válido', 'error');
    }, () => {
      this.loader = false;
    });
  }

  previewImage(blob) {
    const mimeType = blob.type;
    if (mimeType.match(/image\/*/) == null) {
      this.reqArchivo.Archivo = null;
      return;
    }
    let reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = (event: any) => {
      this.previewImg = event.target.result;
    }
  }

  registraEmpresa() {
    return this.empresasService.registrarEmpresa(this.registerEmpresa).toPromise();
  }

  validacionCampos() {
    
  }

  async enviar() {
    
    this.loader = true;

    const estudios = this.getEstudios.filter((std) => std.check == true);
    if (estudios.length <= 0) {
      this.loader = false;
      return Swal.fire('Alerta', 'Campos incompletos', 'error');
    }

    let respEmpresa: any = await this.registraEmpresa();
    this.idEmpresa = respEmpresa.iIdEmpresa;
    
    // Validación campos empresa
    if (this.idEmpresa == 'Error' || estudios.length <= 0) {
      this.loader = false;
      return Swal.fire({
            icon: 'warning',
            title: "Campos incompletos",
            text: "Faltan llenar campos de empresa"   
      });
    }

    
    estudios.map((estudio: any) => {
      const {id, costo, costoCancelado} = estudio;
      let request = {
        sService: 'registraTarifas',
        iIdEmpresa: this.idEmpresa,
        iIdEstudio: id,
        dCosto1: costo,
        dCosto2: costoCancelado
      };
      
      this.empresasService.registraTarifa(request).subscribe((resp:any)=> {
        this.loader = false;
        if (resp.resultado != 'Ok') return Swal.fire('Alerta', 'Error al registrar la empresa', 'error');

        return Swal.fire('Registro exitoso', 'La empresa se ha registrado correctamente', 'success').then(() => {
          this.router.navigate(['/coordinador/empresas']);
        })
      });

    });
  }

  actualizar() {    
    const estudios = this.getEstudios.filter((std) => std.check == true);
    if (estudios.length <= 0) return Swal.fire('Alerta', 'Campos incompletos', 'error');

    estudios.map((estudio: any) => {
      const {id, costo, costoCancelado} = estudio;
      let request = {
        sService: 'registraTarifas',
        iIdEmpresa: this.idEmpresa,
        iIdEstudio: id,
        dCosto1: costo,
        dCosto2: costoCancelado
      };
      
      this.empresasService.registraTarifa(request).subscribe((resp:any)=> {
        if (resp.resultado != 'Ok') return Swal.fire('Alerta', 'Error al registrar la empresa', 'error');
        return Swal.fire('Actualizacion exitosa', 'Los estudios se han actualizado exitosamente', 'success').then(() => {
          this.router.navigate(['/coordinador/empresas']);
        })
      });

    });
  }

}
