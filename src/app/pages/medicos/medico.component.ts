import { Component, OnInit } from '@angular/core';
import { MedicoService, HospitalService } from '../../services/index.services';
import { NgForm } from '@angular/forms';
import { Hospital } from '../../models/hospital.model';
import { Medico } from '../../models/medico.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit {
  hospitales: Hospital[] = [];
  medico: Medico = new Medico('', '', '', '', '');
  hospital: Hospital = new Hospital('');
  constructor(
    public medicoServ: MedicoService,
    public hospitalServ: HospitalService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public modalUploadServ: ModalUploadService
  ) {
    activatedRoute.params.subscribe(params => {
// tslint:disable-next-line: no-string-literal
      const id = params['id'];
      if (id !== 'nuevo') {
        this.cargarMedico(id);
      }
    });
  }
  ngOnInit() {
    this.medicoServ.cargarToken();
    this.hospitalServ.cargarHospitales().subscribe(
      (resp: any) => this.hospitales = resp.hospitales
    );
    this.modalUploadServ.notificacion.subscribe((resp: any) => {
      this.medico.img = resp.medico.img;
    });
  }
  cargarMedico(id: string) {
    this.medicoServ.cargarMedico(id).subscribe((medico: Medico) => {
      this.medico = medico;
// tslint:disable-next-line: no-string-literal
      this.medico.hospital = medico.hospital['_id'];
      this.cambioHospital(this.medico.hospital);
    });
  }
  guardarMedico(f: NgForm) {
    if (f.invalid) {
      return;
    }
    this.medicoServ.guardarMedico(this.medico).subscribe((medico: Medico) => {
      this.medico._id = medico._id;
      this.router.navigate(['/medico', medico._id]);
    });
  }
  cambioHospital(id: string) {
    this.hospitalServ.obtenerHospital(id).subscribe(
      (hospital: Hospital) => this.hospital = hospital
    );
  }
  cambiarFoto() {
    this.modalUploadServ.mostrarModal('medicos', this.medico._id);
  }
}
