import { Component, OnInit, Input } from "@angular/core";
import { PopoverController,ToastController, Events, AlertController } from "@ionic/angular";
import { PrinterService } from '../../shared/utile/printer.service';
import { CommandeService } from '../../service/commande/commande.service';
@Component({
  selector: "app-popmenu-edit-commande",
  template: "<ion-item (click)='printA4()'><ion-icon name='print' slot='start' color='primary'></ion-icon>Impression format A4</ion-item>"+
  "<ion-item (click)='Print()'><ion-icon name='print' slot='start' color='primary'></ion-icon>Impression petit format</ion-item>"
})
export class PopmenuPrinterComponent implements OnInit {
  @Input() commande;
  @Input() incident;
  ristourneTotal=0;
  constructor(
    public popCtrl: PopoverController,
    public toastCtrl: ToastController,
    public events: Events,
    public alertCtrl: AlertController,
    public printer: PrinterService,
    private cmdService: CommandeService
  ) {}

  ngOnInit() {
    if(this.commande){
this.cmdService.getAllRistourneClient(this.commande.client.id).subscribe(
  resp => {
    if(resp.ristourne){
      this.ristourneTotal=resp.ristourne;
    }
    
  }
);
    }
  }

  dismiss() {
    this.popCtrl.dismiss();
  }

  printA4() {

    this.popCtrl.dismiss();
    if(this.commande){
      this.printer.printwithPrinter(this.commande,this.ristourneTotal);
    }else {
      this.sendTaoster('aucune commande à imprimer');
    }
  }
 async Print() {
    this.popCtrl.dismiss();
    if(this.commande){
      this.printer.printDocumentBTPrinter(this.commande,this.ristourneTotal);
    }else {
      this.sendTaoster('aucune commande à imprimer');
    }
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
