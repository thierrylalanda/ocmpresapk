import { Injectable } from '@angular/core';
import { Badge } from '@ionic-native/badge/ngx';
@Injectable({
  providedIn: 'root'
})
export class BadgeService {

  constructor(private badge: Badge) { }
badgeOperation() {
  this.badge.set(10);
this.badge.increase(1);
this.badge.clear();
}

}
