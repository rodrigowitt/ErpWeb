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
  public produtoslista: any[] = []
  produtoNaoEncontrado: boolean = false;
  editandoItem: boolean = false;
  indiceItemEditando: number = -1;
  totalPedido!: number;


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

public onAddPedido(addForm: NgForm): void {
  const total = this.calcularTotalPedido();
  const pedido = { ...addForm.value,  total};
  document.getElementById('add-ped-form')?.click();
  this.pedidoService.addPedido(pedido).subscribe(
    (response: Pedidos) => {
      console.log(response)
      addForm.reset();
      location.reload();
    },
    (error: HttpErrorResponse) => {
      alert(error.message)
    }
  )
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




}
