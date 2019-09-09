import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { EditStoryPage } from './edit-story.page';
import { FileSelectDirective } from 'ng2-file-upload';

const routes: Routes = [
  {
    path: '',
    component: EditStoryPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [EditStoryPage, FileSelectDirective]
})
export class EditStoryPageModule {}
