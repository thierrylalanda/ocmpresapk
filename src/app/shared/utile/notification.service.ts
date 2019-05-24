import { Injectable } from '@angular/core';
import { PhonegapLocalNotification } from '@ionic-native/phonegap-local-notification/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(public localNotification: PhonegapLocalNotification,
    private vibration: Vibration) { }


  sendNotification(tag,title,body){
    this.localNotification.requestPermission().then(
      (permission) => {
        if (permission === 'granted') {
          this.vibration.vibrate([2000,1000,2000]);
          this.localNotification.create(title, {
            tag: tag,
            body: body,
            icon: 'assets/icon/ocm.ico',
            lang:"fr",
          });
        }
      }
    );
  }

}