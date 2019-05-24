import { Injectable } from "@angular/core";
import { StarPRNT } from "@ionic-native/star-prnt/ngx";
import { Printer, PrintOptions } from "@ionic-native/printer/ngx";
import { AlertController, Platform } from "@ionic/angular";
import { File } from "@ionic-native/file/ngx";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { BluetoothSerial } from "@ionic-native/bluetooth-serial/ngx";
import { commands } from "../printer-commands";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { DateProvider } from "../../service/date";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { MutableBuffer } from "mutable-buffer";
@Injectable({
  providedIn: "root"
})
export class PrinterService {
  options: PrintOptions = {
    name: "MyDocument",
    printerId: "printer007",
    duplex: true,
    landscape: true,
    grayscale: true
  };
  buff = new MutableBuffer(1024, 1024);
  pdfObj = null;
  societe: any;
  address: any;
  ristournes=0;
  constructor(
    private starprnt: StarPRNT,
    private printer: Printer,
    public alert: AlertController,
    public plt: Platform,
    private file: File,
    private fileOpener: FileOpener,
    private dateP: DateProvider,
    private btSerial: BluetoothSerial
  ) {
    if (localStorage.getItem("societe")) {
      this.societe = JSON.parse(localStorage.getItem("societe"));
    }
  }
  searchBt(commande?: any) {
    let that = this;
    if (commande) {
      this.createCommandePdfMiniPrint(commande);
      console.log(this.buff);
      if (this.plt.is("cordova")) {
        this.btSerial.list().then(async dataList => {
          let allPrint = [];
          for (let i = 0; i < dataList.length; i++) {
            allPrint.push({
              name: "idPrinter",
              type: "radio",
              label: dataList[i].name,
              value: dataList[i].id
            });
          }
          const alert = await that.alert.create({
            header: "Imprimantes",
            inputs: allPrint,
            buttons: [
              {
                text: "Cancel",
                role: "cancel",
                cssClass: "secondary",
                handler: () => {}
              },
              {
                text: "Ok",
                handler: data => {
                  that.address = data;
                  that.Printer(this.buff.buffer);
                }
              }
            ]
          });

          alert.present();
        });
      }
    }
  }

  connectBT(address) {
    return this.btSerial.connect(address);
  }
  async presentAlert(msg) {
    let mno = await this.alert.create({
      header: msg,
      buttons: ["OK"]
    });
  }
  Printer(dataToPrint) {
    if (this.plt.is("cordova")) {
      let xyz = this.connectBT(this.address).subscribe(
        data => {
          this.btSerial.write(this.buff.buffer).then(
            dataz => {
              this.presentAlert("Print SUCCESS!");
              this.buff.clear();
              xyz.unsubscribe();
            },
            errx => {
              this.presentAlert("ERROR " + errx);
              this.buff.clear();
              xyz.unsubscribe();
            }
          );
        },
        err => {
          this.presentAlert("ERROR " + err);
          this.buff.clear();
        }
      );
    }
  }

  public printDocumentBTPrinter(commande,ristourne) {
    this.ristournes=ristourne;
    this.searchBt(commande);
  }
  public printDocument() {
    this.starprnt
      .portDiscovery("all")
      .then((res: any) => alert(res))
      .catch((error: any) => console.error(error));
  }

  /**
   *
   * @param port
   * @description emulation valu "StarPRNT", "StarPRNTL", "StarLine", "StarGraphic", "EscPos", "EscPosMobile", "StarDotImpact"
   */

