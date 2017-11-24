import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { AngularFireDatabase } from "angularfire2/database";
import { AuthGuard } from "../auth.service";
import * as firebase from 'firebase/app';
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-user-perfil',
  templateUrl: './user-perfil.component.html',
  styleUrls: ['./user-perfil.component.css']
})
export class UserPerfilComponent implements OnInit {
  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  checked = false;
  user: {};
  email: any;
  displayName: any;

  userLogged: any;

  constructor(private _formBuilder: FormBuilder, public afAuth: AngularFireAuth,
    private router: Router, private authGuard: AuthGuard,
    private angularFire: AngularFireDatabase,
    public snackBar: MatSnackBar, private ref: ChangeDetectorRef) {

  }

  updateUser(formData) {
    this.user = {
      id: this.userLogged.uid,
      userPhoto: this.userLogged.photoURL,
      userName: this.firstFormGroup.value.displayName,
      phone:  this.firstFormGroup.value.phone,
      email: this.firstFormGroup.value.email,
      city: this.firstFormGroup.value.city,
      exibirDados: this.firstFormGroup.value.exibirDados,
      businessName: this.secondFormGroup.value.businessName,
      profession: this.secondFormGroup.value.profession,
      activities: this.secondFormGroup.value.activities
    }
    this.updateItem(this.userLogged.uid, this.user)
  }

  updateItem(key: string, value: any): void {
    this.angularFire.object("users" + "/" + key)
      .update(value).then((t: any) => {
        console.log("dados atualizados");
        this.router.navigateByUrl('/users');
      }),
      (e: any) => console.log(e.message);
  }

  ngAfterViewInit() {

    firebase.auth().onAuthStateChanged(user => {

      this.userLogged = user;
      let self = this;
      var dfRef = firebase.database().ref('users/' + this.userLogged.uid );
      dfRef.on('value', function(snapshot) {
       
      let usr = snapshot.val();
      
    
      self.firstFormGroup = self._formBuilder.group({
        displayName: [self.userLogged.displayName, Validators.required],
        email: [self.userLogged.email, Validators.required],
        phone: [usr.phone, Validators.required],
        city: [usr.city, Validators.required],
        exibirDados: [usr.exibirDados, Validators.required]
      });

      self.secondFormGroup = self._formBuilder.group({
        businessName: [usr.businessName, Validators.required],
        profession: [usr.profession, Validators.required],
        activities: [usr.activities, Validators.required]
      });
      })
    });

  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      displayName: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      city: ['', Validators.required],
      exibirDados: ['', Validators.required]

    });
    this.secondFormGroup = this._formBuilder.group({
      businessName: ['', Validators.required],
      profession: ['', Validators.required],
      activities: ['', Validators.required]
    });
  }
}
