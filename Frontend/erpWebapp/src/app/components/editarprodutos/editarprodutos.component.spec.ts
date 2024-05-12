import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarprodutosComponent } from './editarprodutos.component';

describe('EditarprodutosComponent', () => {
  let component: EditarprodutosComponent;
  let fixture: ComponentFixture<EditarprodutosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarprodutosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarprodutosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
