DROP TABLE IF EXISTS parametre;
CREATE TABLE parametre
(
    id INTEGER PRIMARY KEY,
    nom TEXT,
    synchronisation TEXT,
    last_synchro datetime DEFAULT CURRENT_TIMESTAMP,
    theme TEXT,
);
DROP TABLE IF EXISTS societe;
CREATE TABLE societe
(
    id int(11) NOT NULL,
    immatriculation int(11) DEFAULT NULL,
    nom varchar(50) COLLATE utf8_bin NOT NULL,
    logo varchar(50) COLLATE utf8_bin DEFAULT NULL,
    adresse varchar(50) COLLATE utf8_bin DEFAULT NULL,
    email varchar(50) COLLATE utf8_bin DEFAULT NULL,
    tel varchar(12) COLLATE utf8_bin DEFAULT NULL,
    logo_base64 longtext COLLATE utf8_bin,
    code_postal varchar(10) COLLATE utf8_bin DEFAULT NULL,
    maintenance int(11) DEFAULT 0,
    PRIMARY KEY (id)
);
DROP TABLE IF EXISTS notifications;
CREATE TABLE notifications
(
    id int(11) NOT NULL ,
    titel varchar(100) COLLATE utf8_bin DEFAULT NULL,
    messages varchar(300) COLLATE utf8_bin NOT NULL,
    users int(11) DEFAULT NULL,
    client int(11) DEFAULT NULL,
    date_notif datetime DEFAULT NULL,
    lut int(1) NOT NULL,
    PRIMARY KEY (id)
);
DROP TABLE IF EXISTS statut_incident;
CREATE TABLE statut_incident
(
    code int(11) NOT NULL,
    nom varchar(25) COLLATE utf8_bin NOT NULL,
    PRIMARY KEY (code)
);

