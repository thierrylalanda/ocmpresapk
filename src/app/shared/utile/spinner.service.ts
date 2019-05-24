import { Injectable } from '@angular/core';
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';
@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  constructor(private spinnerDialog: SpinnerDialog) { }

  show() {
    this.spinnerDialog.show();
  }

hide() {
  this.spinnerDialog.hide();
}

//documentation
doc() {
  // Show spinner dialog
  this.spinnerDialog.show();

// Show spinner dialog with message
// Note: spinner dialog is cancelable by default
this.spinnerDialog.show(null, "message");

// Set spinner dialog fixed
this.spinnerDialog.show(null, null, true);

// Set spinner dialog fixed with callback
// Note: callback fires on tap events and Android hardware back button click event
this.spinnerDialog.show(null, null, function () {console.log("callback");});

// Show spinner dialog with title and message (Android only)
this.spinnerDialog.show("title", "message");

// Set spinner dialog fixed (cannot be canceled with screen touch or Android hardware button)
this.spinnerDialog.show("title", "message", true);

// Overlay opacity and text color options (IOS only)
this.spinnerDialog.show(null,"Message",true, {overlayOpacity: 0.35,  textColorRed: 1, textColorGreen: 1, textColorBlue: 1}); 

// Change only overlay opacity (IOS only)
this.spinnerDialog.show(null,"Message",true,{overlayOpacity:0.70});

// Change only text color (IOS only)
this.spinnerDialog.show(null,"message",true, { textColorRed: 0.1, textColorGreen: 0.1, textColorBlue: 1});

// Hide spinner dialog
this.spinnerDialog.hide();
}
}
