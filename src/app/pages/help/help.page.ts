import { Component, NgZone, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
declare var ApiAIPromises: any;
@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {
  answers = [];
  question;
  constructor(public platform: Platform, public ngZone: NgZone) {
    platform.ready().then(() => {
      ApiAIPromises.init({
        clientAccessToken: "63be609628454f329ea7c4ced878ca96"
      }).then(result => console.log(result));
    });
   }

  ngOnInit() {
  }

  ask(question) {
   
    this.answers.push({text:question,from:'user'});
    this.question ="";
    ApiAIPromises.requestText({
      query: question
    })
    .then(({result: {fulfillment: {speech}}}) => {
       this.ngZone.run(()=> {
        this.question ="";
        this.answers.push({text:speech,from:'boot'});
       });
    }).catch(err=>{
      console.log(err);
    });
  }
}
