import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    public usuarioServ: UsuarioService,
    public router: Router
  ) {}
  canActivate() {
    if (this.usuarioServ.usuario.role === 'ADMIN_ROLE') {
      return true;
    } else {
      this.router.navigate(['/login']);
      this.usuarioServ.logout();
      return false;
    }
  }
}
