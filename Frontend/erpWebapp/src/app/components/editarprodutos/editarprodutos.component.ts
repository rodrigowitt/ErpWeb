import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from 'express';
import { ProdutosService } from 'src/app/produtos.service';
import { Produtos } from 'src/produtos';

@Component({
  selector: 'app-editarprodutos',
  templateUrl: './editarprodutos.component.html',
  styleUrls: ['./editarprodutos.component.css']
})
export class EditarprodutosComponent {
  nome!: string;
  codigo!: string;
  status!: string | number;
  estoque: number = 0;
  preco!: number;
  estoqueProduto!: number
  produtoId?: any;
  produtoApi!: Produtos;

  constructor(private produtosService: ProdutosService, private route: ActivatedRoute){}

  @ViewChild('addForm') addForm!: NgForm;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.produtoId = params['id'];
      this.carregarProduto(this.produtoId);
    });
  }

  carregarProduto(id: string): void {
    this.produtosService.getProdutoById(id).subscribe(
      (produtoApi) => {
        if (produtoApi) {
          this.produtoApi = produtoApi;
        } else {
          console.error('Erro ao carregar produto: Produto não encontrado');
        }
      },
      (error) => {
        console.error('Erro ao carregar produto:', error);
      }
    );
  }
  

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
      this.nome = addForm.value.nome
      this.codigo = addForm.value.codigo
      this.status = addForm.value.status
      console.log("o valor do status ANTES de atualizar é " + this.status)
      if (this.status == 1 || this.status == "1" ){this.status = "Ativo"} else {this.status = "Inativo"}
      console.log("o valor do status DEPOIS é " + this.status)
      this.preco = addForm.value.preco
      this.estoqueProduto = addForm.value.estoque

        this.produtosService.updateProduto(this.produtoApi.produtoid,produtoApi).subscribe(
            (response: Produtos) => {
                addForm.resetForm();
                this.openModal();
            },
            (error: HttpErrorResponse) => {
                alert(error.message);
            }
        );
    } else {
        alert('Por favor, preencha todos os campos obrigatórios.');
    }
}

openModal() {
  const modal = document.getElementById('exampleModal');
  const body = document.body;
  const closeButton = document.querySelector('.btn-close');
  if (modal && body && closeButton) {
    modal.classList.add('show');
    modal.style.display = 'block';
    body.classList.add('modal-open');
    const backdrop = document.createElement('div');
    closeButton.addEventListener('click', this.closeModal.bind(this)); // Adiciona evento de clique ao botão fechar
  }
}

closeModal() {
  const modal = document.getElementById('exampleModal');
  const body = document.body;
  const backdrop = document.querySelector('.modal-backdrop');
  if (modal && body) {
    modal.classList.remove('show');
    modal.style.display = 'none';
    body.classList.remove('modal-open');
  }
}

}
