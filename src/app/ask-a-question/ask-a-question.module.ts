import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AskAQuestionPage } from './ask-a-question.page';
import { QuestionItemComponent } from './question-item/question-item.component';
import { RepliesItemComponent } from './replies-item/replies-item.component';

const routes: Routes = [
  {
    path: '',
    component: AskAQuestionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AskAQuestionPage, QuestionItemComponent, RepliesItemComponent]
})
export class AskAQuestionPageModule {}
