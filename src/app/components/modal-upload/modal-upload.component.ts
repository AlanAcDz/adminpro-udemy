import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { SubirArchivoService } from '../../services/subir-archivo/subir-archivo.service';
import { ModalUploadService } from './modal-upload.service';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {
  imagenSubir: File;
  imagenTemp: string;
  constructor(
    public uploadServ: SubirArchivoService,
    public modalUploadServ: ModalUploadService
  ) { }

  ngOnInit() {}
  seleccionImg(archivo: File) {
    if (!archivo) {
      this.imagenSubir = null;
      return;
    }
    if (archivo.type.indexOf('image') < 0) {
      swal.fire('Solo imagenes', 'El archivo seleccionado no es una imagen', 'error');
      this.imagenSubir = null;
      return;
    }
    this.imagenSubir = archivo;
    const reader = new FileReader();
    const urlImgTemp = reader.readAsDataURL(archivo);
    reader.onloadend = () => this.imagenTemp = reader.result.toString();
  }
  subirImagen() {
    this.uploadServ.subirArchivo(this.imagenSubir, this.modalUploadServ.tipo, this.modalUploadServ.id).then(resp => {
      this.modalUploadServ.notificacion.emit(resp);
      this.cerrarModal();
    }).catch(err => {
      console.log('Error en la carga');
    });
  }
  cerrarModal() {
    this.imagenSubir = null;
    this.imagenTemp = null;
    this.modalUploadServ.ocultarModal();
  }
}
