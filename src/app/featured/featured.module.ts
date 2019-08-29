import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FeaturedPage } from './featured.page';
import { FeaturedRoutingModule } from './featured-routing.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FeaturedRoutingModule
  ],
  declarations: [FeaturedPage]
})
export class FeaturedPageModule {}
