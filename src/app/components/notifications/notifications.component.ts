import { Component, OnInit, Input } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Events } from '@ionic/angular';
@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.scss"]
})
export class NotificationsComponent implements OnInit {
  @Input() products:any;
  @Input() allProducts: any;
  allCommande: any=[];
  total={
    produit:0,
    prix:0
  };
  constructor(private storage: NativeStorage,
    public events: Events) {
  }

  ngOnInit() {
    this.allCommande = this.products;
    this.refreshTotal(this.allCommande);
  }

  /**
   * @description valider tous les produits pour la suite de la commande
   */
  checkOut() {
    if(this.allCommande.length !== 0) {
      this.events.publish('shop:save',this.allCommande,Date.now());
    }
  }

  /**
   * @description annuler la commande encour
   */
  Cancel()  {
    this.events.publish('shop:delete',this.allCommande,Date.now());
  }

  /**
   * @description retirer un produit de la liste des produits encours
   * @param product produit à retirer de la commande
   */
  removeProduct(product) {
  const  objIndex = this.allCommande.findIndex((obj => obj.ida === product.ida));
  this.allCommande.splice(objIndex,1);
  const  objIndex1 = this.allProducts.findIndex((obj => obj.ida === product.ida));
  this.allProducts[objIndex1].disabled= false;
  this.allProducts[objIndex1].quantite= 0;
  this.refreshTotal(this.allCommande);
  //this.events.publish('shop:delete',product,Date.now());
  }

  refreshTotal(commandes) {
    this.total.prix=0;
    this.total.produit=0;
    commandes.forEach(element => {
      this.total.prix += element.prix*element.quantite;
      this.total.produit += element.quantite;
    });
  }
}
