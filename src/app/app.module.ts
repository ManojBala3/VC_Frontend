import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import {  CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WelcomeComponent } from './usermodule/welcome/welcome.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
import { TokenInterceptorService } from './commonservices/token-interceptor.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxPaginationModule } from 'ngx-pagination';
import { AddPatientComponent } from './usermodule/addpatient/addpatient.component';
import { UpdatePatientComponent } from './usermodule/updatepatient/updatepatient.component';
import { ToastrModule } from 'ngx-toastr';
import { SpinnerComponent } from './commonservices/spinner/spinner.component';
import { LoadingInterceptor } from './commonservices/loading.interceptor';


@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    LoginComponent,
    HeaderComponent,
    SpinnerComponent,
    
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
     NgxSpinnerModule,
     NgxPaginationModule,
     BrowserAnimationsModule,
     NgxPaginationModule,
     ToastrModule.forRoot({
      timeOut: 3500,
      positionClass: 'toast-bottom-center',
      preventDuplicates: true,
}),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
