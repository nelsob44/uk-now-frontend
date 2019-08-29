import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BlogPage } from './blog.page';
import { BlogItemComponent } from './blog-item/blog-item.component';
import { BlogDetailPage } from './blog-detail/blog-detail.page';
import { BlogcommentsItemComponent } from './blogcomments-item/blogcomments-item.component';

const routes: Routes = [
  {
    path: '',
    component: BlogPage
  }
];
BlogDetailPage
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BlogPage, BlogItemComponent]
})
export class BlogPageModule {}
