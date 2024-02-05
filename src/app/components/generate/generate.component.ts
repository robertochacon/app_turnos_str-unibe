import { Component, OnInit } from '@angular/core';
import { TurnsService } from 'src/app/services/turns.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-generate',
  templateUrl: './generate.component.html',
  styleUrls: ['./generate.component.css']
})
export class GenerateComponent implements OnInit {

  constructor(private _turns: TurnsService) { }

  ngOnInit(): void {
  }

  save(): void {

    let datos = new FormData();
    // datos.append("service",this.serviceName);
    datos.append("code","");
    this._turns.setTurns(datos).subscribe((response)=>{

      Swal.fire({
        position: 'center',
        icon: 'info',
        title: 'Procesando...',
        text: 'Favor espera un momento.',
        showConfirmButton: false,
        timer: 2000
      });
      setTimeout(() => {

        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Su numero de turno es: TN-'+response.data.id,
          text: 'Favor tomar su ticket',
          showConfirmButton: false,
          timer: 5000
        });

      }, 2000);

    },error => {

      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Problemas tecnicos!',
        text: 'No se pudo completar el registro, favor intente nuevamente.',
        showConfirmButton: false,
        timer: 3000
      });

    })

  }

}
