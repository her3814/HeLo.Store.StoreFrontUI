import { Injectable } from '@angular/core';
import { EnvioTipo, EnvioTipos } from '../clases/envio-tipo';

@Injectable({
  providedIn: 'root'
})
export class EnviosService {

  constructor() { }

  obtenerTiposEnvio() : Promise<EnvioTipo[]> {

    var retira: EnvioTipo = {
      costo: 0,
      descripcion: "Retiro Yo",
      requiereDomicilio: false,
      tipo: EnvioTipos.retiro,
    }

    var envio: EnvioTipo = {
      costo: 30,
      descripcion: "A Domicilio",
      requiereDomicilio: true,
      tipo: EnvioTipos.domicilio,
    }
    
    return new Promise(res => { res([retira, envio]); });
  }
}
