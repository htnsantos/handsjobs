import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactPerfilComponent } from './contact-perfil.component';

describe('ContactPerfilComponent', () => {
  let component: ContactPerfilComponent;
  let fixture: ComponentFixture<ContactPerfilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactPerfilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
