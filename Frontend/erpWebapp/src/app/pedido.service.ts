import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {Pedidos} from 'src/pedidos'

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  public getPedidos(): Observable<Pedidos[]>{
  return this.http.get<Pedidos[]>(`${this.apiServerUrl}pedido`)}

  public getPesquisa(numeroPedido : string, numeroCliente: string): Observable<Pedidos[]>{
    return this.http.get<Pedidos[]>(`${this.apiServerUrl}pedido/buscar/${numeroPedido}/${numeroCliente}`)
  }
}
