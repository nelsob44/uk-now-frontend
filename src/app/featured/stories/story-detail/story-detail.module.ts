import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { PipeModule } from 'src/app/sanitize-html.pipe.module';

import { StoryDetailPage } from './story-detail.page';

const routes: Routes = [
  {
    path: '',
    component: StoryDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    PipeModule.forRoot()
  ],
  declarations: [StoryDetailPage]
})
export class StoryDetailPageModule {}
