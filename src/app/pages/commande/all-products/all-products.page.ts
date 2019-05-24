import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router'
import { SearchFilterPage } from '../../modal/search-filter/search-filter.page';
import { ModalController, PopoverController, Events,NavController } from '@ionic/angular';
import { NotificationsComponent } from '../../../components/notifications/notifications.component';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.page.html',
  styleUrls: ['./all-products.page.scss'],
})
export class AllProductsPage implements OnInit {
  radiusmiles:number;
  searchKey:String;
  allProductToMarket= [];
  allProduct= [];
  limitTo= 40;
  filterList=[];
   popover: any;
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    private storage: NativeStorage,
    public events: Events,
    public route: ActivatedRoute,
    private _translate: TranslateService) {
      const that= this;
      this.events.subscribe('shop:delete', (Product, time) => {
        const  objIndex = that.allProduct.findIndex((obj => obj.id === Product.id));
        if( objIndex > -1) {
          that.allProduct[objIndex].disabled= false;
          that.allProduct[objIndex].quantite= 0;
        }
        });
        this.events.subscribe('shop:save', (Products, time) => {
          that.popover.dismiss();
          if(this.route.snapshot.queryParams.update){
            that.navCtrl.navigateForward('/commande/edit-commande');
          } else {
            that.navCtrl.navigateForward('/commande/add-commande');
          }
        });
    }

  ngOnInit() {
    if(localStorage.getItem("parametre")) {
      const param=JSON.parse(localStorage.getItem("parametre"));
         this._translate.use(param.langue.code);
          } else {
            this._translate.use('fr');
          }
    this.allProduct=JSON.parse(localStorage.getItem('article'));
    this.filterList=this.allProduct;
  }

  async searchFilter () {
    const modal = await this.modalCtrl.create({
      component: SearchFilterPage
    });
    return await modal.present();
  }
  async notifications(ev: any) {
    const that=this;
    this.popover = await this.popoverCtrl.create({
      component: NotificationsComponent,
      event: ev,
      animated: true,
      showBackdrop: true,
      componentProps: { products : that.allProductToMarket,allProducts: that.allProduct }
    });
    return await this.popover.present();
  }
  addProduct(product) {
    if(!product.disabled && product.quantite !== 0 ) {
      product.disabled=true;
      this.allProductToMarket.unshift(product);
    }
  }

  removeProduct(product) {
    const  objIndex = this.allProduct.findIndex((obj => obj.ida === product.ida));
    this.allProduct[objIndex].disabled=false;
    this.allProduct[objIndex].quantite=0;
    const  objIndex1 = this.allProductToMarket.findIndex((obj => obj.ida === product.ida));
    this.allProductToMarket.splice(objIndex1,1);
  }

  onSearch(ev) {
 this.allProduct=this.filterList;
     // set val to the value of the ev target
     const val = ev.target.value;
     // if the value is an empty string don't filter the items
     if (val && val.trim() !== '') {
       this.allProduct = this.allProduct.filter(item => {
          return item.nom.toUpperCase().includes(val.toUpperCase())
          || item.code.toUpperCase().includes(val.toUpperCase())
          || item.categorie.nom.toUpperCase().includes(val.toUpperCase());
       });
     }
  }
  saveAllProduct() {
    if(this.allProductToMarket instanceof Array && this.allProductToMarket.length !== 0) {
      this.events.publish('shop:save',this.allProductToMarket,Date.now());
    }
    this.navCtrl.navigateBack('/commande/add-commande');
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
}
