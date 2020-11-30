import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TiendaRoutingModule } from './tienda-routing.module';
import { TiendaComponent } from './tienda.component';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';


@NgModule({
  declarations: [TiendaComponent],
  imports: [
    CommonModule,
    TiendaRoutingModule,
    MatIconModule,
    MatRippleModule
  ]
})
export class TiendaModule { }
