import { MatSnackBar } from "@angular/material/snack-bar";
import { dataPerfilUser } from './../providers/dataPerfilUser';
import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireDatabase } from "angularfire2/database";

@Component({
  selector: 'app-contact-perfil',
  templateUrl: './contact-perfil.component.html',
  styleUrls: ['./contact-perfil.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPerfilComponent implements OnInit {

  user = {};
  userName: any;
  userPhoto: any;
  profession: any;
  activities: any;
  userLogged: any;
  isMyContact: any;

  constructor(private dataPerfil: dataPerfilUser, private ref: ChangeDetectorRef,
    private angularFire: AngularFireDatabase, public snackBar: MatSnackBar) {

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.userLogged = user;

        var usr = this.dataPerfil.storage;
        var self = this;
        if (usr) {
          var dfRef = firebase.database().ref('users/' + usr.userId);
          dfRef.on('value', function (snapshot) {

            let usrPerfil = snapshot.val();
            self.userName =  usrPerfil != null ? usrPerfil.userName : self.dataPerfil.storage.userName;
            self.userPhoto = usrPerfil != null ? usrPerfil.userPhoto : self.dataPerfil.storage.userPhoto;
            self.profession = usrPerfil != null ? usrPerfil.profession : self.dataPerfil.storage.profession;
            self.activities = usrPerfil != null ? usrPerfil.activities : self.dataPerfil.storage.activities;
            self.verifyContact( usrPerfil ? usrPerfil : self.dataPerfil.storage);
            self.ref.detectChanges();
          });

        }
      }
    });

  }

  verifyContact(userPerfil) {
    let self = this;

    var dfRef = firebase.database().ref('users/' + this.userLogged.uid);
    dfRef.on('value', function (snapshot) {

      let usr = snapshot.val();
      let contacts =  usr.friends;
      for (var key in contacts) {
        if (contacts[key].id == userPerfil.id) {
          self.isMyContact = true;
          return;
        }

      }

    })
  }

  doContact() {

    var obj = {
      id: this.dataPerfil.storage.userId,
      userPhoto: this.dataPerfil.storage.userPhoto,
      userName: this.dataPerfil.storage.userName
    }
    this.updateItem(this.dataPerfil.storage.userId, obj);
  }

  removeContact() {
    this.angularFire.object("users/" + this.userLogged.uid + "/friends/" + this.dataPerfil.storage.userId)
      .remove().then((t: any) => {
        this.isMyContact = false;
        this.openSnackBar("Removido dos meus contatos.");
        this.ref.detectChanges();
      }),
      (e: any) => console.log(e.message);
  }

  updateItem(key: string, value: any): void {
    this.angularFire.object("users/" + this.userLogged.uid + "/friends/" + key)
      .update(value).then((t: any) => {
        this.openSnackBar("Adicionado aos meus contatos.");
      }),
      (e: any) => console.log(e.message);
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "", {
      duration: 2000,
    });
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.dataPerfil.storage = {};
  }

}
