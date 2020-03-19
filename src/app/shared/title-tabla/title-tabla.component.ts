import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'title-tabla',
  templateUrl: './title-tabla.component.html',
  styleUrls: ['./title-tabla.component.scss']
})
export class TitleTablaComponent implements OnInit {

  @Input('titulo') titulo;
  @Input('ruta') ruta;
  @Input('regresar') regresar = false;

  constructor() { }

  ngOnInit() {
  }

}
