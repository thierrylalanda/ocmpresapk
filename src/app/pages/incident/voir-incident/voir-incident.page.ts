import { Component, OnInit, Input } from '@angular/core';
import {ModalController} from '@ionic/angular'
@Component({
  selector: 'app-voir-incident',
  templateUrl: './voir-incident.page.html',
  styleUrls: ['./voir-incident.page.scss'],
})
export class VoirIncidentPage implements OnInit {
@Input('incident') incident : any;
@Input('client') client;
  constructor(public modalCtrl: ModalController) {}
    ngOnInit() {
      console.log(this.client);
      console.log(this.incident);
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
