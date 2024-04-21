import { Component, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
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
  public codigoNovoPedido: any = 0;
  public ultimocliente: string= '';
  public ultimaFormaPagamento: string= '';
  public ultimoTotal : number | any;
  public ultimoDesconto : number | any;
  public pedidoFeito : number | any;
  codigoProduto!: string;
  quantidadeProduto!: number | any;
  desconto : number = 0;
  descontoDigitado: boolean = false;
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
  

  
  

  ajustarDesconto() {
    this.descontoDigitado = true;
    if (this.desconto > this.calcularTotalPedido()) {
      this.desconto = 0;
    }
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
  let  desconto = addForm.value.desconto;
  let status = addForm.value.status;
  const total = this.calcularTotalPedido();

  if (!desconto || isNaN(desconto)) {
    desconto = 0;
  }
  

  const pedido: Pedidos = {
    cliente: cliente,
    forma_pagamento: formaPagamento,
    status : status,
    desconto: desconto,
    total: total,
    pedidoid: 0,
    entrada: ''
  };
  this.ultimocliente = cliente;
  this.ultimaFormaPagamento = formaPagamento;
  this.ultimoTotal = total;
  this.ultimoDesconto = desconto;
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
      this.pedidoFeito = pedidoAdicionado.pedidoid;
      this.openModal();
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
      this.nomeProduto = '';
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
      this.nomeProduto = '';
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
calcularQuantidadeTotalPedido(): number {
  let total = 0;

  for (let item of this.produtoslista) {
    total += Number(item.quantidade);
  }

  return total;
}


calcularTotalLiquidoPedido(totalpedido : number, desconto : number) {
  if (desconto > totalpedido){desconto = 0}
  return totalpedido - desconto;
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
