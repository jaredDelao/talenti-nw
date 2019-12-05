import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuCoordinadorComponent } from './menu-coordinador.component';

describe('MenuComponent', () => {
  let component: MenuCoordinadorComponent;
  let fixture: ComponentFixture<MenuCoordinadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuCoordinadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuCoordinadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
