import { Component, OnInit, Input } from '@angular/core';
import { Platform,ActionSheetController, NavController, Events,
  PopoverController, ModalController,LoadingController, ToastController, AlertController  } from '@ionic/angular';
import { CommandeService } from 'src/app/service/commande/commande.service';
@Component({
  selector: 'app-add-article',
  templateUrl: './add-article.page.html',
  styleUrls: ['./add-article.page.scss'],
})
export class AddArticlePage implements OnInit {
@Input() article;
societe;
  constructor(public actionSheetCtrl: ActionSheetController,
    public platform: Platform,
    public navCtrl: NavController,
    public popoverCtrl: PopoverController,
    public modalController: ModalController,
    private cmdeService: CommandeService,
    public loadCtrl: LoadingController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public events: Events,) { }

  ngOnInit() {
    if(localStorage.getItem('societe')) {
      this.societe=JSON.parse(localStorage.getItem('societe'));
    }
  }

  closeModal() {
    this.modalController.dismiss();
  }

  Save() {
    if(this.article) {
      if(this.article.nom !== '' && this.article.code !== '' && this.article.prix !== ''
      && this.article.stock !== '' && this.article.seuil !== '' && this.article.margeFournisseur !== ''
      && this.article.margeClient !== '') {
        this.cmdeService.updateArticle(this.article).subscribe(
          resp=> {
            if(resp instanceof Array && resp.length ===0) {

            } else {
              this.events.publish("article:update",resp.Article,Date.now());
            }
          }
        );
      }
    }

  }
}
