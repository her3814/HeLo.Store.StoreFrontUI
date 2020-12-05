import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PedidoRoutingModule } from './pedido-routing.module';
import { PedidoComponent } from './pedido.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import {MatExpansionModule} from '@angular/material/expansion';

import {MatButtonToggleModule} from '@angular/material/button-toggle';

@NgModule({
  declarations: [PedidoComponent],
  imports: [
    CommonModule,
    PedidoRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
    MatExpansionModule,
    MatButtonToggleModule
  ]
})
export class PedidoModule { }
