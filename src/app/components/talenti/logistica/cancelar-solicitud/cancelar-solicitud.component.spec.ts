import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelarSolicitudComponent } from './cancelar-solicitud.component';

describe('CancelarSolicitudComponent', () => {
  let component: CancelarSolicitudComponent;
  let fixture: ComponentFixture<CancelarSolicitudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelarSolicitudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelarSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
