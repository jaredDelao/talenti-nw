import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitarEstudioComponent } from './solicitar-estudio.component';

describe('SolicitarEstudioComponent', () => {
  let component: SolicitarEstudioComponent;
  let fixture: ComponentFixture<SolicitarEstudioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitarEstudioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitarEstudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
