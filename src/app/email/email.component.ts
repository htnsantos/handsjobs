import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { moveIn, fallIn } from '../router.animations';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css'],
  animations: [moveIn(), fallIn()],
  host: {'[@moveIn]': ''}

})
export class EmailComponent implements OnInit {

  state: string = '';
    error: any;
    email: any;
    password: any;

    user: Observable<firebase.User>;
    constructor(public afAuth: AngularFireAuth, private router: Router) {
      
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          this.router.navigateByUrl('/users'); //caso o usuário seja logado direciona para os usuários
        }
      });
    }


  onSubmit(formData) {
    if(formData.valid) {
      
      firebase.auth().signInWithEmailAndPassword(
        formData.value.email, 
        formData.value.password
      ).then(
        (success) => {
        console.log(success);
        this.router.navigate(['/users']);
      }).catch(
        (err) => {
        console.log(err);
        this.error = err;
      })
    }
  }

  ngOnInit() {
  }

}
