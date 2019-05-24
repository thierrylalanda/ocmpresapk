import { Component, OnInit, Input,ViewChild  } from "@angular/core";
import { PopoverController,ToastController, Events } from "@ionic/angular";
import { CommandeService } from "../../service/commande/commande.service";
import { SignaturePad } from 'angular2-signaturepad/signature-pad';

@Component({
  selector: "signature",
  templateUrl: "./signature-component.html",
  styleUrls: ["./signature-component.scss"]
})
export class SignatureComponent implements OnInit {
  @Input() lastsignature;
  signature = '';
  isDrawing = false;
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  public signaturePadOptions: Object = { // Check out https://github.com/szimek/signature_pad
    'minWidth': 2,
    'canvasWidth': 400,
    'canvasHeight': 200,
    'backgroundColor': '#f6fbff',
    'penColor': '#666a73'
  };
  constructor(
    public popCtrl: PopoverController,
    private cmdService: CommandeService,
    public toastCtrl: ToastController,
    public events: Events
  ) {}

  ngOnInit() {
  //  this.signaturePad.clear();
   if(localStorage.getItem('signature')) {
       this.signature = localStorage.getItem('signature');
   }
  }

  dismiss() {
    this.popCtrl.dismiss();
  }

  drawComplete() {
    this.isDrawing = false;
  }
 
  drawStart() {
    this.isDrawing = true;
  }
 
  savePad() {
    this.signature = this.signaturePad.toDataURL();
    localStorage.setItem('signature',this.signature);
    this.signaturePad.clear();
    this.events.publish('signature:add',this.signature,Date.now());
    this.sendTaoster('signature ajoutée');
    this.popCtrl.dismiss();
  }
 
  clearPad() {
    this.signaturePad.clear();
    this.events.publish('signature:cancel',this.signature,Date.now());
    this.popCtrl.dismiss();
  }

  cancelPad() {
      this.popCtrl.dismiss();
  }

  async sendTaoster(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top',
      closeButtonText: 'OK',
      showCloseButton: true
    });
    return toast.present();
  }
}
