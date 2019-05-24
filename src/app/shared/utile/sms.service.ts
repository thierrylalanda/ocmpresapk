import { Injectable } from '@angular/core';
import { SMS } from '@ionic-native/sms/ngx';

@Injectable({
  providedIn: 'root'
})
export class SmsService {

  constructor(private sms: SMS) { }

  public sendMessage() {
    // Send a text message using default options
this.sms.send('416123456', 'Hello world!');
  }
}
