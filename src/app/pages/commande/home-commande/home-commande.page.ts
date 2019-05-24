import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AddCommandePage } from './../add-commande/add-commande.page';
import { AllCommandePage } from './../all-commande/all-commande.page';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ScanBarCodeService } from '../../../shared/utile/scan-bar-code.service';
@Component({
  selector: 'app-home-commande',
  templateUrl: './home-commande.page.html',
  styleUrls: ['./home-commande.page.scss'],
})
export class HomeCommandePage implements OnInit {
  public tiles: any;
  societe;
  code;

  constructor(public navCtrl: NavController,
    private router:Router,
    private _translate: TranslateService,
    public scanner: ScanBarCodeService) {
    this.initTiles();
  }

  ngOnInit() {
    if(localStorage.getItem("parametre")) {
      const param=JSON.parse(localStorage.getItem("parametre"));
         this._translate.use(param.langue.code);
          }else {
            this._translate.use('fr');
          }
    if(localStorage.getItem('societe')) {
      this.societe=JSON.parse(localStorage.getItem('societe'));
    }
    if(localStorage.getItem('code')) {
      this.code=JSON.parse(localStorage.getItem('code'));
    }
  }
	public navigateTo(tile) {
		this.navCtrl.navigateForward(tile.path);
  }
  navigateToAdd() {
    this.navCtrl.navigateForward('/commande/add-commande');
  }
  navigateToTraitement() {
    this.router.navigate(['/commande/all-commande'], { queryParams: { active: JSON.stringify([501,502,401])} });
  }
  navigateToValidation() {
    this.router.navigate(['/commande/all-commande'], { queryParams: { active: JSON.stringify([201])} });
  }
  navigateToHistorique() {
    this.router.navigate(['/commande/all-commande'], { queryParams: { active: JSON.stringify([201,200,501,502,401])} });
  }
  navigateToMarge() {
    this.navCtrl.navigateForward('/commande/marges-commande');
  }
  navigateToArticle() {
    this.navCtrl.navigateForward('/commande/all-articles');
  }

  private initTiles(): void {
  }

  ScanBarCode() {
    this.scanner.scanBar();
  }
}
