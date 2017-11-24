import { ChamadosListComponent } from './chamados/chamados-list/chamados-list.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';

import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthGuard } from './auth.service';
import * as $ from 'jquery';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatNativeDateModule } from "@angular/material/core";
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSelectModule} from '@angular/material/select';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatDialogModule} from '@angular/material/dialog';
import {MatStepperModule} from '@angular/material/stepper';

import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { UsersComponent } from "./users/users.component";
import { EmailComponent } from "./email/email.component";
import { routes } from "./app.routes";
import { UsersListComponent } from './users-list/users-list.component';
import { MessagesListComponent } from './messages-list/messages-list.component';
import { ReversePipe } from "./components/orderBy";
import { OrderModule } from 'ngx-order-pipe';
import { MyServicesComponent, DialogInteressados } from './my-services/my-services.component';
import { MyInterestsComponent } from './my-interests/my-interests.component';
import { UserPerfilComponent } from './user-perfil/user-perfil.component';
import { ContactPerfilComponent } from './contact-perfil/contact-perfil.component';
import { dataPerfilUser } from "./providers/dataPerfilUser";
import { ContactsComponent } from './contacts/contacts.component';

export const firebaseConfig = {
    apiKey: "AIzaSyANW95gP30NCgKZGCmS49amXCWoamMLCXg",
    authDomain: "speeds-admin.firebaseapp.com",
    databaseURL: "https://speeds-admin.firebaseio.com",
    projectId: "speeds-admin",
    storageBucket: "speeds-admin.appspot.com",
    messagingSenderId: "261487848105"
  };

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EmailComponent,
    SignupComponent,
    UsersComponent,
    ChamadosListComponent,
    UsersListComponent,
    MessagesListComponent,
    ReversePipe,
    MyServicesComponent,
    MyInterestsComponent,
    DialogInteressados,
    UserPerfilComponent,
    ContactPerfilComponent,
    ContactsComponent
  ],
  entryComponents: [DialogInteressados],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    routes,
    InfiniteScrollModule,
    OrderModule,
        
    //angular material
    BrowserAnimationsModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatListModule,
    MatExpansionModule,
    MatTabsModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatStepperModule
    //

  ],
  providers: [
    AuthGuard, 
    LoginComponent, 
    AngularFireDatabase, 
    MessagesListComponent, 
    ReversePipe,
    dataPerfilUser
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],  
  bootstrap: [AppComponent]
})
export class AppModule { }


