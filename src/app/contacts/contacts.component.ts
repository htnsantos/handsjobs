import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFireAuth } from "angularfire2/auth";
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { AngularFireDatabase, AngularFireAction } from "angularfire2/database";
import { UsersComponent } from "../users/users.component";
import { dataPerfilUser } from './../providers/dataPerfilUser';


@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ContactsComponent implements OnInit {

  contacts: Observable<AngularFireAction<firebase.database.DataSnapshot>[]>;

  constructor(public afAuth: AngularFireAuth, private angularFire: AngularFireDatabase,
    private userComp: UsersComponent, private dataPerfil: dataPerfilUser, private router: Router) {

    this.showContacts(this.userComp.category);
  }

  showContacts(category) {
    let arr = [];

    this.contacts =
      this.angularFire.list("users"
      ).valueChanges()
  }

  selectedPerfil(contactSelected) {
    this.dataPerfil.storage = contactSelected;      
    this.router.navigate(['/contact-perfil', this.removeAccentue(contactSelected.userName.replace(" ", "."))]);
  }

   removeAccentue(s) {
    var r = s.toLowerCase();
    r = r.replace(new RegExp("\\s", 'g'), ".");
    r = r.replace(new RegExp("[àáâãäå]", 'g'), "a");
    r = r.replace(new RegExp("æ", 'g'), "ae");
    r = r.replace(new RegExp("ç", 'g'), "c");
    r = r.replace(new RegExp("[èéêë]", 'g'), "e");
    r = r.replace(new RegExp("[ìíîï]", 'g'), "i");
    r = r.replace(new RegExp("ñ", 'g'), "n");
    r = r.replace(new RegExp("[òóôõö]", 'g'), "o");
    r = r.replace(new RegExp("œ", 'g'), "oe");
    r = r.replace(new RegExp("[ùúûü]", 'g'), "u");
    r = r.replace(new RegExp("[ýÿ]", 'g'), "y");
    r = r.replace(new RegExp("\\W", 'g'), ".");
    return r;
  }


  ngOnInit() {
  }

}
