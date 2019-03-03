import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardGuard implements CanActivate {
  constructor(
    public usuarioServ: UsuarioService,
    public router: Router
  ) {}
  canActivate() {
    if (this.usuarioServ.estaLogueado()) {
      console.log('PASO EL GUARD');
      return true;
    } else {
      console.log('Bloqueado por guard');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
