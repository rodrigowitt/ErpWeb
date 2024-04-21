import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ItensPedidos } from 'src/itenspedidos';
import {Pedidos} from 'src/pedidos'

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  itensPedido: any[] = [];
  novoProduto: any = {};

  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  public getPedidos(): Observable<Pedidos[]>{
  return this.http.get<Pedidos[]>(`${this.apiServerUrl}pedido`)}

  public getPesquisa(numeroPedido : string, numeroCliente: string): Observable<Pedidos[]>{
    return this.http.get<Pedidos[]>(`${this.apiServerUrl}pedido/buscar/${numeroPedido}/${numeroCliente}`)
  }
  public addPedido(pedido: Pedidos): Observable<Pedidos>{
    return this.http.post<Pedidos>(`${this.apiServerUrl}pedido`, pedido)
  }
  public addITensPedido(itenspedido : ItensPedidos): Observable<ItensPedidos>{
    return this.http.post<ItensPedidos>(`${this.apiServerUrl}itenspedido`, itenspedido)
  }

  public getPedidoById(pedidoId: number): Observable<Pedidos> {
    return this.http.get<Pedidos>(`${this.apiServerUrl}pedido/${pedidoId}`);
  }

  public getItensPedidoById(pedidoId: number): Observable<ItensPedidos[]> {
    return this.http.get<ItensPedidos[]>(`${this.apiServerUrl}itenspedido/${pedidoId}`);
  }

  public updatePedido(pedidoId: number , pedido: Pedidos): Observable<Pedidos>{
    return this.http.put<Pedidos>(`${this.apiServerUrl}pedido/${pedidoId}`, pedido)
  }

  public updateItensPedido(itemPedidoId: number , itemPedido: ItensPedidos): Observable<ItensPedidos>{
    return this.http.put<ItensPedidos>(`${this.apiServerUrl}itenspedido/${itemPedidoId}`, itemPedido);
  }

  public updateItensPedidoLista(itemPedidoId: number ,itensPedidos: ItensPedidos[]): Observable<ItensPedidos[]> {
    return this.http.put<ItensPedidos[]>(`${this.apiServerUrl}itenspedido/${itemPedidoId}`, itensPedidos);
  }
  
  
  public deletePedido(pedidoId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}itenspedido/${pedidoId}`).pipe(
      catchError(error => {
        console.error('Erro ao excluir itens de pedido:', error);
        return throwError(error);
      }),
      switchMap(() => {
        // Após excluir os itens de pedido, agora podemos excluir o pedido
        return this.http.delete<void>(`${this.apiServerUrl}pedido/${pedidoId}`).pipe(
          catchError(error => {
            console.error('Erro ao excluir pedido:', error);
            return throwError(error);
          })
        );
      })
    );
  }

  public deleteCliente(clienteId: number): Observable<void>{
    return this.http.delete<void>(`${this.apiServerUrl}cliente/${clienteId}`)
}
  
  
  


  adicionarProduto() {
    this.itensPedido.push({
      produto: this.novoProduto.produto,
      quantidade: this.novoProduto.quantidade,
      preco: this.novoProduto.preco
    });
    this.novoProduto = {};
  }
  
}