  printWithStartPrinter(port, printObj, emulation?: "StarPRNT") {
    this.starprnt.printRawText(port, emulation, printObj);
  }
  printwithPrinter(commande,ristourne) {
    this.ristournes=ristourne;
    let that = this;
    /* this.printer.isAvailable().then(
      resp => {
        that.printer
          .print(content, this.options)
          .then(onSuccess => {}, onError => {});
      },
      err => {}
    ); */
    this.downloadPdf(commande);
  }
  createCommandePdfMiniPrint(LCommande): any {
    // u can remove this when generate the receipt using another method
    let receipt = "";
    if (this.societe.nom) {
      this.buff.write(commands.HARDWARE.HW_INIT);
      this.buff.write(commands.TEXT_FORMAT.TXT_NORMAL);
      this.buff.write(commands.TEXT_FORMAT.TXT_BOLD_ON);
      this.buff.write(commands.TEXT_FORMAT.TXT_ALIGN_CT);
      this.buff.write(this.societe.nom);
      this.buff.write(commands.EOL);
    }
    this.buff.write(commands.TEXT_FORMAT.TXT_NORMAL);
    this.buff.write(commands.TEXT_FORMAT.TXT_BOLD_ON);
    this.buff.write(commands.TEXT_FORMAT.TXT_ALIGN_LT);
    this.buff.write("commande: " + LCommande.id);
    this.buff.write(commands.EOL);
    this.buff.write(commands.TEXT_FORMAT.TXT_NORMAL);
    this.buff.write(commands.TEXT_FORMAT.TXT_BOLD_ON);
    this.buff.write(commands.TEXT_FORMAT.TXT_ALIGN_LT);
    this.buff.write("client: " + LCommande.client.nom);
    this.buff.write(commands.EOL);
    this.buff.write(commands.TEXT_FORMAT.TXT_NORMAL);
    this.buff.write(commands.TEXT_FORMAT.TXT_ALIGN_LT);
    this.buff.write("date: " + LCommande.datecc);
    this.buff.write(commands.EOL);
    this.buff.write(commands.TEXT_FORMAT.TXT_NORMAL);
    this.buff.write(commands.TEXT_FORMAT.TXT_ALIGN_LT);
    this.buff.write("livraison: " + LCommande.dateliv);
    this.buff.write(commands.EOL);
    this.buff.write(commands.TEXT_FORMAT.TXT_ALIGN_LT);
    this.buff.write("Statut : " + LCommande.etatc.nom);

    //tableau des produits
    let total = 0;
    let totalP = 0;
    this.buff.write(commands.EOL + commands.EOL);
    this.buff.write(commands.TEXT_FORMAT.TXT_NORMAL);
    this.buff.write(commands.TEXT_FORMAT.TXT_ALIGN_LT);
    this.buff.write(commands.TEXT_FORMAT.TXT_BOLD_ON);
    this.buff.write("Produits \n");

    this.buff.write(commands.EOL);
    this.buff.write(commands.TEXT_FORMAT.TXT_NORMAL);
    this.buff.write(commands.TEXT_FORMAT.TXT_ALIGN_LT);
    this.buff.write(commands.TEXT_FORMAT.TXT_BOLD_ON);
    this.buff.write("Article \t\t  ");
    this.buff.write(commands.TEXT_FORMAT.TXT_BOLD_OFF);
    this.buff.write(commands.TEXT_FORMAT.TXT_NORMAL);
    this.buff.write(commands.TEXT_FORMAT.TXT_BOLD_ON);
    this.buff.write("Quantite \t\t  ");
    this.buff.write(commands.TEXT_FORMAT.TXT_BOLD_OFF);
    this.buff.write(commands.TEXT_FORMAT.TXT_NORMAL);
    this.buff.write(commands.TEXT_FORMAT.TXT_BOLD_ON);
    this.buff.write("Prix \n");
    this.buff.write(commands.TEXT_FORMAT.TXT_BOLD_OFF);
    this.buff.write(commands.EOL);
    if (LCommande.tcommandesList) {
      var Article = LCommande.tcommandesList.filter(function(elt) {
        return (
          !elt.article.code.includes("VRAP") &&
          !elt.article.code.includes("VRACC")
        );
      });
      var emballage = LCommande.tcommandesList.filter(function(elt) {
        return (
          elt.article.code.includes("VRAP") ||
          elt.article.code.includes("VRACC")
        );
      });
      for (let i = 0; i < Article.length; i++) {
        let item = Article[i];
        this.buff.write(commands.TEXT_FORMAT.TXT_NORMAL);
        this.buff.write(commands.TEXT_FORMAT.TXT_ALIGN_LT);
        this.buff.write(item.article.code + "\t\t  ");
        this.buff.write(commands.TEXT_FORMAT.TXT_NORMAL);
        this.buff.write(this.formatNumber(item.quantite) + "\t\t  ");
        this.buff.write(commands.TEXT_FORMAT.TXT_NORMAL);
        this.buff.write(this.formatNumber(item.prixTotal + "\n"));
        total += item.prixTotal;
        totalP += item.quantite;
      }

      this.buff.write(commands.EOL + commands.EOL);
      this.buff.write(commands.TEXT_FORMAT.TXT_NORMAL);
      this.buff.write(commands.TEXT_FORMAT.TXT_ALIGN_LT);
      this.buff.write(commands.TEXT_FORMAT.TXT_BOLD_ON);
      this.buff.write("Emballages \n");
      for (let i = 0; i < emballage.length; i++) {
        let item = emballage[i];
        this.buff.write(commands.TEXT_FORMAT.TXT_NORMAL);
        this.buff.write(commands.TEXT_FORMAT.TXT_ALIGN_LT);
        this.buff.write(item.article.code + "\t\t  ");
        this.buff.write(commands.TEXT_FORMAT.TXT_NORMAL);
        this.buff.write(this.formatNumber(item.quantite) + "\t\t  ");
        this.buff.write(commands.TEXT_FORMAT.TXT_NORMAL);
        this.buff.write(this.formatNumber(item.prixTotal + "\n"));
        total += item.prixTotal;
        totalP += item.quantite;
      }
    }

    //pied de page
    this.buff.write(commands.EOL);
    this.buff.write(commands.HORIZONTAL_LINE.HR_58MM);
    this.buff.write(commands.EOL);
    this.buff.write(commands.TEXT_FORMAT.TXT_NORMAL);
    this.buff.write(commands.TEXT_FORMAT.TXT_ALIGN_LT);
    this.buff.write(commands.TEXT_FORMAT.TXT_BOLD_ON);
    this.buff.write('Qte Produit : ' + this.formatNumber(totalP));
    this.buff.write(commands.EOL);
    this.buff.write(commands.TEXT_FORMAT.TXT_NORMAL);
    this.buff.write(commands.TEXT_FORMAT.TXT_ALIGN_LT);
    this.buff.write(commands.TEXT_FORMAT.TXT_BOLD_ON);
    this.buff.write('Total : ' + this.formatNumber(total)+' FCFA');
   
    const pourcentage = 1.2425;
    var totalHT = Math.round(total / pourcentage);
    var tva = Math.round(totalHT * (19.25 / 100));
    var prov = Math.round(totalHT * (5 / 100));
    this.buff.write(commands.EOL);
    this.buff.write(commands.HORIZONTAL_LINE.HR_58MM);
    this.buff.write(commands.EOL);
    this.buff.write(commands.TEXT_FORMAT.TXT_NORMAL);
    this.buff.write(commands.TEXT_FORMAT.TXT_ALIGN_LT);
    this.buff.write(commands.TEXT_FORMAT.TXT_BOLD_ON);
    this.buff.write('Montant HT : \t' + this.formatNumber(totalHT)+' FCFA');
    this.buff.write(commands.EOL);
    this.buff.write(commands.TEXT_FORMAT.TXT_NORMAL);
    this.buff.write(commands.TEXT_FORMAT.TXT_ALIGN_LT);
    this.buff.write(commands.TEXT_FORMAT.TXT_BOLD_ON);
    this.buff.write('Retenu TVA(19,25%) : \t' + this.formatNumber(tva)+' FCFA');
    this.buff.write(commands.EOL);
    this.buff.write(commands.TEXT_FORMAT.TXT_NORMAL);
    this.buff.write(commands.TEXT_FORMAT.TXT_ALIGN_LT);
    this.buff.write(commands.TEXT_FORMAT.TXT_BOLD_ON);
    this.buff.write('PSA(5%) : \t' + this.formatNumber(prov)+' FCFA');
    this.buff.write(commands.EOL);
    this.buff.write(commands.TEXT_FORMAT.TXT_NORMAL);
    this.buff.write(commands.TEXT_FORMAT.TXT_ALIGN_LT);
    this.buff.write(commands.TEXT_FORMAT.TXT_BOLD_ON);
    this.buff.write('Montant TTC : \t' + this.formatNumber(total)+' FCFA');
    this.buff.write(commands.EOL);
    this.buff.write(commands.HORIZONTAL_LINE.HR_58MM);
    this.buff.write(commands.EOL);
    if (LCommande.transport) {
      total +=LCommande.transport;
      this.buff.write(commands.EOL);
    this.buff.write(commands.TEXT_FORMAT.TXT_NORMAL);
    this.buff.write(commands.TEXT_FORMAT.TXT_ALIGN_LT);
    this.buff.write(commands.TEXT_FORMAT.TXT_BOLD_ON);
    this.buff.write('Transport : \t' + this.formatNumber(LCommande.transport)+' FCFA');
    }
    this.buff.write(commands.EOL);
    this.buff.write(commands.TEXT_FORMAT.TXT_NORMAL);
    this.buff.write(commands.TEXT_FORMAT.TXT_ALIGN_CT);
    this.buff.write(commands.TEXT_FORMAT.TXT_BOLD_ON);
    this.buff.write('NET A PAYER : \t' + this.formatNumber(total)+' FCFA');
    this.buff.write(commands.EOL);
    this.buff.write(commands.TEXT_FORMAT.TXT_NORMAL);
    this.buff.write(commands.TEXT_FORMAT.TXT_ALIGN_LT);
    this.buff.write(commands.TEXT_FORMAT.TXT_BOLD_ON);
    if (LCommande.margeClient) {
      this.buff.write('Rist encours : \t' + this.formatNumber(LCommande.margeClient)+' FCFA');
      this.buff.write(commands.EOL);
      this.buff.write('Total Rist : \t' + this.formatNumber(this.ristournes)+' FCFA');
    }
    this.buff.write(commands.EOL);
    this.buff.write(commands.TEXT_FORMAT.TXT_NORMAL);
    this.buff.write(commands.TEXT_FORMAT.TXT_ALIGN_CT);
    this.buff.write(commands.TEXT_FORMAT.TXT_BOLD_ON);
    this.buff.write('\t\t SIGNATURE  \t');
    this.buff.write(commands.EOL);
    this.buff.write(commands.TEXT_FORMAT.TXT_NORMAL);
    this.buff.write(commands.TEXT_FORMAT.TXT_ALIGN_LT);
    this.buff.write(commands.TEXT_FORMAT.TXT_BOLD_ON);
    this.buff.write('VENDEUR     \t\t       CLIENT');
    this.buff.write(commands.EOL);
    this.buff.write(commands.EOL);
    this.buff.write(commands.EOL);
    this.buff.write(commands.EOL);
    this.buff.write(commands.EOL);
    this.buff.write(commands.EOL);
    this.buff.write(commands.TEXT_FORMAT.TXT_NORMAL);
    this.buff.write(commands.TEXT_FORMAT.TXT_ALIGN_CT);
    this.buff.write(commands.TEXT_FORMAT.TXT_BOLD_ON);
    this.buff.write('MERCI DE VOTRE CONFIANCE !!!');
    
    //code bar
    /* const obj= {
      id:btoa(LCommande.id),
      type:'commande'
    };
    const qr =JSON.stringify(obj);
    this.buff.write(commands.CODE2D_FORMAT.CODE2D);
    this.buff.writeUInt8(3);
    this.buff.writeUInt8(3);
    this.buff.writeUInt8(8);
    this.buff.writeUInt16LE(qr.length);
    this.buff.write(qr); */
    //secure space on footer
    this.buff.write(commands.EOL);
    this.buff.write(commands.EOL);
    this.buff.write(commands.EOL);
    this.buff.write(commands.EOL);
    this.buff.write(commands.PAPER.PAPER_FULL_CUT);
    this.buff.write(commands.HARDWARE.HW_INIT);
    this.buff.flush();
  }

