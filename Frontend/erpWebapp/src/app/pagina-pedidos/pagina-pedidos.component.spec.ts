import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaPedidosComponent } from './pagina-pedidos.component';

describe('PaginaPedidosComponent', () => {
  let component: PaginaPedidosComponent;
  let fixture: ComponentFixture<PaginaPedidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaginaPedidosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginaPedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
