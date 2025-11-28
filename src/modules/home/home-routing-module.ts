import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from './home-component';
import {DashboardComponent} from './dashboard-component/dashboard-component';
import {AlunoComponent} from './aluno-component/aluno-component';
import {homeGuard} from '../../core/security/home-guard';

const routes: Routes = [
  {path: '', component: HomeComponent, canActivateChild: [homeGuard], children:
      [
        {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
        {path: 'dashboard', component: DashboardComponent},
        {path: 'alunos', component: AlunoComponent}
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
