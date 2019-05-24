import { Component, OnInit, Input } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-voir-marge',
  templateUrl: './voir-marge.page.html',
  styleUrls: ['./voir-marge.page.scss'],
})
export class VoirMargePage implements OnInit {
  @Input() commande:any;
  constructor(public navCtrl: NavController,
    public modalController: ModalController,
    public _translate: TranslateService) {
      if(localStorage.getItem("parametre")) {
        const param=JSON.parse(localStorage.getItem("parametre"));
           this._translate.use(param.langue.code);
            } else {
              this._translate.use('fr');
            }
    }


  ngOnInit() {
  }

  close() {
    this.modalController.dismiss();
  }
}
