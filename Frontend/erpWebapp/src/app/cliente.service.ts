import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ClientesConsulta } from 'src/clientesConsulta'; // Importe corrigido do modelo
import { environment } from 'src/environments/environment';
import { Clientes } from 'src/clientes';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {


  private apiServerUrl = environment.apiBaseUrl;

  private consultaServerUrl = 'http://localhost:3000/api/cnpj/';

  constructor(private http: HttpClient) { }

  getClientesConsulta(cnpj: string): Observable<ClientesConsulta> { 
    return this.http.get<ClientesConsulta>(`${this.consultaServerUrl}${cnpj}`);
  }

  public addCliente(cliente: Clientes): Observable<Clientes>{
    return this.http.post<Clientes>(`${this.apiServerUrl}cliente`, cliente);
  }

  public buscarCliente(cliente: string): Observable<Clientes[]> {
    return this.http.get<Clientes[]>(`${this.apiServerUrl}cliente/buscar/${cliente}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Erro ao obter cliente:', error);
    return throwError('Erro ao obter cliente; por favor, tente novamente mais tarde.');
  }

  public getClientes(): Observable<Clientes[]>{
    return this.http.get<Clientes[]>(`${this.apiServerUrl}cliente`)}

  public deleteCliente(clienteId: number): Observable<void>{
      return this.http.delete<void>(`${this.apiServerUrl}cliente/${clienteId}`)
  }

  public updateCliente(clienteId: number , cliente: Clientes): Observable<Clientes>{
    return this.http.put<Clientes>(`${this.apiServerUrl}cliente/${clienteId}`, cliente)
  }

  public getClienteById(clienteId: number): Observable<Clientes> {
    return this.http.get<Clientes>(`${this.apiServerUrl}cliente/${clienteId}`);
  }
  
}
