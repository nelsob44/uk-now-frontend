import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LocalEventsPage } from './local-events.page';
import { EventItemComponent } from './event-item/event-item.component';

const routes: Routes = [
  {
    path: '',
    component: LocalEventsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LocalEventsPage, EventItemComponent]
})
export class LocalEventsPageModule {}
