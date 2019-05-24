import { Injectable } from "@angular/core";
import { CallNumber } from "@ionic-native/call-number/ngx";
import {
  Contacts,
  Contact,
  ContactField,
  ContactName
} from "@ionic-native/contacts/ngx";
import { SMS } from "@ionic-native/sms/ngx";
@Injectable({
  providedIn: "root"
})
export class PhoneService {
  constructor(
    private callNumber: CallNumber,
    private contacts: Contacts,
    private sms: SMS
  ) {}

  CallNumber(number) {
    this.callNumber
      .callNumber(number, true)
      .then(res => console.log("Launched dialer!", res))
      .catch(err => console.log("Error launching dialer", err));
  }
   SaveContact(member) {
    const contact: Contact = this.contacts.create();

    contact.name = new ContactName(null, member.nom, null);
    contact.phoneNumbers = [new ContactField("mobile", member.tel)];
    return contact
      .save()
      .then(
        () => console.log("Contact saved!", contact),
        (error: any) => console.error("Error saving contact.", error)
      );
  }

  public sendMessage(option): Promise<any> {
    // Send a text message using default options
   return this.sms.send(option.number, option.message);
  }
}
