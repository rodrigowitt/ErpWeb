import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Produtos } from 'src/produtos';

@Injectable({
  providedIn: 'root'
})
export class ProdutosService {

  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  public getProdutos():Observable<Produtos[]>{
    return this.http.get<Produtos[]>(`${this.apiServerUrl}produto`)
  }

  public addProduto(produto: Produtos): Observable<Produtos>{
    return this.http.post<Produtos>(`${this.apiServerUrl}produto`, produto)
  }

  public deleteProduto(produtoId: number): Observable<void>{
    return this.http.delete<void>(`${this.apiServerUrl}produto/${produtoId}`)
}

public getProdutoById(produtoId: number): Observable<Produtos> {
  return this.http.get<Produtos>(`${this.apiServerUrl}produto/${produtoId}`);
}
}
