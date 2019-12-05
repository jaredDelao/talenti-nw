import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelarSolicitudClienteComponent } from './cancelar-solicitud-cliente.component';

describe('CancelarSolicitudClienteComponent', () => {
  let component: CancelarSolicitudClienteComponent;
  let fixture: ComponentFixture<CancelarSolicitudClienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelarSolicitudClienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelarSolicitudClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
