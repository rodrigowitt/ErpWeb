import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { PaginaPedidosComponent } from './components/pagina-pedidos/pagina-pedidos.component';
import { CadastrarClientesComponent } from './components/cadastrar-clientes/cadastrar-clientes.component';
import { ListarclientesComponent } from './components/listarclientes/listarclientes.component';
import { EditarclientesComponent } from './components/editarclientes/editarclientes.component';
import { EditarpedidosComponent } from './components/editarpedidos/editarpedidos.component';
import { ProdutosComponent } from './components/produtos/produtos.component';

const routes:Routes = [
  {path: 'pedidos', component: PedidosComponent},
  {path: 'pedidos/novo', component: PaginaPedidosComponent},
  {path: 'clientes/novo', component: CadastrarClientesComponent},
  {path: 'clientes', component: ListarclientesComponent},
  {path: 'clientes/editar/:id', component: EditarclientesComponent},
  {path: 'pedidos/editar/:id', component: EditarpedidosComponent},
  {path: 'produtos', component: ProdutosComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
