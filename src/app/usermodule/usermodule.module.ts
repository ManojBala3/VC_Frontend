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
import { SearchComponent } from './search/search.component';
import { CustomersearchComponent } from './customersearch/customersearch.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { DownloadComponent } from './download/download.component';
import { AddcustomerComponent } from './addcustomer/addcustomer.component';
import { UpdatecustomerComponent } from './updatecustomer/updatecustomer.component';
import { AddorderComponent } from './addorder/addorder.component';
import { VieworderComponent } from './vieworder/vieworder.component';
import { UpdateorderComponent } from './updateorder/updateorder.component';
import { AdditemComponent } from './additem/additem.component';
import { ViewitemComponent } from './viewitem/viewitem.component';
import { UpdateitemComponent } from './updateitem/updateitem.component';

@NgModule({
  declarations: 
  [WelcomeComponent,SearchComponent,CustomersearchComponent, DownloadComponent,AddcustomerComponent,
    UpdatecustomerComponent, AddorderComponent, VieworderComponent, UpdateorderComponent, AdditemComponent, ViewitemComponent, UpdateitemComponent],
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
