import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PedidosService } from '../pedido.service';
import { Pedidos } from 'src/pedidos';
import { HttpErrorResponse } from '@angular/common/http';
import {ProdutosService} from 'src/app/produtos.service'
import { Produtos } from 'src/produtos';

@Component({
  selector: 'app-pagina-pedidos',
  templateUrl: './pagina-pedidos.component.html',
  styleUrls: ['./pagina-pedidos.component.css']
})
export class PaginaPedidosComponent {
  public pedidos: Pedidos [] = [];
  public produtos: Produtos [] = [];


  constructor (private pedidoService: PedidosService, private produtosService : ProdutosService){};

  ngOnInit(): void {
    this.getProdutos();
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


  public onAddPed(addForm: NgForm) : void{
    document.getElementById('add-ped-form')?.click();
      this.pedidoService.addPedido(addForm.value).subscribe(
        (response: Pedidos) => {
          console.log(response)
          addForm.reset();
    
          location.reload();
  
        },
        (error: HttpErrorResponse)=>{
          alert(error.message)
        }
        )
      

}
}
