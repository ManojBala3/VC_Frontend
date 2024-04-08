import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { UsermoduleRoutingModule } from './usermodule-routing.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { AppRoutingModule } from '../app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgxPaginationModule } from 'ngx-pagination';
import { AddPatientComponent } from './addpatient/addpatient.component';
import { UpdatePatientComponent } from './updatepatient/updatepatient.component';
import { AddVisitComponent } from './addvisit/addvisit.component';
import { ViewVisitComponent } from './viewVisit/viewvisit.component';
import { UpdateVisitComponent } from './updatevisit/updatevisit.component';
import { AddMedicineComponent } from './addmedicine/addmedicine.component';
import { ViewMedicineComponent } from './viewmedicine/viewmedicine.component';
import { UpdateMedicineComponent } from './updatemedicine/updatemedicine.component';
import { ViewqueueComponent } from './viewqueue/viewqueue.component';
import { ViewuserComponent } from './viewuser/viewuser.component';
import { AdduserComponent } from './adduser/adduser.component';

@NgModule({
  declarations: 
  [WelcomeComponent,AddPatientComponent,
    UpdatePatientComponent, AddVisitComponent, ViewVisitComponent, UpdateVisitComponent, AddMedicineComponent, ViewMedicineComponent, UpdateMedicineComponent, ViewqueueComponent, ViewuserComponent, AdduserComponent],
  imports: [
    CommonModule,
    UsermoduleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule ,
    NgxPaginationModule,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
  providers: [DatePipe
    
  ],
})
export class UsermoduleModule { }
