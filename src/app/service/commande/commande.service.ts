import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiService } from '../api.service';
@Injectable({
  providedIn: 'root'
})
export class CommandeService {

  constructor(private api: ApiService,private http: HttpClient) { }

  addCommande(data) {
    return this.http.post<any>(this.api.url + 'RestLigneCommandes/CreateLigneCommande', data)
      .pipe(
         tap(_ => this.log('add commande')),
        catchError(this.handleError('add commande', []))
      );
  }

  getAllCommandeByClient(id) {
    return this.http.get<any>(this.api.url + 'RestLigneCommandes/getAllLigneCommandeClient/'+id)
      .pipe(
         tap(_ => this.log('get commande')),
        catchError(this.handleError('get commande', []))
      );
  }

  getAllRistourneClient(id) {
    return this.http.get<any>(this.api.url + 'RestLigneCommandes/getRistourneClient/'+id)
      .pipe(
         tap(_ => this.log('get ristourne')),
        catchError(this.handleError('get ristourne', []))
      );
  }

  getOneCommande(id) {
    return this.http.get<any>(this.api.url + 'RestLigneCommandes/getLigneCommandeByID/'+id)
      .pipe(
         tap(_ => this.log('get commande')),
        catchError(this.handleError('get commande', []))
      );
  }

  getAllCommandeByPeriode(data) {
    return this.http.get<any>(this.api.url + 'RestLigneCommandes/getAllLigneCommandePeriode/'+data.periode+'/'+data.idSociete)
      .pipe(
         tap(_ => this.log('get commande')),
        catchError(this.handleError('get commande', []))
      );
  }
  getAllCommandeByTourner(idTourner) {
    return this.http.get<any>(this.api.url + 'RestLigneCommandes/getAllLigneCommandeByTourner/'+idTourner)
      .pipe(
         tap(_ => this.log('get commande')),
        catchError(this.handleError('get commande', []))
      );
  }
  deleteCommande(id) {
     return this.http.post<any>(this.api.url + 'RestLigneCommandes/deleteLigneCommande',{id:''+id})
      .pipe(
         tap(_ => this.log('get commande')),
        catchError(this.handleError('get commande', []))
      );
  }
  updateCommande(commande): any {
     return this.http.post<any>(this.api.url + 'RestLigneCommandes/UpdateLigneCommande',commande)
      .pipe(
         tap(_ => this.log('update commande')),
        catchError(this.handleError('update commande', []))
      );
  }
  validerCommande(commande): any {
    return this.http.post<any>(this.api.url + 'RestLigneCommandes/ValidationLigneCommande',commande)
     .pipe(
        tap(_ => this.log('Valider commande')),
       catchError(this.handleError('update commande', []))
     );
 }
 cloturerCommande(commande): any {
  return this.http.post<any>(this.api.url + 'RestLigneCommandes/CloturationCommandes',commande)
   .pipe(
      tap(_ => this.log('cloturer commande')),
     catchError(this.handleError('update commande', []))
   );
}
deleteArticle(commande): any {
  return this.http.post<any>(this.api.url + 'RestLigneCommandes/deleteCommande',commande)
   .pipe(
      tap(_ => this.log('Valider commande')),
     catchError(this.handleError('update commande', []))
   );
}

updateArticle(commande): any {
  return this.http.post<any>(this.api.url + 'RestLigneCommandes/UpdateOnArticle/'+commande.id,commande)
   .pipe(
      tap(_ => this.log('Valider commande')),
     catchError(this.handleError('update commande', []))
   );
}

getAllArticle(id): any {
  return this.http.get<any>(this.api.url + 'RestLigneCommandes/getAllArticlesSociete/'+id)
   .pipe(
      tap(_ => this.log('Valider commande')),
     catchError(this.handleError('update commande', []))
   );
}
deleteArticleSociete(id): any {
  return this.http.post<any>(this.api.url + 'RestLigneCommandes/deleteArticle',{id:''+id})
   .pipe(
      tap(_ => this.log('Valider commande')),
     catchError(this.handleError('update commande', []))
   );
}
getClientByTourner(idTourner): any {
  return this.http.post<any>(this.api.url + 'RestLigneCommandes/deleteArticle',{tourner:''+idTourner})
   .pipe(
      tap(_ => this.log('Valider commande')),
     catchError(this.handleError('update commande', []))
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
