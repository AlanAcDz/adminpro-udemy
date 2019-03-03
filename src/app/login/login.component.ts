import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/usuario/usuario.service';
import { Usuario } from '../models/usuario.model';

declare function init_plugins();
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  recuerdame = false;
  email: string;
  auth2: any;
  constructor(private router: Router, public usuarioServ: UsuarioService) {}
  ngOnInit() {
    init_plugins();
    this.googleInit();
    this.email = localStorage.getItem('email') || '';
    if (this.email.length > 1) {
      this.recuerdame = true;
    }
  }
  googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '802826238269-mklppsinja8d1e2i3n5afni5h46pack6.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });
      this.attachSignIn(document.getElementById('btnGoogle'));
    });
  }
  attachSignIn(element) {
    this.auth2.attachClickHandler(element, {}, gUser => {
      // const profile = gUser.getBasicProfile();
      const token = gUser.getAuthResponse().id_token;
      // console.log(profile);
      console.log(token);
      this.usuarioServ.signinGoogle(token).subscribe(() => {
        window.location.href = '#/dashboard';
      });
    });
  }
  ingresar(forma: NgForm) {
    if (forma.invalid) {
      return;
    }
    const usuario = new Usuario(
      null,
      forma.value.email,
      forma.value.password
    );
    this.usuarioServ.login(usuario, forma.value.recuerdame).subscribe(() => {
      this.router.navigate(['/dashboard']);
    });
  }
}
