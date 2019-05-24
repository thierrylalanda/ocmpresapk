import { Injectable } from '@angular/core';
import { Broadcaster } from '@ionic-native/broadcaster/ngx';
@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private broadcaster: Broadcaster) { }

  sendEvents(){
    // Listen to events from Native
this.broadcaster.addEventListener('eventName').subscribe((event) => console.log(event));

// Send event to Native
this.broadcaster.fireNativeEvent('eventName', {}).then(() => console.log('success'));
  }
}
