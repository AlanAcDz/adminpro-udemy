import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from '../usuario/usuario.service';
import { URL_SERVICIOS } from 'src/app/config/config';
import { map } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Medico } from '../../models/medico.model';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  token: string;
  totalMedicos = 0;
  constructor(
    public http: HttpClient,
    public usuarioServ: UsuarioService
  ) {}
  cargarToken() {
    this.token = this.usuarioServ.token;
  }
  cargarMedicos(desde: number = 0) {
    const url = `${ URL_SERVICIOS }/medico?desde=${ desde }`;
    return this.http.get(url).pipe(map((resp: any) => {
      this.totalMedicos = resp.total;
      return resp.medicos;
    }));
  }
  cargarMedico(id: string) {
    const url = `${ URL_SERVICIOS }/medico/${ id }`;
    return this.http.get(url).pipe(map((resp: any) => resp.medico));
  }
  buscarMedicos(termino: string) {
    const url = `${ URL_SERVICIOS }/busqueda/coleccion/medicos/${ termino }`;
    return this.http.get(url).pipe(map((resp: any) => resp.medicos));
  }
  borrarMedico(id: string) {
    const url = `${ URL_SERVICIOS }/medico/${ id }?token=${ this.token }`;
    return this.http.delete(url).pipe(map(() => {
      swal.fire('Médico borrado', 'Medico borrado correctamente', 'success');
      return true;
    }));
  }
  guardarMedico(medico: Medico) {
    let url: string;
    if (medico._id) {
      url = `${ URL_SERVICIOS }/medico/${ medico._id }?token=${ this.token }`;
      return this.http.put(url, medico).pipe(map((resp: any) => {
        swal.fire('Medico actualizado', medico.nombre, 'success');
        return resp.medico;
      }));
    } else {
      url = `${ URL_SERVICIOS }/medico?token=${ this.token }`;
      return this.http.post(url, medico).pipe(map((resp: any) => {
        swal.fire('Medico creado', medico.nombre, 'success');
        return resp.medico;
      }));
    }
  }
}
