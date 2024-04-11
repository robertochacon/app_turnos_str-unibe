import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  url = '';
  enviroment = 'dev';

  constructor() {
    if(this.enviroment == 'dev'){
      // this.url = 'http://149.50.129.59'; //production
      this.url = 'http://127.0.0.1:8000';
    }
  }

  getUrl(params: any): string{
    return this.url+'/api/'+params;
  }

  getUrlForDocument(params: any): string{
    return this.url+'/storage/'+params;
  }

}
