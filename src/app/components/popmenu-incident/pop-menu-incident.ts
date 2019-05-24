import { Component, OnInit, Input } from "@angular/core";
import { PopoverController,ToastController, Events, AlertController } from "@ionic/angular";
import { PrinterService } from '../../shared/utile/printer.service';
import { CameraService } from '../../shared/utile/camera.service';
import { PopmenuPrinterComponent } from "../popmenu-printer/popmenu-printer.component";
@Component({
  selector: "app-popmenu-edit-commande",
  template: "<ion-item (click)='TakePicture()'><ion-icon name='camera' slot='start' color='primary'></ion-icon>Prendre une Image</ion-item>"+
  "<ion-item (click)='TakePictureGalery()'><ion-icon name='photos' slot='start' color='primary'></ion-icon>Charger une Image</ion-item>"+
  "<ion-item (click)='Print($event)'><ion-icon name='print' slot='start' color='primary'></ion-icon>Imprimer</ion-item>"
})
export class PopMenuIncidentComponent implements OnInit {
  @Input() commande;
  srcImage:any;
  @Input() incident;
  constructor(
    public popCtrl: PopoverController,
    public toastCtrl: ToastController,
    public events: Events,
    public alertCtrl: AlertController,
    public printer: PrinterService,
    public camera: CameraService
  ) {}

  ngOnInit() {}

  dismiss() {
    this.popCtrl.dismiss();
  }


  TakePicture() {
    this.popCtrl.dismiss();
    this.camera.TakePicture().then(imageData => {
      this.srcImage = imageData;
      this.events.publish('image:add',this.srcImage, Date.now());
    },err=>{
        this.sendTaoster(err);
    });
  }

  TakePictureGalery() {
    this.popCtrl.dismiss();
    this.camera.TakePictureToGallery().then(imageData => {
      this.srcImage = imageData;
      this.events.publish('image:add',this.srcImage, Date.now());
    },err=>{
        this.sendTaoster(err);
    });
  }
 async Print(ev) {
    this.popCtrl.dismiss();
    let cmd;
    if(!this.incident) {
      cmd=JSON.parse(localStorage.getItem('currentIncident'));
   }else {
     cmd=this.incident;
   }
   const popover = await this.popCtrl.create({
     component: PopmenuPrinterComponent,
      event: ev,
     animated: true,
     showBackdrop: true,
      translucent: true,
     componentProps: { incident: cmd }
   });
   return await popover.present();
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
