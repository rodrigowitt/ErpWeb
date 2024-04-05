import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarclientesComponent } from './editarclientes.component';

describe('EditarclientesComponent', () => {
  let component: EditarclientesComponent;
  let fixture: ComponentFixture<EditarclientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarclientesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarclientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
