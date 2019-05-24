import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class MapDataService {
  constructor() {}

  mapUser(user): Object {
   
    return {};
  }
  mapClient(clients): Object {
    return {};
  }

  mapCategorie(categories): Array<Object> {
    let cat =[];
    categories.forEach(element => {
        element.tarticlesList.forEach(art => {
            cat.push({
                ida: art.id,
                nom: art.nom,
                code: art.code,
                photo: art.photo,
                chemin: art.chemin,
                margeClient: art.margeClient,
                margeFournisseur: art.margeFournisseur,
                prix: art.prix,
                seuil: art.seuil,
                stock: art.stock,
                unite: art.unite,
                total:0,
                quantite:0,
                qte:0,
                prixDivers:0,
                disabled:false,
                categorie: {
                  id: element.id,
                  nom: element.nom
                }
              });
        });
    });
    return cat;
  }
}
