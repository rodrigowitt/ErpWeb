import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PedidosService } from '../pedido.service';
import { Pedidos } from 'src/pedidos';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {ProdutosService} from 'src/app/produtos.service'
import { Produtos } from 'src/produtos';
import { environment } from 'src/environments/environment';
import { ItensPedidos } from 'src/itenspedidos';

@Component({
  selector: 'app-pagina-pedidos',
  templateUrl: './pagina-pedidos.component.html',
  styleUrls: ['./pagina-pedidos.component.css']
})
export class PaginaPedidosComponent {
  public pedidos: Pedidos [] = [];
  public produtos: Produtos [] = [];
  public itens: ItensPedidos[] = [];
  private apiServerUrl = environment.apiBaseUrl;
  codigoProduto!: string;
  quantidadeProduto!: number | any;
  desconto : number = 0;
  public produtoslista: any[] = []
  produtoNaoEncontrado: boolean = false;
  editandoItem: boolean = false;
  indiceItemEditando: number = -1;
  totalPedido!: number;
  produto: any;
  nomeProduto: string = '';


  constructor (private pedidoService: PedidosService, private produtosService : ProdutosService, private http: HttpClient){};

  ngOnInit(): void {
   }
  
   ngAfterViewInit() {
    this.calcularTotalPedido();
  }

 
   public getProdutos():void{
    this.produtosService.getProdutos().subscribe(
      (response : Produtos[]) => {
          this.produtos = response;
          console.log("Produtos: " )
          response.forEach(produto => {
            console.log(JSON.stringify(produto, null, 2)); 
        });
      }, (error: HttpErrorResponse) => {alert(error.message)}
      )    
}



onAddPedido(addForm: NgForm): void {
  const cliente = addForm.value.cliente;
  const formaPagamento = addForm.value.forma_pagamento;
  const desconto = addForm.value.desconto;
  const total = this.calcularTotalPedido();
  const itempedido = this.codigoProduto

  const pedido: Pedidos = {
    cliente: cliente,
    forma_pagamento: formaPagamento,
    desconto: desconto,
    total: total,
    pedidoid: '',
    entrada: ''
  };

  this.pedidoService.addPedido(pedido).subscribe((pedidoAdicionado) => {
    this.produtoslista.forEach((item) => {
      const itemPedido: ItensPedidos = {
        pedido: pedidoAdicionado.pedidoid, 
        preco: item.produto.preco,
        produto_id: item.produto.produtoid,
        quantidade: item.quantidade,
        itensPedidoid: '',
        produto: ''
      };
      console.log("segue o produto_id =" + itemPedido.produto_id)
      this.pedidoService.addITensPedido(itemPedido).subscribe(() => {
      }, (error) => {
        console.error('Erro ao adicionar item de pedido:', error);
      });
    });
    this.produtoslista = [];
    addForm.resetForm();
  }, (error) => {
    console.error('Erro ao adicionar pedido:', error);
  });
}

async adicionarProduto() {
  if (this.indiceItemEditando !== -1) {
    const produto  : any = await this.http.get<Produtos>(`${this.apiServerUrl}produto/${this.codigoProduto}`).toPromise();
    if (produto && Object.keys(produto).length > 0){
      const itemEditando = this.produtoslista[this.indiceItemEditando];
      itemEditando.produto.codigo = this.codigoProduto;
      itemEditando.produto = produto;
      itemEditando.quantidade = this.quantidadeProduto;
      this.codigoProduto = '';
      this.quantidadeProduto = '';
      this.indiceItemEditando = -1; 
      this.editandoItem = false;
      this.produtoNaoEncontrado = false;
    }else{
      this.produtoNaoEncontrado = true;
    }

  }else{
  try {
    const produto  : any = await this.http.get<Produtos>(`${this.apiServerUrl}produto/${this.codigoProduto}`).toPromise();
    if (produto && Object.keys(produto).length > 0 && this.quantidadeProduto != 0 && this.quantidadeProduto != '' && this.quantidadeProduto != undefined) {
      this.produtoslista.push({ produto: produto, quantidade: this.quantidadeProduto });
      this.codigoProduto = '';
      this.quantidadeProduto = '';
      this.produtoNaoEncontrado = false;
    } else {
      this.produtoNaoEncontrado = true;
    }
  } catch (error: any) {
    if (!(error instanceof HttpErrorResponse) || error.status !== 404) {
      console.error('Erro ao obter produto:', error);
    }
    this.produtoNaoEncontrado = true;
  }
  
}}

buscarProduto() {
  if (this.codigoProduto.trim() !== '') {
    this.http.get<any>(`${this.apiServerUrl}produto/${this.codigoProduto}`).subscribe(
      (produto: any) => {
        if (produto && produto.nome) {
          this.nomeProduto = produto.nome;
        } else {
          this.nomeProduto = 'Produto não encontrado';
        }
      },
      (error: HttpErrorResponse) => {
        console.error('Erro ao obter produto:', error);
        this.nomeProduto = 'Erro ao obter produto';
      }
    );
  } else {
    this.nomeProduto = '';
  }
}

produtoValido(produto: Produtos | any): boolean {
  return produto && produto.produtoid && produto.codigo && produto.nome && produto.preco 
}

calcularTotalPedido(): number {
  const total = this.produtoslista.reduce((total, item) => {
    if (this.produtoValido(item.produto)) {
      total += item.quantidade * item.produto.preco;
    }
    return total;
  }, 0);
  return + total.toFixed(2);
}

removerItemPedido(item: any) {
  const index = this.produtoslista.indexOf(item);
  if (index !== -1) {
    this.produtoslista.splice(index, 1);
  }
  this.codigoProduto = '';
  this.quantidadeProduto = '';
  this.editandoItem = false;
}

editarItem(indice: number) {
  const itemEditando = this.produtoslista[indice];
  this.codigoProduto = itemEditando.produto.produtoid;
  this.quantidadeProduto = itemEditando.quantidade;
  this.indiceItemEditando = indice;
  this.editandoItem = true
}

verificarSeHaItens(): boolean {
  return this.produtoslista.length > 0;
}




}
