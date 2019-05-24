import { Component, OnInit } from '@angular/core';
import { IncidentService } from '../../../service/incident/incident.service';
import { AlertController, Platform, ActionSheetController, ModalController, Events } from '@ionic/angular';
import { IncidentTraitementService } from '../../../service/incident/incident-traitement.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IonicSelectableComponent } from "ionic-selectable";
import { VoirIncidentPage } from '../voir-incident/voir-incident.page';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-all-incident',
  templateUrl: './all-incident.page.html',
  styleUrls: ['./all-incident.page.scss'],
})
export class AllIncidentPage implements OnInit {
  allIncident:any;
  filterIncident:any;
  societe:any;
  etats:any;
  incidentSelected:any;
  indexSelected:any;
  active:any;
  user;
  clients;
  tourner;
  cclient;
  constructor(private incidentP:IncidentService,
    public alertCtrl: AlertController,
    public platform:Platform,
    private router:Router,
    private route: ActivatedRoute,
    public modalController: ModalController,
    public actionSheetCtrl: ActionSheetController,
    public events: Events,
    private _translate: TranslateService,
    public incidentT:IncidentTraitementService) {
      if (this.route.snapshot.queryParams.active) {
        this.active =JSON.parse( this.route.snapshot.queryParams.active);
      }
      let that =this;
      this.events.subscribe("incident:update", (incident, time) => {
        let index = that.allIncident.findIndex(elt=> {
          return elt.id ===incident.id;
        });
        if(index) {
            if(that.active=== [501] || that.active=== [501,502]) {
                 that.allIncident.splice(index,1);
            } else {
            that.allIncident[index]=incident;
          }
        }
        
      });
    this.init();
    this.initClient();
  }

  ngOnInit() {
  }
  initClient() {
    if (this.societe.gesttourner === 0) {
      this.clients = JSON.parse(localStorage.getItem("clients"));
    } else{
      if(localStorage.getItem("tourner")) {
        this.tourner=JSON.parse(localStorage.getItem("tourner"));
        this.clients = this.tourner.tclientsList;
      }
     }
  }
init() {
if(localStorage.getItem('societe')) {
  this.societe=JSON.parse(localStorage.getItem('societe'));
  this.user=JSON.parse(localStorage.getItem('user'));
  if (localStorage.getItem("parametre")) {
    const param = JSON.parse(localStorage.getItem("parametre"));
    this._translate.use(param.langue.code);
  } else {
    this._translate.use("fr");
  }
 /*  this.incidentP.getAllIncident(this.user.id).subscribe(
    resp=> {
      if(resp instanceof Array && resp.length ===0) {

      } else {
        this.allIncident=resp.incident;
        this.filterIncident=this.allIncident;
      }
    }
  ); */
  if(localStorage.getItem('etati')) {
    this.etats=JSON.parse(localStorage.getItem('etati'));
  }
}
}
refreshClient() {
  this.init();
}
chargerIncidentsClient(event: { component: IonicSelectableComponent; value: any }) {
 let cl=event.value;
 this.cclient=cl;
  this.incidentP.getIncident(cl.id).subscribe(
    resp=> {
      if(resp instanceof Array && resp.length ===0) {

      } else {
        this.allIncident=resp.incident;
        this.filterIncident=this.allIncident;
      }
    }
  );
}
  showMore(incident,index) {
    this.incidentSelected=incident;
    this.indexSelected=index;
    if(this.incidentSelected.state.code ===501) {
      this.MenuIncidentEncours();
    } else if(this.incidentSelected.state.code ===502) {
      this.MenuIncidentReponse();
    } else {
      this.MenuIncidentOder();
    }
  }
 async delete() {
  const alert = await this.alertCtrl.create({
    header: 'Confirmation!',
    message: 'vous êtes sur le point de  <strong>supprimer</strong> un Incident!!!',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
        }
      }, {
        text: 'Ok',
        handler: () => {
          this.incidentP.Delete(this.incidentSelected.id).subscribe(
            resp => {
              if( resp instanceof Array && resp.length ===0){

              } else {
                this.allIncident.splice(this.indexSelected,1);
              }
            }
          );
        }
      }
    ]
  });
  await alert.present();
  }
 async viewDetails(){
    const that=this;
     const modalView = await this.modalController.create({
      component: VoirIncidentPage,
      animated: true,
      showBackdrop: true,
      componentProps: { incident : that.incidentSelected,client : that.cclient}
    });
    return await modalView.present();
  }
  update(){
     this.router.navigate(['/incident/edit-incident'], { queryParams: { client:JSON.stringify(this.cclient),incident: JSON.stringify(this.incidentSelected)} });
    
  }
  repondre(){
    this.incidentT.repondreIncident(this.incidentSelected);
  }
  
  fermer() {
    this.incidentT.fermerIncident(this.incidentSelected);
  }
  async MenuIncidentEncours() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: "Incident",
      cssClass: "action-sheets-basic-page",
      buttons: [
        {
          text: "Plus de détails",
          icon: !this.platform.is("ios") ? "information" : null,
          handler: () => {
            this.viewDetails();
            }
        },
        {
          text: "Modifier",
          icon: !this.platform.is("ios") ? "create" : null,
          handler: () => {
            this.update();
           }
        },
        {
          text: "Répondre",
          icon: !this.platform.is("ios") ? "text" : null,
          handler: () => {
            this.repondre();
           }
        },
        {
          text: "Supprimer",
          icon: !this.platform.is("ios") ? "trash" : null,
          handler: () => {
            this.delete();
           }
        },
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {}
        }
      ]
    });
    actionSheet.present();
  }
  async MenuIncidentReponse() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: "Incident",
      cssClass: "action-sheets-basic-page",
      buttons: [
        {
          text: "Plus de détails",
          icon: !this.platform.is("ios") ? "information" : null,
          handler: () => {
            this.viewDetails();
            }
        },
        {
          text: "Fermer",
          icon: !this.platform.is("ios") ? "text" : null,
          handler: () => {
            this.fermer();
           }
        },
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {}
        }
      ]
    });
    actionSheet.present();
  }
  async MenuIncidentOder() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: "Incident",
      cssClass: "action-sheets-basic-page",
      buttons: [
        {
          text: "Plus de détails",
          icon: !this.platform.is("ios") ? "information" : null,
          handler: () => {
            this.viewDetails();
            }
        },
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {}
        }
      ]
    });
    actionSheet.present();
  }
  FilterList(event) {
    const value=event.detail.value;
    if(value.length !== 0) {
      this.allIncident=this.filterIncident.filter(inc=>value.includes(inc.state.code));
    } else {
      this.allIncident=this.filterIncident;
    }
  }
  async searchFilter () {
    /* const that=this;
    this.modalFilter = await this.modalController.create({
      component: SearchFilterPage,
      animated: true,
      showBackdrop: true,
      componentProps: { filter : that.filterCommande,allProducts: that.allCommande }
    });
    this.modalFilter.onDidDismiss().then(
      result=> {
        if(result.data) {
          this.allCommande=result.data.result;
          this.filterList=result.data.result;
        }
      }
    );
    return await this.modalFilter.present(); */
  }
}
