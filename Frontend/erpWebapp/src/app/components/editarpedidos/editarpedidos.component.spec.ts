import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarpedidosComponent } from './editarpedidos.component';

describe('EditarpedidosComponent', () => {
  let component: EditarpedidosComponent;
  let fixture: ComponentFixture<EditarpedidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarpedidosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarpedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
