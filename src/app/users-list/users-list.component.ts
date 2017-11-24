import { element } from 'protractor';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from "rxjs/Rx";
import { AngularFireAction, AngularFireDatabase } from "angularfire2/database";
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UsersListComponent implements OnInit {

  usuarios: Observable<AngularFireAction<firebase.database.DataSnapshot>[]>;
  messages: Observable<AngularFireAction<firebase.database.DataSnapshot>[]>;

  total_popups = 0;
  popups = [];
  userLogged: any;

  constructor(private db: AngularFireDatabase) {

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.userLogged = user;
        this.usuarios =
          db.list('/users/'+user.uid +"/friends"
          ).valueChanges()
      }
    });

  }

  //Popup Chat

  removePopup = function (array, from, to) {
    var rest = array.slice((to || from) + 1 || array.length);
    array.length = from < 0 ? array.length + from : from;
    return array.push.apply(array, rest);
  }

  //this is used to close a popup
  close_popup(id) {
    for (var iii = 0; iii < window["popups"].length; iii++) {
      if (window["idUser"] == window["popups"][iii]) {
        window["sel"].removePopup(window["popups"], iii, undefined);

        document.getElementById(window["idUser"]).style.display = "none";

        window["sel"].calculate_popups();

        return;
      }
    }
  }

  display_popups() {
    var right = 250;

    var iii = 0;
    for (iii; iii < this.total_popups; iii++) {
      if (this.popups[iii] != undefined) {
        var element = document.getElementById(this.popups[iii]);
        element.style.right = right + "px";
        right = right + 320;
        element.style.display = "block";
      }
    }

    for (var jjj = iii; jjj < this.popups.length; jjj++) {
      var element = document.getElementById(this.popups[jjj]);
      element.style.display = "none";
    }
  }

  //creates markup for a new popup. Adds the id to popups array.
  register_popup(id, name) {

    for (var iii = 0; iii < this.popups.length; iii++) {
      //already registered. Bring it to front.
      if (id == this.popups[iii]) {
        this.removePopup(this.popups, iii, undefined);

        this.popups.unshift(id);

        this.calculate_popups();


        return;
      }
    }

    var element = '<div class="popup-box chat-popup" id="' + id + '">';
    element = element + '<div class="popup-head">';
    element = element + '<div class="popup-head-left">' + name + '</div>';
    element = element + '<div class="popup-head-right"><a id="close" (click)="close_popup(\'' + id + '\')">&#10005;</a></div>';
    element = element + '<div style="clear: both"></div></div><div class="popup-messages">';
    element = element + '<div><p id="iterations"></label></div>';
    element = element + '<input id="message" type="text" style="margin-top: 200px;font-size: 13px;"/></div></div>';

    document.getElementsByTagName("div")[0].innerHTML = document.getElementsByTagName("div")[0].innerHTML + element;

    this.popups.unshift(id);

    this.calculate_popups();

    document.getElementById("close").addEventListener("click", this.close_popup);
    window["idUser"] = id;
    window["popups"] = this.popups;
    window["sel"] = this;

    this.messages =
          this.db.list('users/'+ this.userLogged.uid + "/friends/" + id + "/messages"
          ).valueChanges()
    
    this.messages.subscribe(message => {
      document.getElementById("iterations").innerHTML = "";
      for (var i=0;i<message.length;i++)
        { 
            document.getElementById("iterations").innerHTML += message[i] +"<br>";
        }
    })      

    document.getElementById("message").addEventListener('keypress', function (e) {
    var key = e.which || e.keyCode;
    if (key === 13) { // 13 is enter
      window["sel"].sendMessage(id, name);
    }
  });
  }

  //calculate the total number of popups suitable and then populate the toatal_popups variable.
  calculate_popups() {
    var width = window.innerWidth;
    if (width < 540) {
      this.total_popups = 0;
    }
    else {
      width = width - 200;
      //320 is width of a single popup box
      this.total_popups = width / 320;
    }

    this.display_popups();

  }

  sendMessage(idContact, nome) {
    var data = new Date();
    var time = data.getTime();
    var obj = {};
    obj[time] = document.getElementById("message")["value"] + " ("+ nome + ")";

    this.updateItem(idContact, obj)
  }

  updateItem(key: string, value: any): void {
    this.db.object("users/" + this.userLogged.uid + "/friends/" + key + "/messages")
      .update(value).then((t: any) => {
        document.getElementById("message")["value"] = "";
      }),
      (e: any) => console.log(e.message);

      this.db.object("users/" + key + "/friends/" + this.userLogged.uid + "/messages")
      .update(value).then((t: any) => {
        console.log("enviado pro contato")
      }),
      (e: any) => console.log(e.message);
  }

  //Popup Chat

  ngOnInit() {
    window.addEventListener("resize", this.calculate_popups);
    window.addEventListener("load", this.calculate_popups);
  }

}
