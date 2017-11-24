import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AngularFireAuth } from "angularfire2/auth";
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { moveIn, fallIn, moveInLeft } from '../router.animations';
import { NgForm, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from "@angular/material/snack-bar";
import { AngularFireDatabase, AngularFireAction } from "angularfire2/database";
import { UsersComponent } from "../users/users.component";

@Component({
  selector: 'app-my-interests',
  templateUrl: './my-interests.component.html',
  styleUrls: ['./my-interests.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MyInterestsComponent implements OnInit {

  displayedColumns = ['id', 'name', 'progress', 'color'];
  dataSource: MatTableDataSource<any>;
  userLogged: any;
  services: Observable<AngularFireAction<firebase.database.DataSnapshot>[]>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public afAuth: AngularFireAuth, private angularFire: AngularFireDatabase, private userComp: UsersComponent) { 
    this.showService(this.userComp.category);
  }

  showService(category){
    let arr = [];  
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log(user);
        this.userLogged = user;
        this.services =
          this.angularFire.list("users/"+ this.userLogged.uid + "/interesses/" +category
          ).valueChanges()

        
        this.services.subscribe(ar => {
          arr = ar;
          this.dataSource = new MatTableDataSource(arr);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        })

      }
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); 
    filterValue = filterValue.toLowerCase(); 
    this.dataSource.filter = filterValue;
  }

  ngOnInit() {
    this.userComp.categorySelectEmitter.subscribe(category => {
      this.showService(category);
    })
    
  }
}
