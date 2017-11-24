import { dataPerfilUser } from './../providers/dataPerfilUser';
import { ContactPerfilComponent } from './../contact-perfil/contact-perfil.component';
import { MyServicesComponent } from './../my-services/my-services.component';
import { MessagesListComponent } from './../messages-list/messages-list.component';
import { ChamadosListComponent } from './../chamados/chamados-list/chamados-list.component';
import { AngularFireDatabase, AngularFireAction } from 'angularfire2/database';
import { Chamado } from './../model/chamado';
import { AuthGuard } from './../auth.service';
import { Component, OnInit, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import * as $ from 'jquery';
import { Router, NavigationExtras } from '@angular/router';
import { moveIn, fallIn, moveInLeft } from '../router.animations';
import { NgForm, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from "@angular/material/snack-bar";


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  animations: [moveIn(), fallIn(), moveInLeft()],
  host: { '[@moveIn]': '' }

})
export class UsersComponent implements OnInit {

  userLogged: any;
  state: string = '';
  chamados: Array<any>;
  initialScreen = true;
  category: any;
  typeControl = new FormControl('', [Validators.required]);
  messages: Observable<AngularFireAction<firebase.database.DataSnapshot>[]>;
  categorySelectEmitter = new EventEmitter<any>();

  batch = 2         // size of each query
  lastKey = ''      // key to offset next query from
  finished = false  // boolean when end of database is reached

  types = [
    { name: 'Oferecer', id: 'oferecer' },
    { name: 'Procurar', id: 'procurar' }
  ];

  constructor(public afAuth: AngularFireAuth, private router: Router,
    private authGuard: AuthGuard, private angularFire: AngularFireDatabase,
    public snackBar: MatSnackBar, private ref: ChangeDetectorRef, private dataPerfil: dataPerfilUser) {

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.userLogged = user;
      }
    });

  }

  categorySelected(nameCategory) {
    this.initialScreen = false;
    this.category = nameCategory;
    this.showCategory(nameCategory);
    this.categorySelectEmitter.emit(nameCategory);
  }

  showCategory(category) {

    let query = {
      orderByKey: true,
      limitToFirst: this.batch,
    }
    this.messages =
      this.angularFire.list(category
      ).valueChanges()

  }

  loadCollapse() {

    $('.panel-collapse').on('show.bs.collapse', function () {
      $(this).siblings('.panel-heading').addClass('active');
    });

    $('.panel-collapse').on('hide.bs.collapse', function () {
      $(this).siblings('.panel-heading').removeClass('active');
    });
  }

  doPublish(formData) {

    if (formData.valid) {
      var date = new Date();
      var self = this;
      this.angularFire.list(this.category).push({
        nome: formData.value.message,
        type: formData.value.type,
        userPhoto: this.userLogged.photoURL,
        userName: this.userLogged.displayName,
        userId: this.userLogged.uid,
        date: date.getTime()
      }).then((t: any) => {
        var obj = {
          id: t.key
        }
        this.updateItem(t.key, obj);

      }),
        (e: any) => console.log(e.message);
      this.openSnackBar("Mensagem publicada com sucesso")
      this.cleanFields(formData);
    }
  }

  doInterest(publish) {
    var date = new Date();
    var self = this;
    this.angularFire.list("users/" + this.userLogged.uid + "/interesses/" + this.category).push(
      publish
    ).then((t: any) => {
      var obj = {
        interessados: {
          userName: this.userLogged.userName,
          userPhoto: this.userLogged.userPhoto
        }
      }
      this.updateListInterest(publish.id, obj);
    }),
      (e: any) => console.log(e.message);
    this.openSnackBar("Mostrei Interesse")

  }

  updateListInterest(key: string, value: any): void {

    this.angularFire.list(this.category + "/" + key + "/interessados").push({
      userName: this.userLogged.displayName,
      userPhoto: this.userLogged.photoURL,
      userId: this.userLogged.uid
    }).then((t: any) => {
      var obj = {
        id: t.key
      }
    }),
      (e: any) => console.log(e.message);
  }

  updateItem(key: string, value: any): void {
    this.angularFire.object(this.category + "/" + key)
      .update(value).then((t: any) => {
        console.log("dados atualizados");
      }),
      (e: any) => console.log(e.message);
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "", {
      duration: 2000,
    });
  }

  cleanFields(formData) {
    formData.form.controls.message.setValue('');
    formData.form.controls.type.setValue('');
  }

  selectUserperfil(contactSelected) {
    
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


  onScroll() {
    console.log('scrolled!!')
    //this.showCategory(this.category)
  }

  ngOnInit() {
    this.chamados = new Array<any>();
    this.loadCollapse();
  }

}
