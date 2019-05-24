import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiService } from '../api.service';
@Injectable({
  providedIn: 'root'
})
export class SynchronisationService {

  constructor(private api: ApiService,private http: HttpClient) { }

  updateSociete(data) {
    return this.http.get<any>(this.api.url + 'RestLigneCommandes/getSociete/'+data.id)
      .pipe(
         tap(_ => this.log('societe update')),
        catchError(this.handleError('societe not update', []))
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
