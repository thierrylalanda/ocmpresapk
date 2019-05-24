import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiService } from '../api.service';
@Injectable({
  providedIn: 'root'
})
export class IncidentService {

  constructor(private api: ApiService,private http: HttpClient) { }

  getAllIncident(idUser) {
    return this.http.get<any>(this.api.url + "RestIncidents/getAllIncidentsUser/"+idUser)
      .pipe(
         tap(_ => this.log('add commande')),
        catchError(this.handleError('add commande', []))
      );
  }
  getIncident(client) {
    return this.http.get<any>(this.api.url + "RestIncidents/getAllIncidentsClient/"+client)
      .pipe(
         tap(_ => this.log('add commande')),
        catchError(this.handleError('add commande', []))
      );
  }
  getOneIncident(id): any {
     return this.http.get<any>(this.api.url + "RestIncidents/getOneIncident/"+id)
      .pipe(
         tap(_ => this.log('add commande')),
        catchError(this.handleError('add commande', []))
      );
  }
  getIncidentByEtat(client,etat): any {
    return this.http.get<any>(this.api.url + "tincidents?clientid="+client.id+"&state="+etat)
      .pipe(
         tap(_ => this.log('add commande')),
        catchError(this.handleError('add commande', []))
      );
  }
  Delete(id): any {
    return this.http.post<any>(this.api.url + "RestIncidents/deleteIncident",{id:""+id})
      .pipe(
         tap(_ => this.log('add commande')),
        catchError(this.handleError('add commande', []))
      );
  }
  getEtat(): any {
    return this.http.get<any>(this.api.url + "Reststatutincident/getAllEtatIncident")
    .pipe(
       tap(_ => this.log('add commande')),
      catchError(this.handleError('add commande', []))
    );
  }
  getEtatByCode(code): any {
    return this.http.get<any>(this.api.url + "statut_incident?code="+code)
    .pipe(
       tap(_ => this.log('add commande')),
      catchError(this.handleError('add commande', []))
    );
  }
   /**
   * Obtenir la liste des rubriques
   */
  getRubrique(idSociete) {
    return this.http.get<any>(this.api.url + "RestRubriques/getAllRubriquesBySociete?id="+idSociete)
    .pipe(
       tap(_ => this.log('add commande')),
      catchError(this.handleError('add commande', []))
    );
  }
  getSRubrique(id) {
    return this.http.get<any>(this.api.url + "tsrubriques?id="+id)
    .pipe(
       tap(_ => this.log('add commande')),
      catchError(this.handleError('add commande', []))
    );
  }
  /**
   * Obtenir la liste des sous rubriques d'une rubrique
   */
  getSrubriqueByRubrique(idRubrique) {
    return this.http.get<any>(this.api.url + "tsrubriques?rubriqueid="+idRubrique)
    .pipe(
       tap(_ => this.log('add commande')),
      catchError(this.handleError('add commande', []))
    );
  }
  addIncident(incident): any {
    return this.http.post<any>(this.api.url + "RestIncidents/CreateIncident",incident)
    .pipe(
       tap(_ => this.log('add commande')),
      catchError(this.handleError('add commande', []))
    );
  }
  updateIncident(incident): any {
    return this.http.post<any>(this.api.url + "RestIncidents/UpdateIncident",incident)
    .pipe(
       tap(_ => this.log('add commande')),
      catchError(this.handleError('add commande', []))
    );
  }
  fermerIncident(incident): any {
    return this.http.post<any>(this.api.url + "RestIncidents/FermerIncident",incident)
    .pipe(
       tap(_ => this.log('add commande')),
      catchError(this.handleError('add commande', []))
    );
  }
  repondreIncident(incident): any {
    return this.http.post<any>(this.api.url + "RestIncidents/TraitementTicket",incident)
    .pipe(
       tap(_ => this.log('add commande')),
      catchError(this.handleError('add commande', []))
    );
  }
  getTraitementTicket(id): any {
    return this.http.get<any>(this.api.url + "ttraitement_ticket?incident="+id)
    .pipe(
       tap(_ => this.log('add commande')),
      catchError(this.handleError('add commande', []))
    );
  }
  getUserPlaintetIncident(idI): any {
    return this.http.get<any>(this.api.url + "RestIncidents/getAllUserplainteByIncident/"+idI)
    .pipe(
       tap(_ => this.log('add commande')),
      catchError(this.handleError('add commande', []))
    );
  }
  getUser(id): any {
    return this.http.get<any>(this.api.url + "tusers?id="+id)
    .pipe(
       tap(_ => this.log('add commande')),
      catchError(this.handleError('add commande', []))
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
