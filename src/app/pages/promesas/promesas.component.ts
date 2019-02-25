import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: []
})
export class PromesasComponent implements OnInit {

  constructor() {
    this.contarA3().then(mensaje => console.log('Termino!', mensaje))
           .catch(error => console.error('Error en la promesa', error));
  }

  ngOnInit() {
  }
  contarA3(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let contador = 0;
      const interval = setInterval(() => {
        contador ++;
        console.log(contador);
        if (contador === 3) {
          resolve(true);
          // reject(false);
          clearInterval(interval);
        }
      }, 1000);
    });
  }
}
