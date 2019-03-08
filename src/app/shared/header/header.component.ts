import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/index.services';
import { Usuario } from '../../models/usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {
  usuario: Usuario;
  constructor(public usuarioServ: UsuarioService, public router: Router) { }

  ngOnInit() {
    this.usuario = this.usuarioServ.usuario;
  }
  buscar(termino: string) {
    this.router.navigate(['/busqueda', termino]);
  }
}