  createCommandePdf(commande) {
    var docDefinition;
    var firstdata = commande;
    let that = this;
    docDefinition = {
      info: {
        title: "OCM DOCUMENT",
        author: "Lalanda from EH2S",
        subject: "subject of document",
        keywords: "keywords for document"
      },
      pageMargins: [20, 30, 20, 30],
      pageSize: "A4",
      header: function(currentPage, pageCount) {
        var tfoo = {
          columns: [
            {
              text: "" + that.getDate(),
              alignment: "left",
              style: "footerleft"
            },
            {
              text: currentPage.toString() + " / " + pageCount,
              alignment: "right",
              style: "footer"
            }
          ]
        };
        return tfoo;
      },
      footer: function(currentPage, pageCount) {
        var tfoo = {
          columns: [
            {
              text: "" + that.getDate(),
              alignment: "left",
              style: "footerleft"
            },
            {
              text: " ",
              alignment: "center",
              style: "footercenter",
              link: "https://www.eh2s.com"
            },
            {
              text: currentPage.toString() + " / " + pageCount,
              alignment: "right",
              style: "footer"
            }
          ]
        };
        return tfoo;
      },
      content: that.getContentCommande(firstdata),
      pageBreakBefore: function(
        currentNode,
        followingNodesOnPage,
        nodesOnNextPage,
        previousNodesOnPage
      ) {
        return (
          currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0
        );
      },
      styles: {
        img: {
          margin: [0, 0, 0, 0]
        },
        header_center_top: {
          fontSize: 12,
          bold: true,
          margin: [35, 5, 0, 10],
          alignment: "center"
        },
        header_center_bottom: {
          bold: false,
          margin: [0, 0, 0, 0]
        },
        subheader: {
          fontSize: 12,
          bold: true,
          margin: [80, 0, 0, 0]
        },
        headertable: {
          margin: [0, 20, 0, 10]
        },
        title: {
          fontSize: 12,
          bold: true,
          alignment: "center"
        },
        subtitle: {
          fontSize: 10,
          bold: false,
          margin: [170, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 0]
        },
        tableHeader: {
          bold: true,
          fontSize: 10
        },
        tableFooter: {
          bold: true,
          fontSize: 12,
          margin: [0, 7, 0, 10]
        },
        tableContent: {
          bold: false,
          fontSize: 9,
          margin: [0, 0, 0, 0]
        },
        footer: {
          bold: true,
          fontSize: 8,
          margin: [0, 0, 20, 0]
        },
        footerleft: {
          bold: true,
          fontSize: 8,
          margin: [20, 0, 0, 0]
        },
        footercenter: {
          bold: true,
          fontSize: 8,
          margin: [0, 0, 0, 0]
        }
      },
      defaultStyle: {
        // alignment: 'justify'
      }
    };
    this.pdfObj = pdfMake.createPdf(docDefinition);
  }
  downloadPdf(commande) {
    const name = "commande_" + this.dateP.getDate() + ".pdf";
    this.createCommandePdf(commande);
    if (this.plt.is("cordova")) {
      this.pdfObj.getBuffer(buffer => {
        var utf8 = new Uint8Array(buffer);
        var binaryArray = utf8.buffer;
        var blod = new Blob([binaryArray], { type: "application/pdf" });
        this.file
          .writeFile(this.file.dataDirectory, name, blod, {
            replace: true
          })
          .then(fileEntry => {
            this.fileOpener.open(
              this.file.dataDirectory + name,
              "application/pdf"
            );
          });
      });
    } else {
      this.pdfObj.download(name);
    }
  }
  getContentCommande(data) {
    var content = new Array();
    let img: any;
    if (this.societe.logo) {
      img = {
        // if you specify width, image will scale proportionally
        image: "data:image/png;base64," + this.societe.logo,
        width: 70,
        height: 70,
        style: "img"
      };
    } else {
      img = {
        // if you specify width, image will scale proportionally
        text: "",
        width: 70,
        height: 70,
        style: "img"
      };
    }
    content.push({
      style: "headertable",
      table: {
        widths: ["*", "auto", "*"],
        body: [
          [
            img,
            [
              { text: this.societe.nom, style: "header_center_top" },
              {
                text: this.societe.email + "\t Tel : " + this.societe.tel,
                style: "header_center_bottom",
                alignment: "center"
              }
            ],
            { text: "", style: "subheader" }
          ]
        ]
      },
      layout: {
        hLineWidth: function(i, node) {
          return i === 0 || i === node.table.body.length ? 2 : 1;
        },
        vLineWidth: function(i, node) {
          return i === 0 || i === node.table.widths.length ? 2 : 1;
        },
        hLineColor: function(i, node) {
          return i === 0 || i === node.table.body.length ? "black" : "white";
        },
        vLineColor: function(i, node) {
          return i === 0 || i === node.table.widths.length ? "black" : "white";
        }
      }
    });

    var header = {
      margin: [30, 10, 0, 10],
      text: [
        {
          text: "FICHE LIVRAISON \t N° " + data.id,
          fontSize: 15,
          italics: true,
          bold: true,
          alignment: "center"
        }
      ]
    };
    content.push(header);
    const colun1 = {
      columns: [
        {
          width: "*",
          text: [
            {
              text: "Info Client \n\n",
              bold: true,
              alignment: "center",
              color: "#36cee2",
              margin: [0, 10, 0, 40]
            },
            { text: "Nom : \t", bold: true },
            { text: data.client.nom + " \n" },
            { text: "Tel : \t", bold: true },
            { text: data.client.tel }
          ]
        },
        {
          width: 70,
          text: ""
        },
        {
          width: "*",
          text: [
            {
              text: "Detail commande \n\n",
              bold: true,
              alignment: "center",
              color: "#36cee2"
            },
            { text: "Crée le : \t", bold: true },
            { text: data.datecc + " \n" },
            { text: "Echeance : \t", bold: true },
            { text: data.dateliv + " \n" },
            { text: "Statut : \t", bold: true },
            { text: data.etatc.nom + " \n" }
          ]
        }
      ]
    };
    content.push(colun1);

    var total = 0;
    var totalP = 0;
    var bodyCMD = [
      [
        { text: "code", bold: true },
        { text: "Article", bold: true },
        { text: "P.U", bold: true },
        { text: "Qte", bold: true },
        { text: "P.T", bold: true }
      ]
    ];
    for (var i = 0; i < data.tcommandesList.length; i++) {
      var cmd = [];
      var item = data.tcommandesList[i];
      cmd.push({ text: item.article.code });
      cmd.push({ text: item.article.nom, fontSize: 9 });
      cmd.push({ text: "" + this.formatNumber(item.prix), fontSize: 9 });
      cmd.push({ text: "" + this.formatNumber(item.quantite), fontSize: 9 });
      cmd.push({ text: "" + this.formatNumber(item.prixTotal), fontSize: 9 });
      total += item.prixTotal;
      totalP += item.quantite;
      bodyCMD.push(cmd);
    }

    var description = {
      style: "headertable",
      table: {
        widths: ["auto", "*", "auto", "auto", "auto"],
        body: bodyCMD,
        pageBreak: "after",
        margin: [0, 0, 20, 0]
      }
    };
    content.push(description);
    content.push({
      text: "Qte Total : " + this.formatNumber(totalP),
      bold: true,
      color: "#00b5b8"
    });
    content.push({
      text: "Total : " + this.formatNumber(total),
      bold: true,
      color: "#00b5b8"
    });
    content.push({ text: "\n\n" });
    const colun2 = {
      columns: [
        {
          width: "*",
          text: "Vendeur",
          bold: true
        },
        {
          width: "*",
          text: ""
        },
        {
          width: "*",
          text: "Client",
          bold: true
        }
      ]
    };
    content.push(colun2);
    const obj = {
      id: btoa(data.id),
      type: "commande"
    };
    const qr = JSON.stringify(obj);
    content.push({ qr: qr, alignment: "center", fit: 50 });
    return content;
  }
  noSpecialChars(string) {
    var translate = {
        à: "a",
        á: "a",
        â: "a",
        ã: "a",
        ä: "a",
        å: "a",
        æ: "a",
        ç: "c",
        è: "e",
        é: "e",
        ê: "e",
        ë: "e",
        ì: "i",
        í: "i",
        î: "i",
        ï: "i",
        ð: "d",
        ñ: "n",
        ò: "o",
        ó: "o",
        ô: "o",
        õ: "o",
        ö: "o",
        ø: "o",
        ù: "u",
        ú: "u",
        û: "u",
        ü: "u",
        ý: "y",
        þ: "b",
        ÿ: "y",
        ŕ: "r",
        À: "A",
        Á: "A",
        Â: "A",
        Ã: "A",
        Ä: "A",
        Å: "A",
        Æ: "A",
        Ç: "C",
        È: "E",
        É: "E",
        Ê: "E",
        Ë: "E",
        Ì: "I",
        Í: "I",
        Î: "I",
        Ï: "I",
        Ð: "D",
        Ñ: "N",
        Ò: "O",
        Ó: "O",
        Ô: "O",
        Õ: "O",
        Ö: "O",
        Ø: "O",
        Ù: "U",
        Ú: "U",
        Û: "U",
        Ü: "U",
        Ý: "Y",
        Þ: "B",
        Ÿ: "Y",
        Ŕ: "R"
      },
      translate_re = /[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþßàáâãäåæçèéêëìíîïðñòóôõöøùúûýýþÿŕŕÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÝÝÞŸŔŔ]/gim;
    return string.replace(translate_re, function(match) {
      return translate[match];
    });
  }
  formatNumber(number) {
    let formated = "";
    let format = number.toString();
    let count = 0;
    for (let i = format.length - 1; i >= 0; i--) {
      if (count % 3 === 0) {
        if (i === format.length - 1) {
          formated = format[i];
        } else {
          formated = format[i] + "." + formated;
        }
      } else {
        formated = format[i] + formated;
      }
      count++;
    }
    return formated;
  }

  getDate() {
    var date = new Date();
    var jour = date.getDate().toString();
    var mois = (date.getMonth() + 1).toString();
    var heure = date.getHours().toString();
    var min = date.getMinutes().toString();
    var sec = date.getSeconds().toString();
    if (date.getDate() + 1 < 10) {
      jour = "0" + date.getDate();
    }

    if (date.getMonth() + 1 < 10) {
      mois = "0" + (date.getMonth() + 1);
    }
    if (date.getHours() + 1 < 10) {
      heure = "0" + (heure + 1);
    }
    if (date.getMinutes() + 1 < 10) {
      min = "0" + (min + 1);
    }
    if (date.getSeconds() + 1 < 10) {
      sec = "0" + (sec + 1);
    }
    return (
      jour +
      "/" +
      mois +
      "/" +
      date.getFullYear() +
      "  " +
      heure +
      ":" +
      min +
      ":" +
      sec
    );
  }
}
