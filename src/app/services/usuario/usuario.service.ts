import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  usuario: Usuario;
  token: string;
  menu: any[] = [];
  constructor(
    public http: HttpClient,
    public router: Router,
    public uploadServ: SubirArchivoService
  ) {
    this.cargarStorage();
  }
  renuevaToken() {
    const url = `${ URL_SERVICIOS }/login/renuevatoken?token=${ this.token }`;
    return this.http.get(url).pipe(map((resp: any) => {
      this.token = resp.token;
      localStorage.setItem('token', this.token);
      return true;
    }), catchError(err => {
      this.router.navigate(['/login']);
      swal.fire('No se pudo renovar token', 'No fue posible renovar token', 'error');
      return throwError(err);
    }));
  }
  guardarStorarge(id: string, token: string, usuario: Usuario, menu: any) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menu', JSON.stringify(menu));
    this.usuario = usuario;
    this.token = token;
    this.menu = menu;
  }
  cargarStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.menu = JSON.parse(localStorage.getItem('menu'));
    } else {
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }
  }
  logout() {
    this.token = '';
    this.usuario = null;
    this.menu = [];
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');
    this.router.navigate(['/login']);
  }
  signinGoogle(token: string) {
    const url = URL_SERVICIOS + '/login/google';
    return this.http.post(url, { token }).pipe(map((resp: any) => {
      this.guardarStorarge(resp.id, resp.token, resp.usuario, resp.menu);
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
      this.guardarStorarge(resp.id, resp.token, resp.usuario, resp.menu);
      return true;
    }), catchError(err => {
      swal.fire('Error en login', err.error.mensaje, 'error');
      return throwError(err);
    }));
  }
  crearUsuario(usuario: Usuario) {
    const url = URL_SERVICIOS + '/usuario';
    return this.http.post(url, usuario).pipe(map((resp: any) => {
      swal.fire('Usuario creado', usuario.email, 'success');
      return resp.usuario;
    }), catchError(err => {
      swal.fire(err.error.mensaje, err.error.errors.message, 'error');
      return throwError(err);
    }));
  }
  actualizarUsuario(usuario: Usuario) {
    const url = `${ URL_SERVICIOS }/usuario/${ usuario._id }?token=${ this.token }`;
    return this.http.put(url, usuario).pipe(map((resp: any) => {
      if (usuario._id === this.usuario._id) {
        const userDB: Usuario = resp.usuario;
        this.guardarStorarge(userDB._id, this.token, userDB, this.menu);
      }
      swal.fire('Usuario actualizado', usuario.nombre, 'success');
      return true;
    }), catchError(err => {
      swal.fire(err.error.mensaje, err.error.errors.message, 'error');
      return throwError(err);
    }));
  }
  cambiarImg(archivo: File, id: string) {
    this.uploadServ.subirArchivo(archivo, 'usuarios', id).then((resp: any) => {
      console.log(resp);
      this.usuario.img = resp.usuario.img;
      swal.fire('Imagen actualizada', this.usuario.nombre, 'success');
      this.guardarStorarge(id, this.token, this.usuario, this.menu);
    }).catch(resp => {
      console.log(resp);
    });
  }
  estaLogueado(): boolean {
    return (this.token.length > 5) ? true : false;
  }
  cargarUsuarios(desde: number = 0) {
    const url = `${ URL_SERVICIOS }/usuario?desde=${ desde }`;
    return this.http.get(url);
  }
  buscarUsuario(termino: string) {
    const url = `${ URL_SERVICIOS }/busqueda/coleccion/usuarios/${ termino }`;
    return this.http.get(url).pipe(map((resp: any) => resp.usuarios));
  }
  borrarUsuario(id: string) {
    const url = `${ URL_SERVICIOS }/usuario/${ id }?token=${ this.token }`;
    return this.http.delete(url).pipe(map(resp => {
      swal.fire('Borrado!', 'El usuario ha sido borrado correctamente', 'success');
      return true;
    }));
  }
}
