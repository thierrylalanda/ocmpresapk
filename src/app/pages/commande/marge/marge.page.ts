import { Component, OnInit, ViewChild  } from '@angular/core';
import { Platform,ActionSheetController, NavController, Events,
  PopoverController, ModalController,LoadingController, ToastController, AlertController  } from '@ionic/angular';
import { VoirCommandePage } from '../voir-commande/voir-commande.page';
import { CommandeService } from '../../../service/commande/commande.service';
import { SearchFilterPage } from '../../modal/search-filter/search-filter.page';
import { AddCommandePage } from '../add-commande/add-commande.page';
import { Router, ActivatedRoute } from '@angular/router';
import { DateProvider } from '../../../service/date';
import { IonInfiniteScroll } from '@ionic/angular';
import { VoirMargePage } from '../voir-marge/voir-marge.page';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-marge',
  templateUrl: './marge.page.html',
  styleUrls: ['./marge.page.scss'],
})
export class MargePage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  allCommande: any;
  filterCommande: any;
  selectedCommande: any;
  modalView: any;
  dateN = new Date();
  societe: any;
  FDay= this.dateN.getDate()+'-'+this.dateN.getMonth()+'-'+this.dateN.getFullYear();
  popover:any;
  loaderCmd:any;
  modalFilter:any;
  filterList: any;
  optionToCommande;
  limitTo = 40;
  active:any;
  marges = 0;
  ristournes = 0;
  constructor(public actionSheetCtrl: ActionSheetController,
    public platform: Platform,
    public navCtrl: NavController,
    public popoverCtrl: PopoverController,
    public modalController: ModalController,
    private cmdeService: CommandeService,
    public loadCtrl: LoadingController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public dateP: DateProvider,
    public events: Events,
    private router:Router,
    private route: ActivatedRoute,
    public _translate: TranslateService) {}

 async ngOnInit() {
  if(localStorage.getItem("parametre")) {
    const param=JSON.parse(localStorage.getItem("parametre"));
       this._translate.use(param.langue.code);
        } else {
          this._translate.use('fr');
        }
  if (this.route.snapshot.queryParams.active) {
    this.active =JSON.parse( this.route.snapshot.queryParams.active);
  }
    this.societe=JSON.parse(localStorage.getItem('societe'));
    const data= {
      idSociete:this.societe.id,
       periode:this.dateP.getNormalDate('-')+'_'+this.dateP.getDateForDayNormal(1)
    };
    this.loaderCmd = await this.loadCtrl.create({
      message:'Chargement ...'
    });
   this.loaderCmd.present();
    this.cmdeService.getAllCommandeByPeriode(data).subscribe(
      response=> {
        if(response instanceof Array) {
          let cmd = [];
          this.loaderCmd.dismiss();

        } else if(response.Ligne) {
          this.allCommande=response.Ligne;
          this.filterList=response.Ligne;
          this.setMargeAndRistournes();
          this.loaderCmd.dismiss();
        }
      }
    );
  }

  initData() {
    const data= {
      idSociete:this.societe.id,
       periode:this.dateP.getNormalDate('-')+'_'+this.dateP.getDateForDayNormal(1)
    };
    this.cmdeService.getAllCommandeByPeriode(data).subscribe(
      response=> {
        if(response instanceof Array) {
          this.loaderCmd.dismiss();
        } else if(response.Ligne) {
          this.allCommande=response.Ligne;
          this.filterList=response.Ligne;
          this.setMargeAndRistournes();
          this.loaderCmd.dismiss();
        }
      }
    );
  }

  showMore(commande) {
    this.selectedCommande=commande;
    this.optionToCommande=[
      {
        text: 'Plus de détails',
        icon: !this.platform.is('ios') ? 'information' : null,
        handler: () => {
          this.showDetails();
        }
      }
    ];
      this.optionToCommande.push({
        text: 'Cancel',
        role: 'cancel',
        handler: () => {}
      });
    this.presentActionSheet();
  }

  async showDetails() {
    const that=this;
     this.modalView = await this.modalController.create({
      component: VoirMargePage,
      animated: true,
      showBackdrop: true,
      componentProps: { commande : that.selectedCommande}
    });
    return await this.modalView.present();
  }

  close() {
    this.modalView.dismiss();
  }

  async searchFilter () {
    const that=this;
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
          this.setMargeAndRistournes();
        }
      }
    );
    return await this.modalFilter.present();
  }
 async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Commandes',
      cssClass: 'action-sheets-basic-page',
      buttons: this.optionToCommande
    });
    actionSheet.present();
  }

  async Load(msg) {
    this.loaderCmd = await this.loadCtrl.create({
      message:msg
    });
    return this.loaderCmd.present();
  }

  onSearch(ev) {
    this.allCommande=this.filterList;
        // set val to the value of the ev target
        const val = ev.target.value;
        // if the value is an empty string don't filter the items
        if (val && val.trim() !== '') {
          this.allCommande = this.allCommande.filter(item => {
             return item.client.nom.toUpperCase().includes(val.toUpperCase()) || 
             item.etatc.nom.toUpperCase().includes(val.toUpperCase());
          });
          this.setMargeAndRistournes();
        }
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

    doInfinite(event){
      let that=this;
    setTimeout(() => {
      if(that.filterList.length > that.limitTo) {
        that.limitTo += 20;
      }
      event.target.complete();
    }, 1000);
    }

    doRefresh(event) {
      setTimeout(() => {
        this.initData();
        event.target.complete();
      }, 2000);
    }

    setMargeAndRistournes() {
      this.marges=0;
      this.ristournes=0;
      this.allCommande.forEach(element => {
        this.marges += element.margeFournisseur;
        this.ristournes += element.margeClient;
      });
    }
}
