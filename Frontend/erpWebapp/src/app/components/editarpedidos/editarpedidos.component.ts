import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ItensPedidos } from 'src/itenspedidos';
import { Pedidos } from 'src/pedidos';
import { Produtos } from 'src/produtos';
import { PedidosService } from '../../pedido.service';
import { ProdutosService } from '../../produtos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from 'src/app/cliente.service';
import { Clientes } from 'src/clientes';

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
  indiceItemEditandolista: number = -1;
  totalPedido!: number;
  produto: any;
  nomeProduto: string = '';
  pedidoId: any;
  itenspedidoId: any;
  numeroTotalItens: number = 0;
  cliente: string = '';
  clientes: Clientes[] = [];
  mensagem: string = '';
  clientesSugeridos: Clientes[] = [];
  idclientepedido: any = 3;

  constructor (private pedidoService: PedidosService, private produtosService : ProdutosService, private route: ActivatedRoute, private http: HttpClient, private router: Router, private clienteService: ClienteService){};

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
        this.idclientepedido = pedidosApi.cliente_id;
        console.log("o id carregado do pedido é " + this.idclientepedido)
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
  
  buscarCliente() {
    if (this.pedidosApi.cliente !== '') {
      this.clienteService.buscarCliente(this.pedidosApi.cliente ).subscribe(
        (clientes: Clientes[]) => {
          if (clientes && clientes.length > 0) {
            this.clientesSugeridos = clientes;
            this.mensagem = '';
          } else {
            this.clientesSugeridos = [];
            this.mensagem = 'Cliente não encontrado';
          }
        },
        (error: any) => {
          console.error('Erro ao obter cliente:', error);
          this.clientesSugeridos = [];
          this.mensagem = 'Erro ao obter cliente';
        }
      );
    } else {
      this.clientesSugeridos = [];
      this.mensagem = '';
    }
  }

  selecionarCliente(cliente: Clientes) {
    this.pedidosApi.cliente = cliente.nomeFantasia;
    this.clientesSugeridos = [];
    this.idclientepedido = cliente.clienteid;
  }

  limparSugestoes() {
    setTimeout(() => {
      this.clientesSugeridos = [];
    }, 200);
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
  const cliente = this.idclientepedido;
  const formaPagamento = addForm.value.forma_pagamento;
  let desconto = addForm.value.desconto;
  let status = addForm.value.status;
  console.log("o id do pedido enviado é " + this.idclientepedido)
  const total = this.calcularTotalPedido();

  if (!desconto || isNaN(desconto)) {
    desconto = 0;
  }

  const pedido: Pedidos = {
    cliente_id: cliente,
    forma_pagamento: formaPagamento,
    status : status,
    desconto: desconto,
    total: total,
    date: '',
    cliente: '',
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
  if (this.indiceItemEditando !== -1 ||   this.indiceItemEditandolista !== -1) {
    try {
      const produto: any = await this.http.get(`${this.apiServerUrl}produto/${this.codigoProduto}`).toPromise();
      if (produto && Object.keys(produto).length > 0) {
        const itemEditando =  this.itenspedidoApi[this.indiceItemEditando ] || this.produtoslista[ this.indiceItemEditandolista] ;
        
        //controlar se está editando produto da api ou da lista
        if (this.indiceItemEditando !== -1){
        itemEditando.produto = produto.nome; 
        itemEditando.preco = produto.preco; 
        
        itemEditando.quantidade = this.quantidadeProduto;
        itemEditando.produto_id = this.codigoProduto;
        
        console.log("editando um produto de api" )
        }else{
          itemEditando.produto.codigo = this.codigoProduto;
          itemEditando.produto = produto;
          itemEditando.quantidade = this.quantidadeProduto;
          console.log("editando um produto da lista" )
        }

        // Limpa as variáveis
        this.codigoProduto = '';
        this.quantidadeProduto = '';
        this.nomeProduto = '';
        this.indiceItemEditando = -1; 
        this.indiceItemEditandolista = -1;
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
      console.log("indo adicionar produto")
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


limparVariaveis() {
  this.codigoProduto = '';
  this.quantidadeProduto = '';
  this.nomeProduto = '';
  this.indiceItemEditando = -1; 
  this.indiceItemEditandolista = -1
  this.editandoItem = false;
  this.produtoNaoEncontrado = false;
}



buscarProduto() {
  if (this.codigoProduto.trim() !== '') {
    this.http.get<any>(`${this.apiServerUrl}produto/${this.codigoProduto}`).subscribe(
      (produto: any) => {
        if (produto && produto.nome) {
          this.nomeProduto = produto.nome;
          // Atualiza o valor do campo de descrição do produto
          const descricaoProdutoInput = document.getElementById('descricaoProduto') as HTMLInputElement;
          if (descricaoProdutoInput) {
            descricaoProdutoInput.value = produto.nome;
          }
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
  console.log("Valor do indice: " + indice)
  const itemEditando = this.itenspedidoApi[indice ] ;
  this.codigoProduto =  this.itenspedidoApi[indice].produto_id 
  this.quantidadeProduto = itemEditando.quantidade;
  this.nomeProduto = this.itenspedidoApi[indice].produto
  this.indiceItemEditando = indice;
  this.editandoItem = true
}

editarItemlista(indice: number) {
  console.log("Valor do indice da lista: " + indice)
  const itemEditando = this.produtoslista[indice];
  this.codigoProduto = itemEditando.produto.produtoid;
  this.quantidadeProduto = itemEditando.quantidade;
  this.nomeProduto = itemEditando.produto.nome
  console.log("nome do produto da lista: " + itemEditando.produto.nome)
  this.indiceItemEditandolista = indice;
  this.editandoItem = true
}

verificarSeHaItens(): boolean {
  return this.produtoslista.length > 0 || this.itenspedidoApi.length > 0 && this.indiceItemEditando == -1 && this.indiceItemEditandolista == -1 
}
}
