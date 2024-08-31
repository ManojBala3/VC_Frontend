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
import { AuthGuard } from '../auth.guard';

const routes: Routes = [
  { path: "welcome", component: WelcomeComponent,canActivate: [AuthGuard]},
  { path: "addpatient", component: AddPatientComponent,canActivate: [AuthGuard]},
  { path: "addpatient", component: AddPatientComponent,canActivate: [AuthGuard]},
  { path: "updatepatient", component: UpdatePatientComponent,canActivate: [AuthGuard]},
  { path: "addvisit", component: AddVisitComponent,canActivate: [AuthGuard]},
  { path: "viewvisit", component: ViewVisitComponent,canActivate: [AuthGuard]},
  { path: "updatevisit", component: UpdateVisitComponent,canActivate: [AuthGuard]},
  { path: "addmedicine", component: AddMedicineComponent,canActivate: [AuthGuard]},
  { path: "viewmedicine", component: ViewMedicineComponent,canActivate: [AuthGuard]},
  { path: "updatemedicine", component: UpdateMedicineComponent,canActivate: [AuthGuard]},
  { path: "viewqueue", component: ViewqueueComponent,canActivate: [AuthGuard]},
  { path: "viewuser", component: ViewuserComponent,canActivate: [AuthGuard]},
  { path: "adduser", component: AdduserComponent,canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsermoduleRoutingModule { }
