import { Injectable } from '@angular/core';
import { Vibration } from '@ionic-native/vibration/ngx';

@Injectable({
  providedIn: 'root'
})
export class VibrationService {

  constructor(private vibration: Vibration) { }

  // Vibrate the device for a second
// Duration is ignored on iOS.
public vibrate() {
  this.vibration.vibrate(1000);

  // Vibrate 2 seconds
  // Pause for 1 second
  // Vibrate for 2 seconds
  // Patterns work on Android and Windows only
  this.vibration.vibrate([2000,1000,2000]);
  // Stop any current vibrations immediately
  // Works on Android and Windows only
  this.vibration.vibrate(0);
}

}
