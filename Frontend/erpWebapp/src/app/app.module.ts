import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './components/nav/nav.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import  {HttpClientModule}  from '@angular/common/http'
import { FormsModule } from '@angular/forms';
import { PaginaPedidosComponent } from './pagina-pedidos/pagina-pedidos.component';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Importando o arquivo do plugin Bootstrap


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    PedidosComponent,
    PaginaPedidosComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule, 
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
