export class Commande {
  client: String;
  id?:String;
  tourner?:String;
  datelivraison: any;
  date_commande?: string;
  commandes: Array<Object>;
  societe?: String;
  prixTotal: String;
  signature?: String;
  qtotal: String;
  etatc: String='1';
  commantaire?: String;
}
