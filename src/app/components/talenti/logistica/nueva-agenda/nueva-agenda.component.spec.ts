import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaAgendaComponent } from './nueva-agenda.component';

describe('NuevaAgendaComponent', () => {
  let component: NuevaAgendaComponent;
  let fixture: ComponentFixture<NuevaAgendaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuevaAgendaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevaAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
