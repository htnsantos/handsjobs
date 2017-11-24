import { Injectable } from '@angular/core';
import { UsersComponent } from './../users/users.component';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { Observable } from "rxjs/Rx";
import { AngularFireAction, AngularFireDatabase } from "angularfire2/database";
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-messages-list',
  templateUrl: './messages-list.component.html',
  styleUrls: ['./messages-list.component.css'],
  encapsulation: ViewEncapsulation.None
})

@Injectable()
export class MessagesListComponent implements OnInit {

  messages: Observable<AngularFireAction<firebase.database.DataSnapshot>[]>;

  constructor(private db: AngularFireDatabase) {
     
   }

  showCategory(category){

    this.messages =
      this.db.list(category
      ).valueChanges()

    this.messages.subscribe(m => {
      console.log(m);
    })  
  }

  ngOnInit() {
    
  }

}
