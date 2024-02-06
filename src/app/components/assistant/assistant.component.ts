import { Component, OnInit } from '@angular/core';
import { TurnsService } from 'src/app/services/turns.service';
import Echo from 'laravel-echo';

@Component({
  selector: 'app-assistant',
  templateUrl: './assistant.component.html',
  styleUrls: ['./assistant.component.css']
})
export class AssistantComponent implements OnInit {

  listTurns: any[] = [];

  constructor(private _turns: TurnsService) { }

  ngOnInit(): void {
    this.getAllTurns();
    this.websockets();
  }

  getAllTurns(){

    this._turns.getAllTurns().subscribe((response)=>{

      this.listTurns = response.data;
      this.listTurns = this.listTurns.filter((item: { status: string; }) => item.status == 'wait');

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
      wsHost: window.location.hostname,
      forceTLS: false,
      wsPort: 6001,
      enabledTransports: ['ws']
    }

    const echo = new Echo(config);
    echo.channel('channel-turns').listen('UpdateTurns', (resp:any) => {

      this.getAllTurns();
      console.log(resp.msg);

    // if(this.notification == 'voice'){
    //   if(resp.msg.action === 'call_turn'){
    //     this.voiceTurn('0'+resp.msg.turn);
    //   }else if(resp.msg.action === 'call_patient'){
    //     this.voicePatient(resp.msg.patient);
    //   }
    // }

    });

  }

}
