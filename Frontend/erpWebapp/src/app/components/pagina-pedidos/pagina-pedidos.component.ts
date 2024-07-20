import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { PedidosService } from '../../pedido.service';
import { Pedidos } from 'src/pedidos';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {ProdutosService} from 'src/app/produtos.service'
import { Produtos } from 'src/produtos';
import { environment } from 'src/environments/environment';
import { ItensPedidos } from 'src/itenspedidos';
import { Clientes } from 'src/clientes';
import { ClienteService } from 'src/app/cliente.service';


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
  cliente: string = '';
  clientes: Clientes[] = [];
  mensagem: string = '';
  clientesSugeridos: Clientes[] = [];
  idclientepedido: any;
  clienteselecionado : boolean = false;

  

  constructor (private pedidoService: PedidosService, private produtosService : ProdutosService, private http: HttpClient, private clienteService: ClienteService, private eRef: ElementRef){};

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
  
  buscarCliente() {
    if (this.cliente.trim() !== '') {
      this.clienteService.buscarCliente(this.cliente).subscribe(
        (clientes: Clientes[]) => {
          if (clientes && clientes.length > 0) {
            this.clientesSugeridos = clientes;
            this.mensagem = '';
          } else {
            this.clientesSugeridos = [];
            this.clienteselecionado = false;
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
    console.log("adicionou cliente")
    this.cliente = cliente.nomeFantasia;
    this.clientesSugeridos = [];
    this.idclientepedido = cliente.clienteid;
    this.clienteselecionado = true;
  }

  limparSugestoes() {
    setTimeout(() => {
      this.clientesSugeridos = [];
    }, 200);
  }

  @HostListener('document:click', ['$event'])
  clickOut(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.clientesSugeridos = [];
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
  const clienteId = this.idclientepedido;
  const formaPagamento = addForm.value.forma_pagamento;
  let desconto = addForm.value.desconto;
  const status = addForm.value.status;
  const total = this.calcularTotalPedido();


  if (!desconto || isNaN(desconto)) {
    desconto = 0;
  }

  const pedido: Pedidos = {
    cliente_id: clienteId,
    forma_pagamento: formaPagamento,
    status: status,
    desconto: desconto,
    total: total,
    date: '',
    cliente: '',
    pedidoid: 0,
    entrada: ''
  };

  this.ultimocliente = clienteId;
  this.ultimaFormaPagamento = formaPagamento;
  this.ultimoTotal = total;
  this.ultimoDesconto = desconto;

  // Chamada ao serviço para adicionar o pedido
  this.pedidoService.addPedido(pedido).subscribe(
    (pedidoAdicionado: any) => {
      // Adicionando itens do pedido
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
        this.clienteselecionado = false;
        this.openModal();
        this.pedidoService.addITensPedido(itemPedido).subscribe(() => {
          
        }, (error) => {
          console.error('Erro ao adicionar item de pedido:', error);
        });
      });

      
      this.produtoslista = [];
      addForm.resetForm();
    },
    (error) => {
      console.error('Erro ao adicionar pedido:', error);
    }
  );
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
        console.log("Código do produto: " + this.codigoProduto)
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
