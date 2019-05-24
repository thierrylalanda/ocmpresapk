import { Component, OnInit,Input } from '@angular/core';
import { Platform,Events, PopoverController } from '@ionic/angular';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
@Input() notifLength;
allnotif=[];
  constructor(public events: Events,public popCtrl:PopoverController) {
    this.events.publish('notification:read',0,Date.now());
  }

  ngOnInit() {
    if(this.notifLength) {
      this.notifLength=0;
    }
    if(localStorage.getItem('notifications')) {
      this.allnotif=JSON.parse(localStorage.getItem('notifications'));
    } else {
     /*  for(let i=0; i<10;i++) {
        this.allnotif.push({
          title:'noitification n° '+i,
          message:'nous sommes ravis de vous revoir pour la <strong>'+i+' ième</strong> fois'
        });
      } */
    }
  }
  cancel() {
    this.popCtrl.dismiss();
  }
}
