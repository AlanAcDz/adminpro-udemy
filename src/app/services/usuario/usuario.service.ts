import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  usuario: Usuario;
  token: string;
  constructor(
    public http: HttpClient,
    public router: Router,
    public uploadServ: SubirArchivoService
  ) {
    this.cargarStorage();
  }
  guardarStorarge(id: string, token: string, usuario: Usuario) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.usuario = usuario;
    this.token = token;
  }
  cargarStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      this.token = '';
      this.usuario = null;
    }
  }
  logout() {
    this.token = '';
    this.usuario = null;
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }
  signinGoogle(token: string) {
    const url = URL_SERVICIOS + '/login/google';
    return this.http.post(url, { token }).pipe(map((resp: any) => {
      this.guardarStorarge(resp.id, resp.token, resp.usuario);
      return true;
    }));
  }
  login(usuario: Usuario, recordar: boolean) {
    if (recordar) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }
    const url = URL_SERVICIOS + '/login';
    return this.http.post(url, usuario).pipe(map((resp: any) => {
      this.guardarStorarge(resp.id, resp.token, resp.usuario);
      return true;
    }));
  }
  crearUsuario(usuario: Usuario) {
    const url = URL_SERVICIOS + '/usuario';
    return this.http.post(url, usuario).pipe(map((resp: any) => {
      swal.fire('Usuario creado', usuario.email, 'success');
      return resp.usuario;
    }));
  }
  actualizarUsuario(usuario: Usuario) {
    const url = `${ URL_SERVICIOS }/usuario/${ usuario._id }?token=${ this.token }`;
    return this.http.put(url, usuario).pipe(map((resp: any) => {
      const userDB: Usuario = resp.usuario;
      this.guardarStorarge(userDB._id, this.token, userDB);
      swal.fire('Usuario actualizado', usuario.nombre, 'success');
      return true;
    }));
  }
  cambiarImg(archivo: File, id: string) {
    this.uploadServ.subirArchivo(archivo, 'usuarios', id).then((resp: any) => {
      console.log(resp);
      this.usuario.img = resp.usuario.img;
      swal.fire('Imagen actualizada', this.usuario.nombre, 'success');
      this.guardarStorarge(id, this.token, this.usuario);
    }).catch(resp => {
      console.log(resp);
    });
  }
  estaLogueado(): boolean {
    return (this.token.length > 5) ? true : false;
  }
}
