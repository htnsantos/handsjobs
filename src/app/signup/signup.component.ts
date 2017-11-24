import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

import { Router } from '@angular/router';
import { moveIn, fallIn } from '../router.animations';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  animations: [moveIn(), fallIn()],
  host: { '[@moveIn]': '' }

})
export class SignupComponent implements OnInit {

  state: string = '';
  error: any;
  email: any;
  password: any;

  constructor(public afAuth: AngularFireAuth, private router: Router) {

  }

  onSubmit(formData) {
    if (formData.valid) {
      console.log(formData.value);
      firebase.auth().createUserWithEmailAndPassword
        (formData.value.email,
        formData.value.password
        ).then(
        (success) => {
          console.log(success);
          this.router.navigate(['/login'])
        }).catch(
        (err) => {
          console.log(err);
          this.error = err;
        })
    }

    firebase.auth().createUserWithEmailAndPassword(formData.value.email, formData.value.password)
      .catch(function (error) {
      
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
          alert('The password is too weak.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
      });
  }

  ngOnInit() {
  }

}
