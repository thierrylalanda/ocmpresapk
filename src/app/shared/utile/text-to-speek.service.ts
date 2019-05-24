import { Injectable } from '@angular/core';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';

@Injectable({
  providedIn: 'root'
})
export class TextToSpeekService {

  constructor(public tts: TextToSpeech) { }

  public speeker(text) {
    this.tts.speak({
      text: text,
      locale: 'fr-FR',
      rate: 0.75
  })
  .then(() => {})
  .catch((reason: any) => {});
  }

}
