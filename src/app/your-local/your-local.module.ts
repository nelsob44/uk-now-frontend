import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { YourLocalPage } from './your-local.page';
import { LocalItemComponent } from './local-item/local-item.component';

const routes: Routes = [
  {
    path: '',
    component: YourLocalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [YourLocalPage, LocalItemComponent]
})
export class YourLocalPageModule {}
