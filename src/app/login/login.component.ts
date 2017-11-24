import { Component, OnInit, HostBinding } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

import { AuthGuard } from './../auth.service';

import { Router } from '@angular/router';
import { moveIn } from '../router.animations';
import { auth } from "firebase/app";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [moveIn()],
  host: { '[@moveIn]': '' }

})
export class LoginComponent implements OnInit {

  error: any;
  user: Observable<firebase.User>;
  constructor(public afAuth: AngularFireAuth, private router: Router, private authGuard : AuthGuard) {

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.router.navigateByUrl('/users'); 
      }
    });
  }

  loginFb() {

    var self = this;
    var provider = new firebase.auth.FacebookAuthProvider();

    this.afAuth.auth.signInWithPopup(provider).then(function (result) {

      var user = result.user;

      var credential = result.credential;
      self.router.navigate(['/users']);
    }, function (error) {

      var email = error.email;

      var credential = error.credential;

      self.error = error;
      if (error.code === 'auth/account-exists-with-different-credential') {
        this.afAuth.auth.fetchProvidersForEmail(email).then(function (providers) {

        });
      }
    });
  }

  loginGoogle() {
    firebase.auth().getRedirectResult().then(function (result) {
      if (result.credential) {

        var token = result.credential.accessToken;
      }
      var user = result.user;
    });

    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider).then(function (result) {

      var token = result.credential.accessToken;

      var user = result.user;

    });

  }

  logout() {
    this.afAuth.auth.signOut();
    this.authGuard.mostrarMenuEmitter.emit(false);
    console.log('logged out');
    this.router.navigateByUrl('/login');
  }

  ngOnInit() {
    this.authGuard.mostrarMenuEmitter.emit(false);
  }

}
