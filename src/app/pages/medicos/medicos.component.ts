import { Component, OnInit } from '@angular/core';
import { Medico } from '../../models/medico.model';
import { MedicoService } from '../../services/index.services';
import swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {
  cargando: boolean;
  desde = 0;
  medicos: Medico[] = [];
  constructor(
    public medicoServ: MedicoService
  ) { }

  ngOnInit() {
    this.cargarMedicos();
  }
  cargarMedicos() {
    this.medicoServ.cargarMedicos(this.desde).subscribe(
      (medicos: Medico[]) => this.medicos = medicos
    );
  }
  cambiarDesde(valor: number) {
    const desde = this.desde + valor;
    if (desde >= this.medicoServ.totalMedicos) {
      return;
    }
    if (desde < 0) {
      return;
    }
    this.desde += valor;
    this.cargarMedicos();
  }
  buscarMedico(termino: string) {
    if (termino.length <= 0) {
      this.cargarMedicos();
      return;
    }
    this.medicoServ.buscarMedicos(termino).subscribe(
      (medicos: Medico[]) => this.medicos = medicos
    );
  }
  borrarMedico(medico: Medico) {
    swal.fire({
      title: '¿Esta seguro?',
      text: 'Estas a punto de borrar al ' + medico.nombre,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Borrar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.medicoServ.borrarMedico(medico._id).subscribe(resp => {
          console.log(resp);
          this.cargarMedicos();
        });
      }
    });
  }
}
