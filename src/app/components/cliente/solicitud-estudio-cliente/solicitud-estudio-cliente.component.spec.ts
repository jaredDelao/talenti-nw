import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudEstudioClienteComponent } from './solicitud-estudio-cliente.component';

describe('SolicitudEstudioClienteComponent', () => {
  let component: SolicitudEstudioClienteComponent;
  let fixture: ComponentFixture<SolicitudEstudioClienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitudEstudioClienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudEstudioClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
