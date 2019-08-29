import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MentorDetailsPage } from './mentor-details.page';

const routes: Routes = [
  {
    path: '',
    component: MentorDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MentorDetailsPage]
})
export class MentorDetailsPageModule {}
