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
  

  ngOnInit(): void {
   this.getPedidos();
  }

  constructor( private pedidosService : PedidosService ){}

  public getPedidos():void{
    this.pedidosService.getPedidos().subscribe(
      (response : Pedidos[]) => {
          this.pedido = response;
          console.log("Executando getPedidos: " + this.pedido)
      }, (error: HttpErrorResponse) => {alert(error.message)}
      )    
}
}
