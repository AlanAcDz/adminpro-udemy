import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Hospital } from '../../models/hospital.model';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import { UsuarioService } from '../usuario/usuario.service';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {
  token: string;
  constructor(
    public http: HttpClient,
    public usuarioServ: UsuarioService
  ) {}
  cargarToken() {
    this.token = this.usuarioServ.token;
  }
  cargarHospitales(desde: number = 0) {
    const url = `${ URL_SERVICIOS }/hospital?desde=${ desde }`;
    return this.http.get(url);
  }
  obtenerHospital(id:	string) {
    const url = `${ URL_SERVICIOS }/hospital/${ id }`;
    return this.http.get(url).pipe(map((resp: any) => resp.hospital));
  }
  buscarHospital(termino: string) {
    const url = `${ URL_SERVICIOS }/busqueda/coleccion/hospitales/${ termino }`;
    return this.http.get(url).pipe(map((resp: any) => resp.hospitales));
  }
  borrarHospital(id: string) {
    const url = `${ URL_SERVICIOS }/hospital/${ id }?token=${ this.token }`;
    return this.http.delete(url).pipe(map((resp: any) => {
      swal.fire('Hospital borrado', 'Eliminado correctamente', 'success');
      return true;
    }));
  }
  crearHospital(nombre: string) {
    const url = `${ URL_SERVICIOS }/hospital?token=${ this.token }`;
    return this.http.post(url, { nombre }).pipe(map((resp: any) => resp.hospital));
  }
  actualizarHospital(hospital: Hospital) {
    const url = `${ URL_SERVICIOS }/hospital/${ hospital._id }?token=${ this.token }`;
    return this.http.put(url, hospital).pipe(map((resp: any) => {
      swal.fire('Hospital actualizado', resp.hospital.nombre, 'success');
      return resp.hospital;
    }));
  }
}
