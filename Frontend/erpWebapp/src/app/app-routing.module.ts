import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { PaginaPedidosComponent } from './pagina-pedidos/pagina-pedidos.component';

const routes:Routes = [
  {path: 'pedidos', component: PedidosComponent},
  {path: 'pedidos/novo', component: PaginaPedidosComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
