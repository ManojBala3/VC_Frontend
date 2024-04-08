import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
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

const routes: Routes = [
  { path: "welcome", component: WelcomeComponent},
  { path: "addpatient", component: AddPatientComponent},
  { path: "updatepatient", component: UpdatePatientComponent},
  { path: "addvisit", component: AddVisitComponent},
  { path: "viewvisit", component: ViewVisitComponent},
  { path: "updatevisit", component: UpdateVisitComponent},
  { path: "addmedicine", component: AddMedicineComponent},
  { path: "viewmedicine", component: ViewMedicineComponent},
  { path: "updatemedicine", component: UpdateMedicineComponent},
  { path: "viewqueue", component: ViewqueueComponent},
  { path: "viewuser", component: ViewuserComponent},
  { path: "adduser", component: AdduserComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsermoduleRoutingModule { }
