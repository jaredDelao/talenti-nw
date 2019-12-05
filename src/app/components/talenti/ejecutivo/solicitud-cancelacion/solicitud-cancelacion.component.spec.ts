import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudCancelacionComponent } from './solicitud-cancelacion.component';

describe('SolicitudCancelacionComponent', () => {
  let component: SolicitudCancelacionComponent;
  let fixture: ComponentFixture<SolicitudCancelacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitudCancelacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudCancelacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
