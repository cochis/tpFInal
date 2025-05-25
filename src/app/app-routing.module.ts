import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NopagefoundComponent } from './shared/pages/nopagefound/nopagefound.component';

import { AuthRoutingModule } from './auth/auth.routing';
import { CoreRoutingModule } from './core/core.routing';
import { SharedComponent } from './shared/shared.component';


const routes: Routes = [
  { path: '', redirectTo: '/core', pathMatch: 'full' },
  { path: 'shared', component: SharedComponent, pathMatch: 'full' },
  { path: '**', component: NopagefoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
}),
    CoreRoutingModule,
    AuthRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
