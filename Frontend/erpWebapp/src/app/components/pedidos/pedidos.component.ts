import { Component } from '@angular/core';
import { Pedidos } from 'src/pedidos';
import {PedidosService} from 'src/app/pedido.service'
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent {
  public pedido : Pedidos [] = [];
  numeroPedido: string = '';
  numeroCliente: string = '';


  ngOnInit(): void {
   this.getPedidos();
  }

  constructor( private pedidosService : PedidosService ){}

  public getPedidos():void{
    this.pedidosService.getPedidos().subscribe(
      (response : Pedidos[]) => {
          this.pedido = response;
      }, (error: HttpErrorResponse) => {alert(error.message)}
      )    
}

public getBuscar(numeroPedido : string, numeroCliente : string):void{
  if (numeroPedido.trim() === ''){numeroPedido = "0"}
  if (numeroCliente.trim() === ''){numeroCliente = "0"}
  this.pedidosService.getPesquisa(numeroPedido, numeroCliente).subscribe(
    (response : Pedidos[]) => {
      this.pedido = response;
    }, (error: HttpErrorResponse) => {alert(error.message)}
    )
}
}
