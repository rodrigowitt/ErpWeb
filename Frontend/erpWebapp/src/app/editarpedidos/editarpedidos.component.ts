import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ItensPedidos } from 'src/itenspedidos';
import { Pedidos } from 'src/pedidos';
import { Produtos } from 'src/produtos';
import { PedidosService } from '../pedido.service';
import { ProdutosService } from '../produtos.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-editarpedidos',
  templateUrl: './editarpedidos.component.html',
  styleUrls: ['./editarpedidos.component.css']
})
export class EditarpedidosComponent {
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
  pedidosApi : Pedidos | any;
  itenspedidoApi: ItensPedidos | any;
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
  pedidoId: any;
  itenspedidoId: any;
  numeroTotalItens: number = 0;
  

  constructor (private pedidoService: PedidosService, private produtosService : ProdutosService, private route: ActivatedRoute, private http: HttpClient, private router: Router){};

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.pedidoId = params['id'];
      this.itenspedidoId = params['id'];
      this.carregarPedido(this.pedidoId);
      this.carregarItensPedido(this.itenspedidoId);
    });
  }
  
  
   ngAfterViewInit() {
    this.calcularTotalPedido();
  }

  removerItemPedidoapi(index: number) {
    this.itenspedidoApi.splice(index, 1); // Remove o item da lista
}

  carregarPedido(id: number): void {
    this.pedidoService.getPedidoById(id).subscribe(
      (pedidosApi) => {
        this.pedidosApi = pedidosApi;
      },
      (error) => {
        console.error('Erro ao carregar pedido:', error);
      }
    );
  }

  carregarItensPedido(id: number): void {
    this.pedidoService.getItensPedidoById(id).subscribe(
      (itenspedidoApi) => {
        this.itenspedidoApi = itenspedidoApi;
        itenspedidoApi.forEach(item => {
          this.numeroTotalItens = this.itenspedidoApi.length + 1;

        });
      },
      (error) => {
        console.error('Erro ao carregar os itens de pedido:', error);
      }
    )}

  
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
  let desconto = addForm.value.desconto;
  const total = this.calcularTotalPedido();

  if (!desconto || isNaN(desconto)) {
    desconto = 0;
  }

  const pedido: Pedidos = {
    cliente: cliente,
    forma_pagamento: formaPagamento,
    desconto: desconto,
    total: total,
    pedidoid: 0,
    entrada: ''
  };

  this.ultimocliente = cliente;
  this.ultimaFormaPagamento = formaPagamento;
  this.ultimoTotal = total;
  this.ultimoDesconto = desconto;

  this.pedidoService.updatePedido(this.pedidoId, pedido).subscribe((pedidoAdicionado) => {

    // Mapeie os itens da API para o formato de itens de pedido
    const itensPedidoAPI = this.itenspedidoApi.map((item: { pedido: any; preco: any; produto_id: any; quantidade: any; itensPedidoid: any; produto: any; }) => ({
      pedido: item.pedido,
      preco: item.preco,
      produto_id: item.produto_id,
      quantidade: item.quantidade,
      itensPedidoid: item.itensPedidoid,
      produto: item.produto
    }));

    // Mapeie cada item na lista de produtos para o formato de itens de pedido
    const novosItensPedido = this.produtoslista.map(item => ({
      pedido: pedidoAdicionado.pedidoid,
      preco: item.produto.preco,
      produto_id: item.produto.produtoid,
      quantidade: item.quantidade,
      itensPedidoid: '',
      produto: item.produto.nome
    }));

    // Combine os itens da API com os novos itens da lista de produtos
    const listaItensPedido = [...itensPedidoAPI, ...novosItensPedido];

    console.log(listaItensPedido);

    // Chama o método updateItensPedidoLista para enviar a lista completa de itens de pedido
    this.pedidoService.updateItensPedidoLista(this.pedidoId, listaItensPedido).subscribe(() => {
      console.log('Lista de itens de pedido adicionada com sucesso!');
    }, (error) => {
      console.error('Erro ao adicionar lista de itens de pedido:', error);
    });
  }, (error) => {
    console.error('Erro ao adicionar pedido:', error);
  });

  this.openModal();
}


async adicionarProduto() {
  if (this.indiceItemEditando !== -1) {
    try {
      const produto: any = await this.http.get(`${this.apiServerUrl}produto/${this.codigoProduto}`).toPromise();
      if (produto && typeof produto === 'object' && Object.keys(produto).length > 0) {
        const itemEditando = this.produtoslista[this.indiceItemEditando] || this.itenspedidoApi[this.indiceItemEditando];
        
        // Atualiza apenas as propriedades necessárias do item editando
        Object.assign(itemEditando.produto, produto);
        itemEditando.quantidade = this.quantidadeProduto;
   

        // Limpa as variáveis
        this.codigoProduto = '';
        this.quantidadeProduto = '';
        this.nomeProduto = '';
        this.indiceItemEditando = -1; 
        this.editandoItem = false;
        this.produtoNaoEncontrado = false;
      } else {
        this.produtoNaoEncontrado = true;
      }
    } catch (error: any) {
      console.error('Erro ao obter produto:', error);
      this.produtoNaoEncontrado = true;
    }
  } else {
    try {
      const produto: any = await this.http.get(`${this.apiServerUrl}produto/${this.codigoProduto}`).toPromise();
      if (produto && typeof produto === 'object' && Object.keys(produto).length > 0 && this.quantidadeProduto != 0 && this.quantidadeProduto != '' && this.quantidadeProduto != undefined) {
        this.produtoslista.push({ produto: Object.assign({}, produto), quantidade: this.quantidadeProduto });
        this.codigoProduto = '';
        this.quantidadeProduto = '';
        this.nomeProduto = '';
        this.produtoNaoEncontrado = false;
      } else {
        this.produtoNaoEncontrado = true;
      }
    } catch (error: any) {
      console.error('Erro ao obter produto:', error);
      this.produtoNaoEncontrado = true;
    }
  }
}




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
  const totalProdutos = this.produtoslista.reduce((total, item) => {
    if (this.produtoValido(item.produto)) {
      total += item.quantidade * item.produto.preco;
    }
    return total;
  }, 0);

  if (!this.itenspedidoApi) {
    return totalProdutos; // Retorna apenas o total dos produtos se não houver itens de pedido
  }

  const totalItensPedido = this.itenspedidoApi.reduce((total: number, item: { quantidade: number; preco: number; }) => {
    return total + (item.quantidade * item.preco);
  }, 0);

  return totalProdutos + totalItensPedido;
}

calcularQuantidadeTotalPedido(): number {
  let totalQuantidadeProdutos = 0;

  for (let item of this.produtoslista) {
    totalQuantidadeProdutos += Number(item.quantidade);
  }

  let totalQuantidadeItensPedido = this.itenspedidoApi.reduce((total: number, item: { quantidade: any; }) => {
    return total + Number(item.quantidade);
  }, 0);

  return totalQuantidadeProdutos + totalQuantidadeItensPedido;
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
  const itemEditando = this.produtoslista[indice] || this.itenspedidoApi[indice];
  this.codigoProduto = itemEditando.produto.produtoid || itemEditando.produto_id;
  this.quantidadeProduto = itemEditando.quantidade;
  this.indiceItemEditando = indice;
  this.editandoItem = true
}

verificarSeHaItens(): boolean {
  return this.produtoslista.length > 0 || this.itenspedidoApi.length > 0
}
}
