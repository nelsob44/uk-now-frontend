import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { StoriesPage } from './stories.page';
import { StoryItemComponent } from './story-item/story-item.component';

const routes: Routes = [
  {
    path: '',
    component: StoriesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [StoriesPage, StoryItemComponent]
})
export class StoriesPageModule {}
