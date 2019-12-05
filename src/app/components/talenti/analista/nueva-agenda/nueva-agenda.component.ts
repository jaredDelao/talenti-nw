import { Component, OnInit } from '@angular/core';

const estudios: Array<Object> = [
  {id: 1, nombre: 'Estudio socioeconómico laboral completo'},
  {id: 2, nombre: 'Estudio socioeconómico laboral sin visa'},
  {id: 3, nombre: 'Estudio socioeconómico laboral investigacion legal'},
  {id: 4, nombre: 'Estudio socioeconómico laboral investigacion financiera'},
  {id: 5, nombre: 'Estudio socioeconómico laboral investigacion legal y financiera'},
  {id: 6, nombre: 'Investigación laboral'},
  {id: 7, nombre: 'Validación domiciliaria'},
  {id: 8, nombre: 'Investigación legal'},
  {id: 9, nombre: 'Investigación financiera'},
  {id: 10, nombre: 'Socioeconómica beca'},
  {id: 11, nombre: 'Estudio socioeconómico financiero'},
  {id: 12, nombre: 'Especial'},
]

@Component({
  selector: 'app-nueva-agenda',
  templateUrl: './nueva-agenda.component.html',
  styleUrls: ['./nueva-agenda.component.scss']
})
export class NuevaAgendaComponent implements OnInit {

  estudiosList: Array<any> = estudios;

  constructor() { }

  ngOnInit() {
  }

}
