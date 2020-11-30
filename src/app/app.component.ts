import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { PedidoService } from './shared/servicios/pedido.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'StoreFront';

  constructor(private iconRegister: MatIconRegistry, sanitizer: DomSanitizer, private pedidoSvc: PedidoService) {
    this.iconRegister.addSvgIcon(
      'whatsapp',
      sanitizer.bypassSecurityTrustResourceUrl('assets/logos/logo-whatsapp.svg'));
    this.iconRegister.addSvgIcon(
      'messenger',
      sanitizer.bypassSecurityTrustResourceUrl('assets/logos/logo-messenger.svg'));
    this.iconRegister.addSvgIcon(
      'instagram',
      sanitizer.bypassSecurityTrustResourceUrl('assets/logos/logo-instagram.svg'));

  }
  get pedidoItems(): number {
    return this.pedidoSvc.cantidadItems;
  }
}
