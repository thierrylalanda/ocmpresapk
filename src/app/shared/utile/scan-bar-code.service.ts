import { Injectable } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ToastController, AlertController, NavController, ModalController } from '@ionic/angular';
import { CommandeService } from '../../service/commande/commande.service';
import { Router } from '@angular/router';
import { VoirCommandePage } from '../../pages/commande/voir-commande/voir-commande.page';

@Injectable({
    providedIn: 'root'
  })
  export class ScanBarCodeService {
    modalView:any;
constructor(private barcodeScanner: BarcodeScanner,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private cmdService: CommandeService,
    public navCtrl: NavController,
    public modalController: ModalController,
    private router:Router) { }

scanBar() {
    let that=this;
    this.barcodeScanner.scan().then(barcodeData => {
        if(barcodeData.text){
const result=JSON.parse(barcodeData.text);

if(result.type && result.type ==='commande'){
this.cmdService.getOneCommande(atob(result.id)).subscribe(
  resp=>{
    if(resp instanceof Array  && resp.length === 0){
    }else {
       if(resp.Ligne){
        this.router.navigate(['/commande/edit-commande'], { queryParams: { commande: JSON.stringify(resp.Ligne)} });
       }
    }
  },
  err=>{

  }
);
}
        }
}).catch(err => {
  console.log(err);
    that.sendTaoster('erreur lors du scan');
});
}
async showDetails(commande) {
  const that=this;
   this.modalView = await this.modalController.create({
    component: VoirCommandePage,
    animated: true,
    showBackdrop: true,
    componentProps: { commande : commande}
  });
  return await this.modalView.present();
}
async sendTaoster(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: "top",
      closeButtonText: "OK",
      showCloseButton: true
    });
    return toast.present();
  }

  async presentAlert(msg) {
     let that=this;
    const alert = await this.alertCtrl.create({
      header: "Result ",
      message: msg,
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
           }
        }
      ]
    });

    await alert.present();
  }
}