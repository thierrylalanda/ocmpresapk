import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IonicSelectableComponent } from "ionic-selectable";
import { TranslateService } from "@ngx-translate/core";
import { DateProvider } from "../../../service/date";
import { Incident } from "../../../models/incident";
import { PopMenuIncidentComponent } from "../../../components/popmenu-incident/pop-menu-incident";
import { IncidentService } from "../../../service/incident/incident.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  NavController,
  MenuController,
  ToastController,
  AlertController,
  LoadingController,
  Events,
  ModalController,
  PopoverController
} from "@ionic/angular";

@Component({
  selector: "app-add-incident",
  templateUrl: "./add-incident.page.html",
  styleUrls: ["./add-incident.page.scss"]
})
export class AddIncidentPage implements OnInit {
  client: any;
  year = new Date().getFullYear();
  loaderCmd: any;
  clients = [];
  date =
    new Date().getFullYear() +
    "-" +
    new Date().getMonth() +
    "-" +
    new Date().getDate();
  date_incident: any = this.date;
  photo: any;
  customPopoverOptions: any = {
    header: "Clients"
  };
  allTourners;
  societe;
  user;
  incidentToEdit;
  Incident = new Incident();
  srubriques: any;
  srubrique: any;
  rubriques: any;
  rubrique: any;
  sources: any;
  source: any;
  title: any;
  description: any;
  isUpdate: boolean = false;
  public incidentForm: FormGroup;
  constructor(
    public menuCtrl: MenuController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public events: Events,
    public modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    public popCtrl: PopoverController,
    public dateP: DateProvider,
    private _translate: TranslateService,
    private incidentP: IncidentService
  ) {
    let that = this;
    this.events.subscribe("image:add", (photo, time) => {
      that.photo = photo;
    });
  }

  ngOnInit() {
    this.incidentForm = this.formBuilder.group({
      client: [null, Validators.compose([Validators.required])],
      srubrique: [null, Validators.compose([Validators.required])],
      rubrique: [null, Validators.compose([Validators.required])],
      source: [null, Validators.compose([Validators.required])],
      title: [null, Validators.compose([Validators.required])],
      description: [null, Validators.compose([Validators.required])]
    });
    this.date_incident = this.dateP.getDateForDay(1);
    if (localStorage.getItem("societe")) {
      this.societe = JSON.parse(localStorage.getItem("societe"));
      this.sources = this.societe.tsourcesList;
      this.rubriques = this.societe.trubriquesList;
    }
    if (localStorage.getItem("user")) {
      this.user = JSON.parse(localStorage.getItem("user"));
    }
    if (localStorage.getItem("parametre")) {
      const param = JSON.parse(localStorage.getItem("parametre"));
      this._translate.use(param.langue.code);
    } else {
      this._translate.use("fr");
    }
    if (localStorage.getItem("tourners")) {
      this.allTourners = JSON.parse(localStorage.getItem("tourners"));
    }
    if (this.route.snapshot.queryParams.incident) {
      this.incidentToEdit = JSON.parse(
        this.route.snapshot.queryParams.incident
      );
    }
    if (this.route.snapshot.queryParams.client) {
      this.client = JSON.parse(this.route.snapshot.queryParams.client);
    }
    this.initClient();
    this.init();
  }
  init() {
    if (this.route.snapshot.queryParams.incident) {
      this.incidentToEdit = JSON.parse(
        this.route.snapshot.queryParams.incident
      );
      this.isUpdate = true;
    }
    if (this.incidentToEdit) {
      console.log(this.incidentToEdit);
      this.title = this.incidentToEdit.title;
      this.description = this.incidentToEdit.description;
      this.source = this.incidentToEdit.sourceid;
      this.srubrique = this.incidentToEdit.srubriqueid;
      const rub = this.rubriques.filter(el => {
        return el.name.includes(this.srubrique.rubrique);
      });
      if (rub.length !== 0) {
        this.rubrique = rub[0];
      }
      if (this.incidentToEdit.photo !== null) {
        this.photo = this.incidentToEdit.photo;
      }
    }
  }
  saveIncident() {
    if (
      this.title &&
      this.description &&
      this.title !== null &&
      this.description !== null &&
      this.title !== "" &&
      this.description !== "" &&
      this.client !== null &&
      this.srubrique !== null &&
      this.client !== "" &&
      this.srubrique !== "" &&
      this.source !== null &&
      this.source !== ""
    ) {
      this.Incident.clientid = "" + this.client.id;
      this.Incident.srubriqueid = "" + this.srubrique.id;
      this.Incident.title = this.title;
      this.Incident.user = "" + this.user.id;
      this.Incident.source = "" + this.source.id;
      this.Incident.description = this.description;
      if (this.photo || this.photo !== "") {
        this.Incident.photo = this.photo;
      }
      let that = this;
      if (!this.isUpdate) {
        this.Load("Enregistrement encours...");
        this.incidentP.addIncident(this.Incident).subscribe(
          resp => {
            if (resp instanceof Array && resp.length === 0) {
              that.loaderCmd.dismiss();
              that.sendTaoster("Erreur lors de l'enregisrement");
            } else {
              that.loaderCmd.dismiss();
              localStorage.setItem(
                "currentIncident",
                JSON.stringify(resp.incident)
              );
              that.sendTaoster("Incident enregistrer avec succès");
            }
          },
          err => {
            that.loaderCmd.dismiss();
            console.log(err);
          }
        );
      } else {
        this.Load("Enregistrement encours...");
        this.Incident.id = "" + this.incidentToEdit.id;
        this.incidentP.updateIncident(this.Incident).subscribe(
          resp => {
            if (resp instanceof Array && resp.length === 0) {
              that.loaderCmd.dismiss();
              that.sendTaoster("Erreur lors de l'enregisrement");
            } else {
              that.loaderCmd.dismiss();
              that.sendTaoster("Incident Mis à jour avec succès");
              console.log(resp);
            }
          },
          err => {
            that.loaderCmd.dismiss();
            console.log(err);
          }
        );
      }
    } else {
      this.sendTaoster("veuillez remplir toutes les informations");
    }
  }
  async moreOption(ev) {
    const popover = await this.popCtrl.create({
      component: PopMenuIncidentComponent,
      event: ev,
      translucent: true,
      componentProps: { incident: this.Incident }
    });
    return await popover.present();
  }
  /**
   * @description annuler la photo qui a été prise
   */
  AnnulerImage() {
    this.photo = "";
  }
  /**
   * @description initialisation des clients en fonction de la tournéée
   */
  initClient() {
    if (this.societe.gesttourner === 0) {
      this.clients = JSON.parse(localStorage.getItem("clients"));
    } else {
      if (localStorage.getItem("tourner")) {
        this.clients = JSON.parse(localStorage.getItem("tourner")).tclientsList;
      }
    }
  }

  /**
   * @param msg message à faire afficher
   * @description affichage des notifications de succès ou d'echec
   */
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

  /**
   * @description function permettant d'attendre  le chargement des données
   * @param msg message à afficher lors du chargement
   */
  async Load(msg) {
    this.loaderCmd = await this.loadingCtrl.create({
      message: msg
    });
    return this.loaderCmd.present();
  }

  portChange(event: { component: IonicSelectableComponent; value: any }) {
    this.client = event.value;
  }
  ChangeR(event: { component: IonicSelectableComponent; value: any }) {
    this.srubriques = event.value.tsrubriquesList;
  }
  ChangeSR(event: { component: IonicSelectableComponent; value: any }) {
    this.srubrique = event.value;
  }
  ChangeSource(event: { component: IonicSelectableComponent; value: any }) {
    this.source = event.value;
  }
}
