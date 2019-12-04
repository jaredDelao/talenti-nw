import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleEstudioClienteComponent } from './detalle-estudio-cliente.component';

describe('DetalleEstudioClienteComponent', () => {
  let component: DetalleEstudioClienteComponent;
  let fixture: ComponentFixture<DetalleEstudioClienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleEstudioClienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleEstudioClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
