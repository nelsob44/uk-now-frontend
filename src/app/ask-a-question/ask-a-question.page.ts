import { Component, OnInit, OnDestroy } from '@angular/core';
import { FeaturedService } from 'src/app/featured.service';
import { Blogcomments, Questions } from '../blog/blog.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ask-a-question',
  templateUrl: './ask-a-question.page.html',
  styleUrls: ['./ask-a-question.page.scss'],
})
export class AskAQuestionPage implements OnInit, OnDestroy {
  private questionsSub: Subscription;
  questionsData: Questions[];

  constructor(private featuredService: FeaturedService) { }

  ngOnInit() {
    this.questionsSub = this.featuredService.questions.subscribe(questions => {
      this.questionsData = questions;
    });    
  }

  onEdit(questionId) {

  }

  ngOnDestroy() {
    if (this.questionsSub) {
      this.questionsSub.unsubscribe();
    }
  }

}
