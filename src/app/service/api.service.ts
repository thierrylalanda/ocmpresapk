import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  API_KEY='28c4c5852b05cc6f60c4547c689cf1c04af20f69769a14f1145129c2f1cbf53d';
   url: String = 'https://www.eh2s-app.com/ocmapipresaler/';
  //url = 'http://192.168.43.136:40139/OCMV2/';
  //url='http://192.168.1.101:8081/ocmv2/'
  //url: string = "https://www.eh2s-app.com:8181/ocmv2/";
  token: any;
  reqOpts;
  constructor(public http: HttpClient) {}
  get(endpoint: string, params?: any, reqOpts?: any) {
    return this.http.get(this.url + '/' + endpoint, reqOpts);
  }

  post(endpoint: string, body: any, reqOpts?: any) {
    return this.http.post(this.url + '/' + endpoint, body,reqOpts);
  }

  put(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.url + '/' + endpoint, body, reqOpts);
  }

  delete(endpoint: string, reqOpts?: any) {
    return this.http.delete(this.url + '/' + endpoint,this.reqOpts);
  }

  patch(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.url + '/' + endpoint, body, this.reqOpts);
  }

}
