import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PedidosService } from '../pedido.service';
import { Pedidos } from 'src/pedidos';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-pagina-pedidos',
  templateUrl: './pagina-pedidos.component.html',
  styleUrls: ['./pagina-pedidos.component.css']
})
export class PaginaPedidosComponent {
  public pedidos: Pedidos [] = [];

  constructor (private pedidoService: PedidosService){};

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
