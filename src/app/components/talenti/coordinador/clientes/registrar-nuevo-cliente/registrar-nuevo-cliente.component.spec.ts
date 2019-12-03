import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarNuevoClienteComponent } from './registrar-nuevo-cliente.component';

describe('RegistrarNuevoClienteComponent', () => {
  let component: RegistrarNuevoClienteComponent;
  let fixture: ComponentFixture<RegistrarNuevoClienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrarNuevoClienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarNuevoClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
