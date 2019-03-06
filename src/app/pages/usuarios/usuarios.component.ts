import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from '../../services/index.services';
import swal from 'sweetalert2';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  desde = 0;
  totalRegistros = 0;
  cargando: boolean;
  constructor(
    public usuarioServ: UsuarioService,
    public modalUploadServ: ModalUploadService
  ) {}

  ngOnInit() {
    this.cargarUsuarios();
    this.modalUploadServ.notificacion.subscribe(resp => this.cargarUsuarios());
  }
  cargarUsuarios() {
    this.cargando = true;
    this.usuarioServ.cargarUsuarios(this.desde).subscribe((resp: any) => {
      this.totalRegistros = resp.total;
      this.usuarios = resp.usuarios;
      this.cargando = false;
    });
  }
  cambiarDesde(valor: number) {
    const desde = this.desde + valor;
    if (desde >= this.totalRegistros) {
      return;
    }
    if (desde < 0) {
      return;
    }
    this.desde += valor;
    this.cargarUsuarios();
  }
  buscarUsuario(termino: string) {
    if (termino.length <= 0) {
      this.cargarUsuarios();
      return;
    }
    this.cargando = true;
    this.usuarioServ.buscarUsuario(termino).subscribe((usuarios: Usuario[]) => {
      this.usuarios = usuarios;
      this.cargando = false;
    });
  }
  borrarUsuario(usuario: Usuario) {
    if (usuario._id === this.usuarioServ.usuario._id) {
      swal.fire('No puede borrar usuario', 'No se puede borrar a si mismo', 'error');
      return;
    }
    swal.fire({
      title: '¿Esta seguro?',
      text: 'Estas a punto de borrar a ' + usuario.nombre,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Borrar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.usuarioServ.borrarUsuario(usuario._id).subscribe(resp => {
          console.log(resp);
          this.cargarUsuarios();
        });
      }
    });
  }
  guardarUsuario(usuario: Usuario) {
    this.usuarioServ.actualizarUsuario(usuario).subscribe();
  }
  mostrarModal(id: string) {
    this.modalUploadServ.mostrarModal('usuarios', id);
  }
}
