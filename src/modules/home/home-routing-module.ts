import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from './home-component';
import {homeGuard} from '../../core/security/home-guard';

const routes: Routes = [
  {path: '', component: HomeComponent, canActivateChild: [homeGuard], children:
      [
        {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
