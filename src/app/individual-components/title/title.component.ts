import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class TitleComponent implements OnInit {

  @Input('titulo') titulo;
  @Input('ruta') ruta;
  @Input('regresar') regresar = false;

  constructor() { }

  ngOnInit() {
  }

}
