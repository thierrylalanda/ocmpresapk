import { Component, OnInit, Input } from "@angular/core";
import { PopoverController,ToastController, Events } from "@ionic/angular";
import { CommandeService } from "../../service/commande/commande.service";
import { PopmenuPrinterComponent } from "../popmenu-printer/popmenu-printer.component";
@Component({
  selector: "app-popmenu-edit-commande",
  templateUrl: "./popmenu-edit-commande.component.html",
  styleUrls: ["./popmenu-edit-commande.component.scss"]
})
export class PopmenuEditCommandeComponent implements OnInit {
  @Input() commande;
  code : any;
  constructor(
    public popCtrl: PopoverController,
    private cmdService: CommandeService,
    public toastCtrl: ToastController,
    public events: Events
  ) {}

  ngOnInit() {
    this.code=JSON.parse(localStorage.getItem('code'));
  }

  dismiss() {
    this.popCtrl.dismiss();
  }

  validerCommande() {
    let that=this;
    if (this.commande) {
      if(this.commande.etatc.code === 501 || this.commande.etatc.code === 501) {
        this.cmdService.validerCommande({id:this.commande.id}).subscribe(
          resp=> {
            if(resp instanceof Array && resp.length ===0) {
              this.sendTaoster('Commande non validée veuillez réessayer');
            } else {
              this.sendTaoster('Commande validée avec succès');
              this.commande.etatc.code= 201;
              if(resp.ligne) {
                that.events.publish('shop:update',resp.Ligne,Date.now());
              }
            }
          }
        );
      }
    }
    this.popCtrl.dismiss();
  }
  cloturerCommande() {
    let that=this;
    if (this.commande) {
      if(this.commande.etatc.code === 201) {
        this.cmdService.cloturerCommande({id:this.commande.id}).subscribe(
          resp=> {
            if(resp instanceof Array && resp.length ===0) {
              this.sendTaoster('Commande non clôturée veuillez réessayer');
            } else {
              this.sendTaoster('Commande clôturée avec succès');
              if(resp.ligne) {
                that.events.publish('shop:update',resp.Ligne,Date.now());
              }
            }
          }
        );
      }
    }
    this.popCtrl.dismiss();
  }

 async printCommande(ev) {
  this.popCtrl.dismiss();
    const popover = await this.popCtrl.create({
      component: PopmenuPrinterComponent,
     event: ev,
      animated: true,
      showBackdrop: true,
      translucent: true,
      componentProps: {commande:this.commande }
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
