import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HereosComponent } from './hereos/hereos.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';

const routes: Routes = [
  {path : 'heroes', component:HereosComponent},
  {path:'dashboard',  component: DashboardComponent},
  {path:'',redirectTo:'/dashboard',pathMatch:'full'},
  {path:'detail/:id',component: HeroDetailComponent}
];
imports : [RouterModule.forRoot(routes)]
exports: [RouterModule]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
