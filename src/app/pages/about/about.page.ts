import { Component, OnInit } from '@angular/core';
import { PopoverController,NavController } from '@ionic/angular';
import { PopmenuNumberComponent } from '../../components/popmenu-number/popmenu-number.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
 societe:any;
 popover:any;
 parametre:any;
  constructor(
    public navCtrl: NavController,
    public popCtrl: PopoverController,
    private _translate: TranslateService, ) {
      if(localStorage.getItem("parametre")) {
        this.parametre=JSON.parse(localStorage.getItem("parametre"));
           this._translate.use(this.parametre.langue.code);
            }else {
              this._translate.use('fr');
            }
     }

  ngOnInit() {
    if(localStorage.getItem('societe')){
      this.societe=JSON.parse(localStorage.getItem('societe'));
    }
  }

 async showMore(ev) {
    const that=this;
    this.popover = await this.popCtrl.create({
      component: PopmenuNumberComponent,
      event: ev,
      animated: true,
      showBackdrop: true,
      componentProps: { societe : this.societe }
    });
    return await this.popover.present();
  }

  call(number) {
    /* this.phone.call(number); */
  }

  sendMail(mail) {
   window.open("mailto:"+mail, "_system");
    }

    goToHelp(){
      this.navCtrl.navigateForward('/help');
    }
}
