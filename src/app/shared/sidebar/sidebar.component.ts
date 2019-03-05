import { Component, OnInit } from '@angular/core';
import { SidebarService, UsuarioService } from '../../services/index.services';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {
  usuario: Usuario;
  constructor(
    public sidebarServ: SidebarService,
    public usuarioServ: UsuarioService
  ) { }

  ngOnInit() {
    this.usuario = this.usuarioServ.usuario;
  }

}
