import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomersearchComponent } from './customersearch/customersearch.component';
import { DownloadComponent } from './download/download.component';
import { SearchComponent } from './search/search.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { AddcustomerComponent } from './addcustomer/addcustomer.component';
import { UpdatecustomerComponent } from './updatecustomer/updatecustomer.component';
import { AddorderComponent } from './addorder/addorder.component';
import { VieworderComponent } from './vieworder/vieworder.component';
import { UpdateorderComponent } from './updateorder/updateorder.component';
import { AdditemComponent } from './additem/additem.component';
import { ViewitemComponent } from './viewitem/viewitem.component';
import { UpdateitemComponent } from './updateitem/updateitem.component';

const routes: Routes = [
  { path: "welcome", component: WelcomeComponent},
  { path: "search", component: SearchComponent},
  { path: "customersearch", component: CustomersearchComponent},
  { path: "download", component: DownloadComponent},
  { path: "addcustomer", component: AddcustomerComponent},
  { path: "updatecustomer", component: UpdatecustomerComponent},
  { path: "addorder", component: AddorderComponent},
  { path: "vieworder", component: VieworderComponent},
  { path: "updateorder", component: UpdateorderComponent},
  { path: "additem", component: AdditemComponent},
  { path: "viewitem", component: ViewitemComponent},
  { path: "updateitem", component: UpdateitemComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsermoduleRoutingModule { }
