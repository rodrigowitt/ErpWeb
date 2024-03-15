import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PedidosService } from '../pedido.service';
import { Pedidos } from 'src/pedidos';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {ProdutosService} from 'src/app/produtos.service'
import { Produtos } from 'src/produtos';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pagina-pedidos',
  templateUrl: './pagina-pedidos.component.html',
  styleUrls: ['./pagina-pedidos.component.css']
})
export class PaginaPedidosComponent {
  public pedidos: Pedidos [] = [];
  public produtos: Produtos [] = [];
  private apiServerUrl = environment.apiBaseUrl;
  codigoProduto!: string;
  public produtoslista: any[] = []

  constructor (private pedidoService: PedidosService, private produtosService : ProdutosService, private http: HttpClient){};

  ngOnInit(): void {
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

async adicionarProduto(codigoProduto: string ) {
  try {
    console.log("o produto é: " + codigoProduto)
    const produto = await this.http.get<Produtos[]>(`${this.apiServerUrl}produto/${this.codigoProduto}`).toPromise();
    if (produto) {
      this.produtoslista.push(produto);
    } else {
      console.error('Produto não encontrado.');
    }
  } catch (error) {
    console.error('Erro ao obter produto:', error);
  }
}

produtoValido(produto: any): boolean {
  return produto && produto.produtoid && produto.codigo && produto.nome && produto.preco;
}


}
