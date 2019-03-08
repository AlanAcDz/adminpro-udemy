import { Component, OnInit } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import { HospitalService } from '../../services/index.services';
import swal from 'sweetalert2';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {
  desde = 0;
  totalRegistros = 0;
  cargando: boolean;
  hospitales: Hospital[] = [];
  constructor(
    public modalUploadServ: ModalUploadService,
    public hospitalServ: HospitalService
  ) { }

  ngOnInit() {
    this.hospitalServ.cargarToken();
    this.cargarHospitales();
    this.modalUploadServ.notificacion.subscribe(() => this.cargarHospitales());
  }
  cargarHospitales() {
    this.cargando = true;
    this.hospitalServ.cargarHospitales(this.desde).subscribe((resp: any) => {
      this.totalRegistros = resp.total;
      this.hospitales = resp.hospitales;
      this.cargando = false;
    });
  }
  crearHospital() {
    swal.fire({
      title: 'Crear hospital',
      text: 'Ingresa el nombre del nuevo hospital',
      input: 'text',
      showCancelButton: true,
      type: 'info'
    }).then(res => {
      if (res.value) {
        this.hospitalServ.crearHospital(res.value).subscribe(resp => {
          console.log(resp);
          swal.fire('Hospital creado', res.value + ' creado correctamente', 'success');
          this.cargarHospitales();
        });
      }
    });
  }
  buscarHospitales(termino: string) {
    if (termino.length <= 0) {
      this.cargarHospitales();
      return;
    }
    this.cargando = true;
    this.hospitalServ.buscarHospital(termino).subscribe((hospitales: Hospital[]) => {
      this.hospitales = hospitales;
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
    this.cargarHospitales();
  }
  guardarHospital(hospital: Hospital) {
    this.hospitalServ.actualizarHospital(hospital).subscribe(resp => console.log(resp));
  }
  borrarHospital(hospital: Hospital) {
    swal.fire({
      title: '¿Esta seguro?',
      text: 'Estas a punto de borrar al ' + hospital.nombre,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Borrar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.hospitalServ.borrarHospital(hospital._id).subscribe(resp => {
          console.log(resp);
          this.cargarHospitales();
        });
      }
    });
  }
  mostrarModal(id: string) {
    this.modalUploadServ.mostrarModal('hospitales', id);
  }
}
