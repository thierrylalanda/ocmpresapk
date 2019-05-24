import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
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
import { Storage } from "@ionic/storage";
import { Commande } from "../../../models/commande";
import { CommandeService } from "../../../service/commande/commande.service";
import { PopmenuEditCommandeComponent } from "../../../components/popmenu-edit-commande/popmenu-edit-commande.component";
import { DateProvider } from "../../../service/date";
import { IonicSelectableComponent } from "ionic-selectable";
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "app-add-commande",
  templateUrl: "./add-commande.page.html",
  styleUrls: ["./add-commande.page.scss"]
})
export class AddCommandePage implements OnInit {
  public commandeForm: FormGroup;
  public shop: any;
  customPopoverOptions: any = {
    header: "Client"
  };
  Total = 0;
  date =
    new Date().getFullYear() +
    "-" +
    new Date().getMonth() +
    "-" +
    new Date().getDate();
  year = new Date().getFullYear();
  productToDelete = [];
  commande = new Commande();
  clients: any;
  client: any;
  societe: any;
  date_livraison = this.date;
  signature: any;
  @Input() commandeToEdit;
  canUpdate: boolean = false;
  code;
  INIT_DATA: boolean = false;
  allTourners: any = [];
  currentTourner:any;
  loaderCmd:any;
  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    public events: Events,
    public storage: Storage,
    private cmdService: CommandeService,
    public modalCtrl: ModalController,
    private route: ActivatedRoute,
    public router: Router,
    public popCtrl: PopoverController,
    public dateP: DateProvider,
    private _translate: TranslateService
  ) {
    const that = this;
    this.events.subscribe("signature:add", (signature, time) => {
      that.signature = signature;
    });
    this.events.subscribe("signature:cancel", (signature, time) => {
      that.signature = null;
    });
    this.events.subscribe("clients:chargement", (clients, time) => {
      that.clients = clients;
    });
    this.events.subscribe("shop:save", (Products, time) => {
      if (that.shop instanceof Array && that.shop.length !== 0) {
        Products.forEach(elt => {
          if (that.containsObject(elt, that.shop)) {
          } else {
            that.shop.push(elt);
          }
        });
      } else {
        that.shop = Products;
      }
      that.setTotal(that.shop);
    });
    this.events.subscribe("shop:update", (commande, time) => {
      that.shop = commande.tcommandesList.map(elt => {
        return {
          id: elt.id,
          ida: elt.article.id,
          code: elt.article.code,
          nom: elt.article.nom,
          quantite: elt.quantite,
          prix: elt.prix,
          qte: 0,
          disabled: true
        };
      });
    });

    if (localStorage.getItem("code")) {
      this.code = JSON.parse(localStorage.getItem("code"));
    }
  }
  ngOnInit() {
    if (localStorage.getItem("parametre")) {
      const param = JSON.parse(localStorage.getItem("parametre"));
      this._translate.use(param.langue.code);
    } else {
      this._translate.use("fr");
    }
    if (localStorage.getItem("tourners")) {
      this.allTourners = JSON.parse(localStorage.getItem("tourners"));
    }
    if(localStorage.getItem('currentCommande')){
      localStorage.removeItem('currentCommande');
    }
    this.initData();
    this.init();
    this.initClient();
  }
  containsObject(obj, list) {
    let i;
    for (i = 0; i < list.length; i++) {
      if (list[i].ida === obj.ida) {
        list[i].quantite = obj.quantite;
        return true;
      }
    }

    return false;
  }
  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ngOnDestroy() {
    this.events.unsubscribe("shop:save");
    this.events.unsubscribe("shop:update");
  }
  dismiss() {
    this.modalCtrl.dismiss();
  }
  initClient() {
    if (this.societe.gesttourner === 0) {
      this.clients = JSON.parse(localStorage.getItem("clients"));
    } else{
      if(localStorage.getItem("tourner")) {
        this.clients = JSON.parse(localStorage.getItem("tourner")).tclientsList;
      }
     }
  }
  
  initData() {
    this.INIT_DATA = false;
    this.date_livraison = this.dateP.getDateForDay(1);
    this.societe = JSON.parse(localStorage.getItem("societe"));
    this.commandeForm = this.formBuilder.group({
      client: [null, Validators.compose([Validators.required])],
      date_livraison: [null, Validators.compose([Validators.required])]
    });
    this.shop = [];
    this.Total = 0;
  }
  init() {
if (this.route.snapshot.queryParams.commande) {
      this.commandeToEdit = JSON.parse(this.route.snapshot.queryParams.commande);
    }
    if (this.commandeToEdit) {
      this.Total = this.commandeToEdit.prixtotal;
      this.date_livraison = this.commandeToEdit.datelivraison;
      this.client = this.commandeToEdit.client;
      this.shop = this.commandeToEdit.tcommandesList.map(elt => {
        return {
          id: elt.id,
          ida: elt.article.id,
          code: elt.article.code,
          nom: elt.article.nom,
          quantite: elt.quantite,
          prix: elt.prix,
          qte: 0,
          disabled: true
        };
      });
      if (this.commandeToEdit.etatc.code !== 200) {
        this.canUpdate = true;
      }
      localStorage.setItem('currentCommande',JSON.stringify(this.commandeToEdit));
    }
  }
  setTotal(Products) {
    const that = this;
    that.Total = 0;
    Products.forEach(element => {
      that.Total += element.quantite * element.prix;
    });
  }
  async saveCommande() {
    if (this.commandeForm.valid) {
      if (this.shop.length !== 0) {
        this.setTotal(this.shop);
        this.commande.client = this.client.id;
        this.commande.societe = this.societe.id.toString();
        this.commande.datelivraison =
          "" +
          this.date_livraison.split("-")[2] +
          "/" +
          this.date_livraison.split("-")[1] +
          "/" +
          this.date_livraison.split("-")[0];
        if (this.commandeToEdit) {
          this.commande.etatc = "" + this.commandeToEdit.etatc.id;
        } else {
          this.commande.etatc = "1";
        }
        this.commande.qtotal = "" + this.shop.length;
        this.commande.prixTotal = this.Total.toString();
        if (this.commandeToEdit) {
          this.commande.id = "" + this.commandeToEdit.id;
        }
        
        if (this.signature) {
          this.commande.signature = this.signature;
        }
        const SaveYourCommande = await this.alertCtrl.create({
          header: "Confirmez votre commande",
          message: "Total :" + this.Total,
          inputs: [
            {
              name: "description",
              placeholder: "Description de la commande",
              type: "text"
            }
          ],
          buttons: [
            {
              text: "Cancel",
              handler: data => {}
            },
            {
              text: "OK",
              handler: async data => {
                //  this.yourLocation = data.description;
                if (data.description) {
                  this.commande.commantaire = data.description;
                }
                this.commande.commandes = this.shop.map(elt => {
                  if (this.commandeToEdit) {
                    let id = elt.id ? elt.id : 0;
                    return {
                      id: "" + id,
                      ligne: "" + this.commandeToEdit.id,
                      article: "" + elt.ida,
                      quantite: "" + elt.quantite,
                      commantaire: "",
                      qt: "" + 0,
                      prix: "" + elt.prix,
                      prixTotal: "" + elt.quantite * elt.prix
                    };
                  } else {
                    return {
                      article: "" + elt.ida,
                      quantite: "" + elt.quantite,
                      commantaire: "",
                      qt: "" + 0,
                      prix: "" + elt.prix,
                      prixTotal: "" + elt.quantite * elt.prix
                    };
                  }
                });
                if (this.commandeToEdit) {
                  this.commande.tourner=this.commandeToEdit.touner;
                  this.cmdService
                    .updateCommande(this.commande)
                    .subscribe(resp => {
                      if (resp instanceof Array && resp.length === 0) {
                        this.sendTaoster("Enregistrement non effectué");
                      } else {
                        this.events.publish(
                          "shop:update",
                          resp.Ligne,
                          Date.now()
                        );
                        this.sendTaoster("Mis à jour effectuée avec succès");
                        // this.navCtrl.navigateBack('/commande/all-commande');
                        localStorage.setItem('currentCommande',JSON.stringify(resp.Ligne));
                        this.initData();
                        localStorage.removeItem("signature");
                      }
                    });
                } else {
                  if(this.societe.gesttourner===1) {
                    this.commande.tourner=""+JSON.parse(localStorage.getItem('tourner')).id;
                  }
                  this.cmdService.addCommande(this.commande).subscribe(
                    resp => {
                      if (resp instanceof Array && resp.length === 0) {
                        this.sendTaoster("Commande non enregistrée");
                        let cmd = [];
                        this.commande.client = this.client;
                        } else {
                        this.sendTaoster("Commande enregistrée avec succèss");
                        //this.navCtrl.navigateBack('/commande');
                        this.initData();
                        localStorage.setItem('currentCommande',JSON.stringify(resp.Ligne));
                        localStorage.removeItem("commandeEncours");
                        localStorage.removeItem("signature");
                      }
                    },
                    err => {}
                  );
                }
              }
            }
          ]
        });
        SaveYourCommande.present();
      }
    }
  }
  updateProduct() {
    this.setTotal(this.shop);
  }

  addToDelete(art) {
    if (art.disabled) {
      this.productToDelete.push(art);
    } else {
      const objIndex = this.productToDelete.findIndex(obj => obj.id === art.id);
      this.productToDelete.splice(objIndex, 1);
    }
  }
  async deleteProduct(art, index) {
    if (art.id) {
      let that = this;
      const alert = await this.alertCtrl.create({
        header: "Confirmation!",
        message:
          "vous êtes sur le point de  <strong>supprimer</strong> un article de la commande!!!",
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            cssClass: "secondary",
            handler: blah => {}
          },
          {
            text: "Ok",
            handler: () => {
              this.cmdService
                .deleteArticle({ id: "" + art.id })
                .subscribe(resp => {
                  this.shop.splice(index, 1);
                  this.sendTaoster("commande supprimé avec succèss");
                  that.events.publish("shop:update", resp.Ligne, Date.now());
                  this.setTotal(this.shop);
                });
            }
          }
        ]
      });
      await alert.present();
    } else {
      this.shop.splice(index, 1);
      this.sendTaoster("commande supprimé avec succèss");
      this.setTotal(this.shop);
    }
  }

  async moreOption(ev) {
    const popover = await this.popCtrl.create({
      component: PopmenuEditCommandeComponent,
      event: ev,
      translucent: true,
      componentProps: { commande: this.commandeToEdit }
    });
    return await popover.present();
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
  async Load(msg) {
    this.loaderCmd = await this.loadingCtrl.create({
      message:msg
    });
    return this.loaderCmd.present();
  }
  portChange(event: { component: IonicSelectableComponent; value: any }) {}
}
