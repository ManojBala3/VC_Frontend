import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NgxSpinnerModule } from 'ngx-spinner';



const routes: Routes = [
  {path :"",component:LoginComponent},
  { path: "user", loadChildren: ()=>import("./usermodule/usermodule.module").then(m=>m.UsermoduleModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes),NgxSpinnerModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
