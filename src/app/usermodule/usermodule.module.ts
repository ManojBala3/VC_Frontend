import { CUSTOM_ELEMENTS_SCHEMA, InjectionToken, NgModule } from '@angular/core';
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
import { DateFormatPipe } from './date-format.pipe';
import { LocaleService, NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

export const DATERANGEPICKER_CONFIG = new InjectionToken('daterangepicker.config', {
  providedIn: 'root',
  factory: () => ({
    // Provide default or custom configurations here
    locale: {
      format: 'YYYY-MM-DD', // Example of custom format
    },
    // Additional options can be set here as needed
  })
});

@NgModule({
  declarations: 
  [WelcomeComponent,AddPatientComponent,
    UpdatePatientComponent, AddVisitComponent, ViewVisitComponent, UpdateVisitComponent, AddMedicineComponent, ViewMedicineComponent, UpdateMedicineComponent, ViewqueueComponent, ViewuserComponent, AdduserComponent, DateFormatPipe],
  imports: [
    CommonModule,
    UsermoduleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule ,
    NgxDaterangepickerMd.forRoot(),
    NgxPaginationModule,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
  providers: [DatePipe,LocaleService, { provide: DATERANGEPICKER_CONFIG, useValue: { locale: { format: 'YYYY-MM-DD' } } }
    
  ],
})
export class UsermoduleModule { }
