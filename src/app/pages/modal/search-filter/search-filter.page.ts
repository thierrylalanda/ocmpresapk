import { Component, OnInit, Input } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { CommandeService } from '../../../service/commande/commande.service';
@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.page.html',
  styleUrls: ['./search-filter.page.scss'],
})
export class SearchFilterPage implements OnInit {
  public radiusmiles = 1;
  public minmaxprice = {
    upper: 500,
    lower: 10
  };
  date_debut;
  date_fin:any;
  year = new Date().getFullYear();
  clients: any;
  client:any;
  loader:any;
  societe:any;
  @Input() filter;
  @Input() allProducts;
  constructor(private modalCtrl: ModalController,
    private cmdService: CommandeService,
    public loadCtrl: LoadingController) { }

  ngOnInit() {
    this.clients=JSON.parse(localStorage.getItem('clients'));
    this.societe=JSON.parse(localStorage.getItem('societe'));
  }
  closeModal() {
    this.modalCtrl.dismiss();
  }
  search() {
    this.Load('Recherche ...');
        const data= {
          idSociete:this.societe.id,
          periode:this.ConvertDate(this.date_debut)+'_'+this.ConvertDate(this.date_fin)
        };
        let that=this;
        if(this.societe.gesttourner===1){
          if(localStorage.getItem('tourner')){
            const idT=JSON.parse(localStorage.getItem('tourner')).id;
            this.cmdService.getAllCommandeByTourner(idT).subscribe(
             resp=> {
               if(resp instanceof Array) {
                 this.loader.dismiss();
                } else if(resp.Ligne) {
                  that.allProducts=resp.Ligne;
              that.modalCtrl.dismiss({result:resp.Ligne});
              that.loader.dismiss();
               }
             }
           );
          } else {this.loader.dismiss();}
        } else {
         this.cmdService.getAllCommandeByPeriode(data).subscribe(
           resp=> {
             if(resp instanceof Array) {
               this.loader.dismiss();
              } else if(resp.Ligne) {
               that.allProducts=resp.Ligne;
              that.modalCtrl.dismiss({result:resp.Ligne});
              that.loader.dismiss();
             }
           }
         );
        }
  }

  async Load(msg) {
    this.loader = await this.loadCtrl.create({
      message:msg
    });
    return this.loader.present();
  }
  ConvertDate(date) {
   return date.split('-')[2]+'-'+date.split('-')[1]+'-'+date.split('-')[0];
  }
}
