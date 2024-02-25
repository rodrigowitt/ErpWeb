import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './components/nav/nav.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import  {HttpClientModule}  from '@angular/common/http'

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    PedidosComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule, 
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
