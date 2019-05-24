import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AddIncidentPage } from './../add-incident/add-incident.page';
import { AllIncidentPage } from './../all-incident/all-incident.page';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ScanBarCodeService } from '../../../shared/utile/scan-bar-code.service';
@Component({
  selector: 'app-home-incident',
  templateUrl: './home-incident.page.html',
  styleUrls: ['./home-incident.page.scss'],
})
export class HomeIncidentPage implements OnInit {
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
    this.navCtrl.navigateForward('/incident/add-incident');
  }
  navigateToTraitement() {
    this.router.navigate(['/incident/all-incident'], { queryParams: { active: JSON.stringify([501])} });
  }
  navigateToValidation() {
    this.router.navigate(['/incident/all-incident'], { queryParams: { active: JSON.stringify([501,502])} });
  }
  navigateToHistorique() {
    this.router.navigate(['/incident/all-incident'], { queryParams: { active: JSON.stringify([401,200,501,502,404])} });
  }

  private initTiles(): void {
  }

  ScanBarCode() {
    this.scanner.scanBar();
  }

}
