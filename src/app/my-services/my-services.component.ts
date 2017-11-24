import { UsersComponent } from './../users/users.component';
import { Component, OnInit, ViewEncapsulation, ViewChild, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AngularFireAuth } from "angularfire2/auth";
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { moveIn, fallIn, moveInLeft } from '../router.animations';
import { NgForm, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from "@angular/material/snack-bar";
import { AngularFireDatabase, AngularFireAction } from "angularfire2/database";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { dataPerfilUser } from "../providers/dataPerfilUser";

@Component({
  selector: 'app-my-services',
  templateUrl: './my-services.component.html',
  styleUrls: ['./my-services.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MyServicesComponent implements OnInit{

  displayedColumns = ['name', 'progress', 'id', 'color'];
  dataSource: MatTableDataSource<any>;
  userLogged: any;
  services: Observable<AngularFireAction<firebase.database.DataSnapshot>[]>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
 
  constructor(public afAuth: AngularFireAuth, private angularFire: AngularFireDatabase,
     private userComp: UsersComponent, public dialog: MatDialog) {

    this.showService(this.userComp.category);

  }

  showService(category){
    let arr = [];  
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log(user);
        this.userLogged = user;
        this.services =
          this.angularFire.list(category, ref =>
            ref.orderByChild("userId").equalTo(this.userLogged.uid)
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

  showInterests(publish) {
    this.openDialog(publish);
  }

  openDialog(publish): void {

    var interessados = [];
    for (var key in publish.interessados) {
      if (publish.interessados.hasOwnProperty(key)) {
          interessados.push(publish.interessados[key]);
      }
    }
    let dialogRef = this.dialog.open(DialogInteressados, {
      width: '300px',
      data: { interessados: interessados }
    });

    /*dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    }); */
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); 
    filterValue = filterValue.toLowerCase(); 
    this.dataSource.filter = filterValue;
  }

  selectUserperfil(contactSelected) {
    
    
  }

  ngOnInit() {
    this.userComp.categorySelectEmitter.subscribe(category => {
      this.showService(category);
    })
    
  }
}

@Component({
  selector: 'dialog-interessado',
  templateUrl: './dialog-interessados.html',
})
export class DialogInteressados {

  constructor(
    public dialogRef: MatDialogRef<DialogInteressados>,
    @Inject(MAT_DIALOG_DATA) public data: any, private dataPerfil: dataPerfilUser
     , private router: Router) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  selectedPerfil(perfil){
    this.dataPerfil.storage = perfil;      
    this.dialogRef.close();
    this.router.navigate(['/contact-perfil', this.removeAccentue(perfil.userName.replace(" ", "."))]);
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

}

