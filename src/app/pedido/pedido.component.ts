import { Component, OnInit } from '@angular/core';
import { ProductoVariedad } from '../shared/clases/producto-variedad';
import { PedidoService } from '../shared/servicios/pedido.service';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.scss']
})
export class PedidoComponent implements OnInit {
  pedido: Map<ProductoVariedad, number> | undefined;

  constructor(private pedidoSvc: PedidoService) {

  }

  ngOnInit(): void {
    this.pedidoSvc.obtenerPedido().then(res => {

      console.log(res);

      this.pedido = new Map<ProductoVariedad, number>();

      res.forEach(((k, v) => {
        console.log(v);
      }));

      var arr = Array.from(res.keys());
      console.log(arr);
      arr.forEach((key) => {
        console.log(key);
        if (res.get(key)! > 0) {
          this.pedido?.set(key, res.get(key)!);
        }
      });
      console.log(this.pedido);
    });
  }

}
