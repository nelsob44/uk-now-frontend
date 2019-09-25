import { Component, OnInit, OnDestroy } from '@angular/core';
import { FeaturedService } from 'src/app/featured.service';
import { Blogcomments, Questions } from '../blog/blog.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ask-a-question',
  templateUrl: './ask-a-question.page.html',
  styleUrls: ['./ask-a-question.page.scss'],
})
export class AskAQuestionPage implements OnInit, OnDestroy {
  private questionsSub: Subscription;
  viewQuestion: Questions;
  questionsData: Questions[];
  isLoading = false;
  showIt = false;
  toggleReply = false;
  pageTotal: number;
  pageNumber: number;
  numberOfPages: number;
  nextPage: number;
  currentPage: number;
  firstPage: number;
  lastPage: number;
  previousPage: number;
  private pageSub: Subscription;

  constructor(private router: Router, private featuredService: FeaturedService) { }

  ngOnInit() {
    this.isLoading = true;
    this.questionsSub = this.featuredService.questions.subscribe(questions => {
      this.questionsData = questions;

       this.pageSub = this.featuredService.questionTotalItems.subscribe(pageArray => {
        this.pageTotal = pageArray[0];   

        this.numberOfPages = Math.ceil(this.pageTotal / 10);
        this.lastPage = this.numberOfPages;
        this.firstPage = 1;
        
        this.nextPage = this.firstPage + 1;
        this.previousPage = this.nextPage - 1;
                          
      }); 
      
      this.isLoading = false; 
    });     
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.questionsSub = this.featuredService.fetchquestions(this.currentPage).subscribe(questions => {
      this.questionsData = questions;
      this.isLoading = false; 
    });     
  }

  onReceiveReply(newQuestion: Questions) {
    this.questionsSub = this.featuredService.questions.subscribe(questions => {      
      
      questions.forEach(question => {
        if(question.id === newQuestion.id) {
          const check = questions.indexOf(question);
          
          questions.splice(check, 1, newQuestion);      
        }
      });
      
      this.questionsData = questions;
    });   
  }

  onReceiveDelete(oldQuestion: Questions) {
    
    this.questionsSub = this.featuredService.questions.subscribe(questions => {      
      
      questions.forEach(question => {
        if(question.id === oldQuestion.id) {
          const check = questions.indexOf(question);
          
          questions.splice(check, 1);      
        }
      });
      console.log(questions);
      
      this.questionsData = questions;
    });   
  }

  onScrollNext(page: number) {
    
    this.isLoading = true;
    
    this.questionsSub = this.featuredService.fetchquestions(page).subscribe(questions => {
      this.questionsData = questions;
      this.nextPage = page + 1;
      this.previousPage = page;
      if(this.previousPage == 0) {
        this.previousPage = 1;
      }
      this.isLoading = false;       
    });    
    
  }

  onScrollPrev(page: number) {
    
    this.isLoading = true;
    
    this.questionsSub = this.featuredService.fetchquestions(page).subscribe(questions => {
      this.questionsData = questions;
      this.nextPage = page;
      this.previousPage = page - 1;
      if(this.previousPage == 0) {
        this.previousPage = 1;
      }
      this.isLoading = false;       
    });    
    
  }

  onScrollLast(page: number) {
    
    this.isLoading = true;
    
    this.questionsSub = this.featuredService.fetchquestions(page).subscribe(questions => {
      this.questionsData = questions;
      this.nextPage = page;
      this.previousPage = page - 1;
      if(this.previousPage == 0) {
        this.previousPage = 1;
      }
           
      this.isLoading = false;       
    });    
    
  }

  onScrollFirst(page: number) {
    
    this.isLoading = true;
    
    this.questionsSub = this.featuredService.fetchquestions(page).subscribe(questions => {
      this.questionsData = questions;
      this.nextPage = page + 1;
      this.previousPage = page;
      if(this.previousPage == 0) {
        this.previousPage = 1;
      }
           
      this.isLoading = false;       
    });    
    
  }

  onRepliesClicked(question) {
    this.showIt = !this.showIt;
  }

  ngOnDestroy() {
    if (this.questionsSub) {
      this.questionsSub.unsubscribe();
      this.pageSub.unsubscribe();
    }
  }

}
