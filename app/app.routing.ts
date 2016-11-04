import {Routes, RouterModule} from '@angular/router';
import {AboutComponent} from "./views/about/about.component";
import {HomeComponent} from "./views/home/home.component";
import {ModuleWithProviders} from "@angular/core";

import { AuthGuard } from "./services/auth-guard.service";
import {UserRegisterComponent} from "./views/user/user-register/user-register.component";
import {UserProfileComponent} from "./views/user/user-profile/user-profile.component";
import {LoginComponent} from "./views/login/login.component";
import {JobCreateComponent} from "./views/jobs/job-create/job-create.component";
import {JobApproveComponent} from "./views/jobs/job-approve/job-approve.component";

const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent, data: { roles: ['company']} },
  { path: 'about', component: AboutComponent, data: {title: 'About'}, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent, data: {title: 'Login'} },
  { path: 'user/register', component: UserRegisterComponent },
  { path: 'user', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'job/create', component: JobCreateComponent, data: { roles: ['company']} , canActivate: [AuthGuard] },
  { path: 'job/approve', component: JobApproveComponent, data: { roles: ['company']} , canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'home' }
];

export const appRoutingProviders: any[] = [AuthGuard];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, {initialNavigation: false});
