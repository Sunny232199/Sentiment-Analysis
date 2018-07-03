import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagenotfoundComponent } from './components/pagenotfound/pagenotfound.component';
import { SearchComponent } from './components/search/search.component';
import { AboutComponent } from './components/about/about.component';



const routes: Routes = [
  { path: 'home', component: SearchComponent },
  { path: 'about', component: AboutComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PagenotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
