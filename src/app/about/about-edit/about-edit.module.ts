import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { AboutEditPage } from './about-edit.page';

const routes: Routes = [
  {
    path: '',
    component: AboutEditPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    CKEditorModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [AboutEditPage]
})
export class AboutEditPageModule {}
