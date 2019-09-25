import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { YourLocalPage } from './your-local.page';
import { LocalItemComponent } from './local-item/local-item.component';
import { YourLocalDetailsPage } from './your-local-details/your-local-details.page';
import { TransferComponent } from './transfer/transfer.component';

const routes: Routes = [
  {
    path: '',
    component: YourLocalPage
  }
];
YourLocalDetailsPage
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,    
    RouterModule.forChild(routes)    
  ],
  declarations: [YourLocalPage, LocalItemComponent, TransferComponent]
})
export class YourLocalPageModule {}
