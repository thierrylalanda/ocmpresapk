import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  constructor(private http: HttpClient,private api: ApiService) { }

  login (data): Observable<any> {
     return this.http.post<any>(this.api.url + 'Authentification/AuthentificationUser', data)
      .pipe(
         tap(_ => this.log('login')),
        catchError(this.handleError('login', []))
      );
  }

  UpdateProfil (data): Observable<any> {
    return this.http.post<any>(this.api.url + 'user/updateuser', data)
     .pipe(
        tap(_ => this.log('login')),
       catchError(this.handleError('login', []))
     );
 }
  logout (): Observable<any> {
    return this.http.get<any>(this.api.url + 'signout')
      .pipe(
        tap(_ => this.log('logout')),
        catchError(this.handleError('logout', []))
      );
  }

  register (data): Observable<any> {
    return this.http.post<any>(this.api.url + 'signup', data)
      .pipe(
        tap(_ => this.log('login')),
        catchError(this.handleError('login', []))
      );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    console.log(message);
  }
}
