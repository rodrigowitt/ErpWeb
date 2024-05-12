import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProdutosService } from 'src/app/produtos.service';
import { Produtos } from 'src/produtos';

@Component({
  selector: 'app-listarprodutos',
  templateUrl: './listarprodutos.component.html',
  styleUrls: ['./listarprodutos.component.css']
})
export class ListarprodutosComponent {
  public produto : Produtos[] = []

  constructor(private produtosService : ProdutosService, private router: Router){}

  ngOnInit(): void {
    this.getProdutos();
   }

  public getProdutos():void{
    this.produtosService.getProdutos().subscribe(
      (response : Produtos[]) => {
          this.produto = response;
      }, (error: HttpErrorResponse) => {alert(error.message)}
      )    
}

public deletarProdutos(produtoId: number ):void{
  this.produtosService.deleteProduto(produtoId).subscribe(
    (response:void) =>{
      this.getProdutos();
    },
    (error: HttpErrorResponse)=>{
      alert(error.message)
    }
  )
}

public AbrirProduto(produtoId: string): void {
  this.produtosService.getProdutoById(produtoId).subscribe(
    (produto: Produtos) => {
      this.router.navigate(['produtos/editar/', produtoId], { state: { produto: produto } });
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  );
}

}
