import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
  
}
