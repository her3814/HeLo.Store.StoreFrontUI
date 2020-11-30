import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'Tienda',
    loadChildren: () => import('./tienda/tienda.module').then(m => m.TiendaModule)
  },
  {
    path:'Pedido',
    loadChildren: () => import('./pedido/pedido.module').then(m => m.PedidoModule)
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
