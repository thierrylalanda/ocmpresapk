import { Component, OnInit, Input } from "@angular/core";
import {
  NavController,
  PopoverController,
  AlertController,
  LoadingController,
  Events
} from "@ionic/angular";
import { PrinterService } from "../../shared/utile/printer.service";
import { SignatureComponent } from "../../components/signature/signature-component";
import { PopmenuPrinterComponent } from "../../components/popmenu-printer/popmenu-printer.component";
import { CommandeService } from "../../service/commande/commande.service";
@Component({
  selector: "popmenu-commande",
  templateUrl: "./popmenu-commande.component.html",
  styleUrls: ["./popmenu-commande.component.scss"]
})
export class PopmenuCommandeComponent implements OnInit {
  openMenu: Boolean = false;
  @Input() commande;
  loaderCmd: any;
  allTourners: any = [];
  societe: any;
  constructor(
    public navCtrl: NavController,
    public printer: PrinterService,
    public popCtrl: PopoverController,
    public alertCtrl: AlertController,
    private cmdService: CommandeService,
    public loadingCtrl: LoadingController,
    public events: Events
  ) {}

  ngOnInit() {
    if (localStorage.getItem("societe")) {
      this.societe = JSON.parse(localStorage.getItem("societe"));
    }
    if (localStorage.getItem("tourners")) {
      this.allTourners = JSON.parse(localStorage.getItem("tourners"));
    }
  }

  togglePopupMenu() {
    return (this.openMenu = !this.openMenu);
  }

  addProduct() {
    this.openMenu = false;
    if (this.commande) {
      this.navCtrl.navigateForward(["/commande/all-product"], {
        queryParams: { update: true }
      });
    } else {
      this.navCtrl.navigateForward("/commande/all-product");
    }
  }
  async addSignature() {
    this.openMenu = false;
    const that = this;
    const popover = await this.popCtrl.create({
      component: SignatureComponent,
      // event: ev,
      animated: true,
      showBackdrop: true,
      componentProps: {}
    });
    return await popover.present();
  }
  async printProduct() {
    this.togglePopupMenu();
    let cmd=[]
    if(!this.commande) {
       cmd=JSON.parse(localStorage.getItem('currentCommande'));
    }else {
      cmd=this.commande;
    }
    const popover = await this.popCtrl.create({
      component: PopmenuPrinterComponent,
      // event: ev,
      animated: true,
      showBackdrop: true,
      componentProps: { commande: cmd }
    });
    return await popover.present();
  }

  async ChargerClients() {
    this.togglePopupMenu();
    let tourners = [];
    if (this.allTourners.length !== 0) {
      tourners = this.allTourners.map(element => {
        return {
          name: "tourner",
          type: "radio",
          label: element.tourner.numc,
          value: element.tourner.id
        };
      });
    }

    let that = this;
    const alert = await this.alertCtrl.create({
      header: "Mes Tournées",
      inputs: tourners,
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {}
        },
        {
          text: "Ok",
          handler: data => {
            // that.Load('Chargement des clients');
            let clients;
            console.log(that.allTourners);
            that.allTourners.forEach(element => {
              if (element.tourner.id === parseInt(data)) {
                clients = element.tourner.tclientsList;
                localStorage.setItem("tourner", JSON.stringify( element.tourner));
              }
            });
            that.events.publish(
              "clients:chargement",
              clients,
              Date.now()
            );
          }
        }
      ]
    });

    await alert.present();
  }

  async Load(msg) {
    this.loaderCmd = await this.loadingCtrl.create({
      message: msg
    });
    return this.loaderCmd.present();
  }
}
