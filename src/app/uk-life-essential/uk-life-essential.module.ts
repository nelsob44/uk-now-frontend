import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UkLifeEssentialPage } from './uk-life-essential.page';
import { EssentialItemComponent } from './essential-item/essential-item.component';

const routes: Routes = [
  {
    path: '',
    component: UkLifeEssentialPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UkLifeEssentialPage, EssentialItemComponent]
})
export class UkLifeEssentialPageModule {}
