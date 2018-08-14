import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegisterComponent } from './register/register.component';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
  {
    path: 'register',
    component: RegisterComponent,
    data: {title: 'Registrar en eventos'}
  },
  {
    path: '',
    redirectTo: '/register',
    pathMatch: 'full'
  }
]

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    ClarityModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot (
      appRoutes,
      {enableTracing: true} //Debugging purposes only
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
