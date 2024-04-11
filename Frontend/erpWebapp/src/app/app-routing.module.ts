import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { PaginaPedidosComponent } from './pagina-pedidos/pagina-pedidos.component';
import { CadastrarClientesComponent } from './components/cadastrar-clientes/cadastrar-clientes.component';
import { ListarclientesComponent } from './listarclientes/listarclientes.component';
import { EditarclientesComponent } from './editarclientes/editarclientes.component';
import { EditarpedidosComponent } from './editarpedidos/editarpedidos.component';

const routes:Routes = [
  {path: 'pedidos', component: PedidosComponent},
  {path: 'pedidos/novo', component: PaginaPedidosComponent},
  {path: 'clientes/novo', component: CadastrarClientesComponent},
  {path: 'clientes', component: ListarclientesComponent},
  {path: 'clientes/editar/:id', component: EditarclientesComponent},
  {path: 'pedidos/editar/:id', component: EditarpedidosComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
