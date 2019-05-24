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
import { AddArticlePage } from '../../modal/add-article/add-article.page';
@Component({
  selector: 'app-articles',
  templateUrl: './articles.page.html',
  styleUrls: ['./articles.page.scss'],
})
export class ArticlesPage implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  allArticles: any;
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
  searchKey='';
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
    public _translate: TranslateService) {
    }

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
    this.cmdeService.getAllArticle(this.societe.id).subscribe(
      response=> {
        if(response instanceof Array) {
          let cmd = [];
          this.loaderCmd.dismiss();

        } else if(response.Articles) {
          this.allArticles=response.Articles;
          this.filterList=response.Articles;
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
        } else if(response.Articles) {
          this.allArticles=response.Articles;
          this.filterList=response.Articles;
          this.loaderCmd.dismiss();
        }
      }
    );
  }

  SaveUpdate(article) {
    this.cmdeService.updateArticle(article).subscribe(
      resp=> {
        if(resp instanceof Array && resp.length ===0) {

        } else {
          this.events.publish("article:update",resp.Article,Date.now());
        }
      }
    );
  }
  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Commandes',
      cssClass: 'action-sheets-basic-page',
      buttons: this.optionToCommande
    });
    actionSheet.present();
  }
  showMore(commande) {
    this.selectedCommande=commande;
    
    this.optionToCommande=[
      {
        text: 'Modifier',
        icon: !this.platform.is('ios') ? 'information' : null,
        handler: () => {
          this.showDetails();
        }
      },
      {
        text: 'Supprimer',
        icon: !this.platform.is('ios') ? 'trash' : null,
        handler: () => {
          this.deleteArticle();
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

 async deleteArticle() {
  const alert = await this.alertCtrl.create({
    header: 'Confirmation!',
    message: 'vous êtes sur le point de  <strong>supprimer définitivement</strong> un article!!!',
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
          this.cmdeService.deleteArticleSociete(this.selectedCommande.id).subscribe(
            resp=> {
                  if(resp instanceof Array && resp.length=== 0) {
               } else {
                    const index = this.allArticles.findIndex(elt=> {
                      return elt.id ===this.selectedCommande.id;
                    });
                    if(index) {
                      this.allArticles.splice(index,1);
                      this.sendTaoster('Article supprimé avec succèss');
                    }
                  }
            }
          );
        }
      }
    ]
  });
  await alert.present();
  }
  async showDetails() {
    const that=this;
     this.modalView = await this.modalController.create({
      component: AddArticlePage,
      animated: true,
      showBackdrop: true,
      componentProps: { article : that.selectedCommande}
    });
    return await this.modalView.present();
  }
  onSearch(ev) {
    this.allArticles=this.filterList;
        // set val to the value of the ev target
        const val = ev.target.value;
        // if the value is an empty string don't filter the items
        if (val && val.trim() !== '') {
          this.allArticles = this.allArticles.filter(item => {
             return item.nom.toUpperCase().includes(val.toUpperCase()) || 
             item.code.toUpperCase().includes(val.toUpperCase());
          });
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
}