DROP TABLE IF EXISTS tetatc;
CREATE TABLE tetatc
(
    id int(11) NOT NULL,
    code int(11) NOT NULL,
    nom varchar(100) NOT NULL,
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS tpriority;
CREATE TABLE tpriority
(
    id int(10) NOT NULL,
    numero int(10) NOT NULL,
    nom varchar(50) NOT NULL,
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS tsources;
CREATE TABLE tsources
(
    id int(11) NOT NULL,
    societe int(11) DEFAULT NULL,
    nom varchar(50) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY  (societe) REFERENCES societe(id)
);

DROP TABLE IF EXISTS trubriques;
CREATE TABLE trubriques
(
    id int(10) NOT NULL ,
    societe int(11) DEFAULT NULL,
    nom varchar(50) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY  (societe) REFERENCES societe(id)
);

DROP TABLE IF EXISTS tsrubriques;
CREATE TABLE tsrubriques
(
    id int(10) NOT NULL,
    nom varchar(150) NOT NULL,
    rubriqueid int(10) NOT NULL,
    delais int(11) DEFAULT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (rubriqueid) REFERENCES trubriques(id)
);

DROP TABLE IF EXISTS tcategorie;
CREATE TABLE tcategorie
(
    id int(11) NOT NULL,
    societe int(11) DEFAULT NULL,
    nom varchar(255) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (societe) REFERENCES societe(id)
);
DROP TABLE IF EXISTS tarticles;
CREATE TABLE tarticles
(
    id int(11) NOT NULL ,
    code varchar(20) DEFAULT NULL,
    categorie int(11) NOT NULL,
    nom varchar(255) NOT NULL,
    unite varchar(100) DEFAULT NULL,
    prix int(11) NOT NULL,
    stock int(11) DEFAULT NULL,
    photo longtext,
    chemin varchar(255) DEFAULT NULL,
    PRIMARY KEY (id) ,
    FOREIGN KEY  (categorie) REFERENCES categorie(id)
);
DROP TABLE IF EXISTS tregions;
CREATE TABLE tregions
(
    id int(10) NOT NULL,
    nom varchar(50) NOT NULL,
    mail varchar(50) DEFAULT NULL,
    tel1 varchar(50) DEFAULT NULL,
    tel2 varchar(50) DEFAULT NULL,
    societe int(11) DEFAULT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY  (societe) REFERENCES societe(id)
);
DROP TABLE IF EXISTS tdistricts;
CREATE TABLE tdistricts
(
    id int(11) NOT NULL ,
    nom varchar(50) NOT NULL,
    regionid int(10) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY  (regionid) REFERENCES tregions(id)
);
DROP TABLE IF EXISTS tsecteurs;
CREATE TABLE tsecteurs
(
    id int(10) NOT NULL,
    nom varchar(50) NOT NULL,
    districtid int(10) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (districtid) REFERENCES tdistricts(id)
);
DROP TABLE IF EXISTS tsites;
CREATE TABLE tsites
(
    id int(10) NOT NULL,
    nom varchar(255) NOT NULL,
    regionid int(10) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (regionid) REFERENCES tregions(id)
);

DROP TABLE IF EXISTS  tservices;
CREATE TABLE tservices
(
    id int(10) NOT NULL,
    nom varchar(50) NOT NULL,
    siteid int(10) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (siteid) REFERENCES  tsites(id)
);

DROP TABLE IF EXISTS ttypeclients;
CREATE TABLE ttypeclients
(
    id int(10) NOT NULL,
    societe int(11) DEFAULT NULL,
    nom varchar(255) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY  (societe) REFERENCES societe(id)
);

DROP TABLE IF EXISTS tclients;
CREATE TABLE tclients
(
    id int(11) NOT NULL,
    societe int(11) DEFAULT NULL,
    nom varchar(50) NOT NULL,
    prenom varchar(50) DEFAULT NULL,
    adresse varchar(100) DEFAULT NULL,
    telephone varchar(20) DEFAULT NULL,
    telephone2 varchar(20) DEFAULT NULL,
    mail varchar(50) DEFAULT NULL,
    datecreation datetime DEFAULT CURRENT_TIMESTAMP,
    datemodification datetime DEFAULT NULL,
    codeclient varchar(50) NOT NULL,
    mot_passe varchar(50) DEFAULT NULL,
    chgpwd int(1) NOT NULL,
    secteurid int(10) NOT NULL,
    typeclientid int(10) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY  (secteurid) REFERENCES tsecteurs(id),
    FOREIGN KEY (typeclientid) REFERENCES ttypeclients(id),
    FOREIGN KEY (societe) REFERENCES societe(id)
);

DROP TABLE IF EXISTS tcommandes;
CREATE TABLE tcommandes
(
    id int(11) NOT NULL,
    article int(11) NOT NULL,
    client int(11) NOT NULL,
    quantite int(11) NOT NULL,
    qt int(11) DEFAULT NULL,
    prix_total REAL DEFAULT null,
    commantaire1 varchar(255) DEFAULT NULL,
    commantaire varchar(255) DEFAULT NULL,
    numc int(11) DEFAULT NULL,
    datec datetime DEFAULT CURRENT_TIMESTAMP,
    date_echeance date DEFAULT NULL,
    datemodif datetime DEFAULT NULL,
    is_modif int(11) DEFAULT NULL,
    etat int(11) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (article) REFERENCES tarticles(id),
    FOREIGN KEY  (client) REFERENCES tclients(id)
);

DROP TABLE IF EXISTS tusers;
CREATE TABLE tusers (
  id int(10) NOT NULL,
  societe int(11) DEFAULT NULL,
  deleted tinyint(1) DEFAULT '0',
  logins varchar(20) NOT NULL,
  passwords varchar(50) NOT NULL,
  firstname varchar(40) NOT NULL,
  lastname varchar(40) DEFAULT NULL,
  mail varchar(50) DEFAULT NULL,
  phone varchar(30) DEFAULT NULL,
  fonction varchar(50) DEFAULT NULL,
  address1 varchar(100) DEFAULT NULL,
  disables int(1) DEFAULT NULL,
  chgpwd int(1) DEFAULT NULL,
  last_login datetime DEFAULT NULL,
  datecreation datetime DEFAULT CURRENT_TIMESTAMP,
  datemodification datetime DEFAULT NULL,
  serviceid int(10) NOT NULL,
  groupeid int(10) DEFAULT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (serviceid) REFERENCES tservices(id),
  FOREIGN KEY  (societe) REFERENCES societe(id)
);

DROP TABLE IF EXISTS tincidents;
CREATE TABLE tincidents (
  id int(11) NOT NULL,
  title varchar(255) NOT NULL,
  descriptions varchar(8000) NOT NULL,
  date_create datetime NOT NULL,
  date_hope date NOT NULL,
  date_modif datetime DEFAULT NULL,
  states int(11) DEFAULT NULL,
  creator int(10) DEFAULT NULL,
  prioriteid int(10) DEFAULT NULL,
  clientid int(10) NOT NULL,
  sourceid int(10) NOT NULL,
  srubriqueid int(10) NOT NULL,
  is_in_delais int(1) DEFAULT NULL,
  diffday int(11) DEFAULT NULL,
  description_fermeture varchar(255) DEFAULT NULL,
  date_fer datetime DEFAULT NULL,
  isaffect int(1) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (prioriteid) REFERENCES tpriority(id),
   FOREIGN KEY (clientid) REFERENCES tclients(id),
  FOREIGN KEY (sourceid) REFERENCES tsources(id),
  FOREIGN KEY (srubriqueid) REFERENCES tsrubriques(id),
  FOREIGN KEY (creator) REFERENCES tusers(id),
  FOREIGN KEY  (states) REFERENCES statut_incident(code)
) ;

DROP TABLE IF EXISTS userplainte;
CREATE TABLE userplainte (
  id int(10) NOT NULL,
  iduser int(10) NOT NULL,
  idplainte int(11) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY  (iduser) REFERENCES tusers(id),
  FOREIGN KEY (idplainte) REFERENCES tincidents(id)
);
DROP TABLE IF EXISTS ttraitement_ticket;
CREATE TABLE ttraitement_ticket (
  id int(11) NOT NULL,
  incident int(11) NOT NULL,
  iduser int(10) NOT NULL,
  commentaire text NOT NULL,
  date_comment datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (incident) REFERENCES tincidents(id),
  FOREIGN KEY (iduser) REFERENCES tusers(id)
);
