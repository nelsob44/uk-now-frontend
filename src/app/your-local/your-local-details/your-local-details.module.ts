import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { YourLocalDetailsPage } from './your-local-details.page';

const routes: Routes = [
  {
    path: '',
    component: YourLocalDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [YourLocalDetailsPage]
})
export class YourLocalDetailsPageModule {}
