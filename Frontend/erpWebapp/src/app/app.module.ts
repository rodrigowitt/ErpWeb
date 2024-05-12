import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './components/nav/nav.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import  {HttpClientModule}  from '@angular/common/http'
import { FormsModule } from '@angular/forms';
import { PaginaPedidosComponent } from './components/pagina-pedidos/pagina-pedidos.component';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { CadastrarClientesComponent } from './components/cadastrar-clientes/cadastrar-clientes.component';
import { ListarclientesComponent } from './components/listarclientes/listarclientes.component';
import { EditarclientesComponent } from './components/editarclientes/editarclientes.component';
import { EditarpedidosComponent } from './components/editarpedidos/editarpedidos.component';
import { ProdutosComponent } from './components/produtos/produtos.component';
import { ListarprodutosComponent } from './components/listarprodutos/listarprodutos.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EditarprodutosComponent } from './components/editarprodutos/editarprodutos.component';




@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    PedidosComponent,
    PaginaPedidosComponent,
    CadastrarClientesComponent,
    ListarclientesComponent,
    EditarclientesComponent,
    EditarpedidosComponent,
    ProdutosComponent,
    ListarprodutosComponent,
    EditarprodutosComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule, 
    AppRoutingModule,
    FormsModule,
    NoopAnimationsModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
