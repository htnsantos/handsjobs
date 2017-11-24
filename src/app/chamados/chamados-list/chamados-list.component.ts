import { UsersComponent } from './../../users/users.component';
import { Observable } from 'rxjs/Observable';
import { Chamado } from './../../model/chamado';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { AngularFireDatabase, AngularFireAction } from 'angularfire2/database';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/switchMap';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-chamados-list',
  templateUrl: './chamados-list.component.html',
  styleUrls: ['./chamados-list.component.css']
})
export class ChamadosListComponent  {

  categoriesObserver: Observable<AngularFireAction<firebase.database.DataSnapshot>[]>;
  panelOpenState: boolean = false;
  selectedRow: any;
  //categorias
  academicos: any;
  computacao: any;
  construcao: any;
  manutencaoVeiculos: any;
  motoristas: any;
  categorEmitter = new EventEmitter<any>();
  category: any;
  
  constructor( private db: AngularFireDatabase, private user: UsersComponent) { 
   
    this.categoriesObserver = 
      db.list('/categorias'
      ).valueChanges()

    let self = this;
    //let allCategories = 
    this.categoriesObserver.subscribe(categories => {
      self.academicos = categories[0];
      self.computacao = categories[1];
      self.construcao = categories[2];
      self.manutencaoVeiculos = categories[3];
      self.motoristas = categories[4];
      console.log(categories);
    })  
  }

  categorySelected(category, index) {
    this.category = category;
    this.selectedRow = index;
    this.user.categorySelected(category);    
  }

   trackByIndex(index: number, value: number) {
    return index;
  }


  
  }

 


