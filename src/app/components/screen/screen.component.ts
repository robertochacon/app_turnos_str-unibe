import { Component, OnInit } from '@angular/core';
import { TurnsService } from 'src/app/services/turns.service';
import Echo from 'laravel-echo';

@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.css']
})
export class ScreenComponent implements OnInit {

  listTurns: any[] = [];

  constructor(private _turns: TurnsService) { }

  ngOnInit(): void {
    this.getAllTurns();
    this.websockets();
  }

  getAllTurns(){

    this._turns.getAllTurns().subscribe((response)=>{

      this.listTurns = response.data;
      this.listTurns = this.listTurns.filter((item: { status: string; }) => item.status == 'call');

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
    echo.channel('channel-turns').listen('EventTurn', (resp:any) => {

      this.getAllTurns();
      console.log(resp.msg);

      // if(resp.msg.action === 'call'){
      //   this.voiceTurn(resp.msg.turn);
      // }

    });

  }

  voiceTurn(msg:any){

    let synth = window.speechSynthesis
    let text = "Turno "+msg;
    let utterThis = new SpeechSynthesisUtterance(text)
    utterThis.lang = 'es-ES';
    synth.speak(utterThis)

    setTimeout(()=>{
      let utterThis = new SpeechSynthesisUtterance('Requiere atencion');
      utterThis.lang = 'es-ES';
      synth.speak(utterThis);
    },1000);

  }

}
