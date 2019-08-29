import { Component, OnInit } from '@angular/core';
import { FeaturedService } from 'src/app/featured.service';
import { Blogcomments, Questions } from '../blog/blog.model';

@Component({
  selector: 'app-ask-a-question',
  templateUrl: './ask-a-question.page.html',
  styleUrls: ['./ask-a-question.page.scss'],
})
export class AskAQuestionPage implements OnInit {

  questionsData: Questions[];

  constructor(private featuredService: FeaturedService) { }

  ngOnInit() {
    this.questionsData = this.featuredService.questions;
  }

  onEdit(questionId) {

  }

}
