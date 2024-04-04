import { Component } from '@angular/core';
import { ClienteService } from '../cliente.service';
import { Clientes } from 'src/clientes';
import { HttpErrorResponse } from '@angular/common/http';
import { response } from 'express';
import { error } from 'jquery';

@Component({
  selector: 'app-listarclientes',
  templateUrl: './listarclientes.component.html',
  styleUrls: ['./listarclientes.component.css']
})
export class ListarclientesComponent {
  public cliente: Clientes[] = []

  constructor(private clientesService : ClienteService){}

  ngOnInit(): void {
    this.getClientes();
   }

  public getClientes():void{
    this.clientesService.getClientes().subscribe(
      (response : Clientes[]) => {
          this.cliente = response;
      }, (error: HttpErrorResponse) => {alert(error.message)}
      )    
}

public deletarClientes(clienteId: number ):void{
  this.clientesService.deleteCliente(clienteId).subscribe(
    (response:void) =>{
      this.getClientes();
    },
    (error: HttpErrorResponse)=>{
      alert(error.message)
    }
  )
}

}
