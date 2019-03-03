import { Component, OnInit } from '@angular/core';
import { SidebarService, UsuarioService } from '../../services/index.services';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {

  constructor(public sidebarServ: SidebarService, public usuarioServ: UsuarioService) { }

  ngOnInit() {
  }

}
