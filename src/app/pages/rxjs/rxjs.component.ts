import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { retry, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnDestroy {
  subscription: Subscription;
  constructor() {
    this.subscription = this.regresaObservable().subscribe(
      // Callback de next
      numero => console.log('Subs: ', numero),
      // Callback de error
      error => console.error('Error en el obs', error),
      // callback de complete
      () => console.log('Observador completado!')
    );
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  regresaObservable(): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      const salida = {
        valor: 0
      };
      const interval = setInterval(() => {
        salida.valor ++;
        observer.next(salida);
        // if (salida.valor === 3) {
        //   clearInterval(interval);
        //   observer.complete();
        // }
        // if (contador === 2) {
        //   clearInterval(interval);
        //   observer.error('Auxilio!');
        // }
      }, 1000);
    }).pipe(
      retry(2),
      map(resp => resp.valor),
      filter((valor, index) => {
        // console.log('Filter', valor, index);
        if ((valor % 2) === 1) {
          return true;
        } else {
          return false;
        }
      })
    );
  }
}
