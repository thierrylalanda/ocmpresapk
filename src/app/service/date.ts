import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the DateProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable({
    providedIn: 'root'
  })
export class DateProvider {

  constructor(public http: HttpClient) {}
  pad(n) {
    return n < 10 ? "0" + n : n;
  }
  getDateTime():string{
    let dat=new Date();
    return dat.getFullYear() +
    "-" +
    this.pad(dat.getMonth() + 1) +
    "-" +
    this.pad(dat.getDate()) +
    " " +
    this.pad(dat.getHours()) +
    ":" +
    this.pad(dat.getMinutes()) +
    ":" +
    this.pad(dat.getSeconds());
  }

  getDate(date?:any):string {
    let dat=date? new Date(date):new Date();
    return dat.getFullYear() +
    "-" +
    this.pad(dat.getMonth() + 1) +
    "-" +
    this.pad(dat.getDate());
  }
  getNormalDate(separator:any,date?:any):string {
    let dat=date? new Date(date):new Date();
    return dat.getDate() +
    separator +
    this.pad(dat.getMonth() + 1) +
    separator +
    this.pad(dat.getFullYear());
  }
  getDateTimeLong(){
    return new Date().getTime();
  }

  getDateForDay(day:number) {
    return  this.getDate(new Date().getTime()+(day*24*60*60*1000));
  }
  getDateForDayNormal(day:number) {
    return  this.getNormalDate('-',new Date().getTime()+(day*24*60*60*1000));
  }
  getDateForLast(day:number) {
    return  this.getDate(new Date().getTime()-(day*24*60*60*1000));
  }

}