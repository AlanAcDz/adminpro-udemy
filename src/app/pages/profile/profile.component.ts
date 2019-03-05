import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/index.services';
import swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {
  usuario: Usuario;
  imagenSubir: File;
  imagenTemp: string;
  constructor(public usuarioServ: UsuarioService) {
    this.usuario = usuarioServ.usuario;
  }
  ngOnInit() {}
  guardar(usuario: Usuario) {
    if (!this.usuario.google) {
      this.usuario.email = usuario.email;
    }
    this.usuario.nombre = usuario.nombre;
    this.usuarioServ.actualizarUsuario(this.usuario).subscribe();
  }
  seleccionImg(archivo: File) {
    if (!archivo) {
      this.imagenSubir = null;
      return;
    }
    if (archivo.type.indexOf('image') < 0) {
      swal.fire('Solo imagenes', 'El archivo seleccionado no es una imagen', 'error');
      this.imagenSubir = null;
      return;
    }
    this.imagenSubir = archivo;
    const reader = new FileReader();
    const urlImgTemp = reader.readAsDataURL(archivo);
    reader.onloadend = () => this.imagenTemp = reader.result.toString();
  }
  cambiarImg() {
    this.usuarioServ.cambiarImg(this.imagenSubir, this.usuario._id);
  }
}
