import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FindAMentorPage } from './find-a-mentor.page';
import { MentorItemComponent } from './mentor-item/mentor-item.component';

const routes: Routes = [
  {
    path: '',
    component: FindAMentorPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FindAMentorPage, MentorItemComponent]
})
export class FindAMentorPageModule {}
