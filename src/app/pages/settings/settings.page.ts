import { Component, OnInit } from "@angular/core";
import { NavController, MenuController, ToastController, AlertController, LoadingController, Events } from '@ionic/angular';
import { SynchronisationService } from '../../service/synchronisation/synchronisation';
import { MapDataService } from '../../service/map.data.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: "app-settings",
  templateUrl: "./settings.page.html",
  styleUrls: ["./settings.page.scss"]
})
export class SettingsPage implements OnInit {
  lang: any;
  enableNotifications: any;
  paymentMethod: any;
  currency: any;
  enablePromo: any;
  enableHistory: any;

  languages: any = [{nom:'English',code:'en'},{nom:'Français',code:'fr'}];
  synchronisation: any = [{nom:"Journalier",temps:24*60*60*1000},{nom:"Hebdomadaire",temps:7*24*60*60*1000},{nom:"Mensuel",temps:30*24*60*60*1000}];
  user: any;
  societe;
  parametre;
  allTourners;
  constructor(public navCtrl: NavController,
    public menuCtrl: MenuController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private synchro: SynchronisationService,
    private mapper: MapDataService,
    private _translate: TranslateService,
    public events: Events) {}

  ngOnInit() {
    if (localStorage.getItem("user")) {
      this.user = JSON.parse(localStorage.getItem("user"));
    }
    if (localStorage.getItem("societe")) {
      this.societe = JSON.parse(localStorage.getItem("societe"));
      if (localStorage.getItem("tourners")) {
        this.allTourners = JSON.parse(localStorage.getItem("tourners"));
      }
    }

    if(localStorage.getItem("parametre")) {
      this.parametre=JSON.parse(localStorage.getItem("parametre"));
      this.lang=this.parametre.langue;
         this._translate.use(this.parametre.langue.code);
          }else {
            this._translate.use('fr');
          }
  }

  editProfile() {
    this.navCtrl.navigateForward("edit-profile");
  }

  logout() {
    localStorage.clear();
    this.navCtrl.navigateRoot("/");
  }
  changeLanguage(langue) {
    this._translate.use(langue.code);
    this.parametre.langue=langue;
    localStorage.setItem("parametre",JSON.stringify(this.parametre));
    this.events.publish('parametre:update',this.parametre,Date.now());
    
  }
  async ChargerClients() {
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
    } else {
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
  async Synchronisation () {
    let loading = await this.loadingCtrl.create({
      message: 'Synchronisation encours ...'
    });
    loading.present();
    this.synchro.updateSociete(this.societe).subscribe(
      resp => {
        if(resp instanceof Array && resp.length === 0) {
          loading.dismiss();
          this.sendTaoster('Echec Synchronisation');
        } else {
          if(resp.Societe) {
            localStorage.setItem('societe',JSON.stringify(resp.Societe));
            if(resp.Societe.tcategorieList) {
             let mapUser = this.mapper.mapCategorie(resp.Societe.tcategorieList);
              localStorage.setItem('article',JSON.stringify(mapUser));
            }
            if(resp.Societe.tclientsList) {
             localStorage.setItem('clients',JSON.stringify(resp.Societe.tclientsList));
            }
          }
          loading.dismiss();
          this.sendTaoster('Synchronisation effectuée avec succès');
        }
      }
    );
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
}
