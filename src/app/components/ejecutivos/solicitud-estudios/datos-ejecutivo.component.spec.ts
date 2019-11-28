import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosEjecutivoComponent } from './datos-ejecutivo.component';

describe('DatosEjecutivoComponent', () => {
  let component: DatosEjecutivoComponent;
  let fixture: ComponentFixture<DatosEjecutivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosEjecutivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosEjecutivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
