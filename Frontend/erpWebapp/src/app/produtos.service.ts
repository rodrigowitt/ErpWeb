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
}
