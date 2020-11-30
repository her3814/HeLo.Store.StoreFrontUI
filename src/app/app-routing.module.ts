import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConocenosComponent } from './conocenos/conocenos.component';
import { ContactoComponent } from './contacto/contacto.component';
import { FaqComponent } from './faq/faq.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'Tienda',
    pathMatch: 'full'
  },
  {
    path: 'Tienda',    
    loadChildren: () => import('./tienda/tienda.module').then(m => m.TiendaModule)
  },
  {
    path:'Pedido',
    loadChildren: () => import('./pedido/pedido.module').then(m => m.PedidoModule)
  },
  {
    path:'faq',
    component:FaqComponent
  },
  {
    path:'Conocenos',
    component: ConocenosComponent
  },
  {
    path:'Contacto',
    component: ContactoComponent
  },
  {
    path:'**',
    component: NotFoundComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
