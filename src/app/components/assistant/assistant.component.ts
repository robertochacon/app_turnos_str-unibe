import { Component, OnInit } from '@angular/core';
import { TurnsService } from 'src/app/services/turns.service';
import Echo from 'laravel-echo';
import Swal from 'sweetalert2'
import { log } from 'console';

@Component({
  selector: 'app-assistant',
  templateUrl: './assistant.component.html',
  styleUrls: ['./assistant.component.css']
})
export class AssistantComponent implements OnInit {

  action: any = 'start';
  window: any = '';
  listTurns: any[] = [];

  constructor(private _turns: TurnsService) { }

  ngOnInit(): void {
    if (this.validateWindow() != null) {
      this.action = 'listTurns';
    }
    this.getAllTurns();
    this.websockets();
  }

  start(){
    localStorage.setItem('window', this.window);
    this.action = 'listTurns';
  }

  validateWindow(){
    return localStorage.getItem('window');
  }

  end(){
    localStorage.clear();
    this.action = 'start';
    this.window = '';
  }

  async getAllTurns(){

    await this._turns.getAllTurns().subscribe((response)=>{

      this.listTurns = response.data;
      this.listTurns = this.listTurns.filter((item: { status: string; }) => item.status == 'wait' || item.status == 'call' );

      setTimeout(function(){
        console.log(response.data);
      },100);

    }, error=>{
      console.log(error);
    })

  }

  websockets(){

    let config;

    config = {
      broadcaster: 'pusher',
      cluster: 'mt1',
      key: 'RCA090698',
      // wsHost: '149.50.129.59', //producction
      wsHost: window.location.hostname,
      forceTLS: false,
      wsPort: 6001,
      enabledTransports: ['ws']
    }

    const echo = new Echo(config);
    echo.channel('channel-turns').listen('EventTurn', (resp:any) => {

      this.getAllTurns();
      console.log(resp.msg);

    });

  }

  async callTurn(id: any){
    let datos = new FormData();
    datos.append("status","call");
    datos.append("window",this.validateWindow() || '');
    await this._turns.updateTurns(id, datos).subscribe((response)=>{
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Llamando turno',
        showConfirmButton: false,
        timer: 1000
      });
    },error => {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Problemas tecnicos!',
        text: 'No se pudo completar la ejecucion, favor intente nuevamente.',
        showConfirmButton: false,
        timer: 2000
      });
    })
  }

  async toWaitTurn(id: any){
    let datos = new FormData();
    datos.append("status","wait");
    await this._turns.updateTurns(id, datos).subscribe((response)=>{
      Swal.fire({
        position: 'center',
        icon: 'info',
        title: 'Puesto en espera',
        showConfirmButton: false,
        timer: 1000
      });
    },error => {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Problemas tecnicos!',
        text: 'No se pudo completar la ejecucion, favor intente nuevamente.',
        showConfirmButton: false,
        timer: 2000
      });
    })
  }

  async deleteTurn(id: any){
    await this._turns.deleteTurns(id).subscribe((response)=>{
      this.getAllTurns();
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Turno eliminado.',
        showConfirmButton: false,
        timer: 2000
      });
    },error => {})
  }

  colorStatus(status:any){
    if(status=='call'){
      return 'primary';
    }else{
      return 'warning';
    }
  }

}
