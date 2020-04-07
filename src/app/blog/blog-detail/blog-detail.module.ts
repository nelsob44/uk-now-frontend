import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { PipeModule } from 'src/app/sanitize-html.pipe.module';
import { BlogDetailPage } from './blog-detail.page';
import { BlogcommentsItemComponent } from '../blogcomments-item/blogcomments-item.component';

const routes: Routes = [
  {
    path: '',
    component: BlogDetailPage
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
  declarations: [BlogDetailPage, BlogcommentsItemComponent]
})
export class BlogDetailPageModule {}
