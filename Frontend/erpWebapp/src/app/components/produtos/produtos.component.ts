import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ProdutosService } from 'src/app/produtos.service';
import { Produtos } from 'src/produtos';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.css']
})
export class ProdutosComponent {

  estoque: number = 2;

  constructor(private produtosService: ProdutosService){}

  @ViewChild('addForm') addForm!: NgForm;


  public onAddProduto(addForm: NgForm): void {
    const produtoApi: Produtos = {
      produtoid: 0,
      nome: addForm.value.nome ,
      status: addForm.value.status ,
      codigo: addForm.value.codigo ,
      codigoEan: addForm.value.codigoEan,
      preco: addForm.value.preco,
      estoqueProduto: addForm.value.estoque
    };



    if (addForm.valid) {
      console.log("estoque formulario é: " + addForm.value.estoque)
        this.produtosService.addProduto(produtoApi).subscribe(
            (response: Produtos) => {
              console.log("o estoque do produto é : " + response.estoqueProduto)
                addForm.resetForm();
            },
            (error: HttpErrorResponse) => {
                alert(error.message);
            }
        );
    } else {
        alert('Por favor, preencha todos os campos obrigatórios.');
    }
}

}
