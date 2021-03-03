import { Component, OnInit, OnDestroy } from '@angular/core';
import { FeaturedService } from 'src/app/featured.service';
import { Blogcomments, Questions } from '../blog/blog.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-ask-a-question',
  templateUrl: './ask-a-question.page.html',
  styleUrls: ['./ask-a-question.page.scss'],
})
export class AskAQuestionPage implements OnInit, OnDestroy {
  private questionsSub: Subscription;
  viewQuestion: Questions;
  idQuestionShow: Questions;
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
  private authSub: Subscription;
  private totalUserSub: Subscription;
  totalUsers: number;
  userName: string;
  private userNameSub: Subscription;

  constructor(private router: Router, 
  private authService: AuthService,
  private featuredService: FeaturedService) { }

  ngOnInit() {
    return this.authSub = this.authService.userAuthenticated.subscribe(isAuth => {
      if(isAuth) {
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
      } else {
          this.router.navigate(['/home']);
      }
    });    
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.questionsSub = this.featuredService.fetchquestions(this.currentPage).subscribe(questions => {
      this.questionsData = questions;
      this.isLoading = false; 
      
    });  
    this.totalUserSub = this.authService.totalUsers.subscribe(totalusers => {
        this.totalUsers = totalusers;        
      });

      this.userNameSub = this.authService.userName.subscribe(userName => {
        this.userName = userName;        
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
    
    
  }

  onQuestionClick(idQuestion: Questions) {
    
    this.showIt = !this.showIt;
    this.idQuestionShow = idQuestion;
    
  }

  ngOnDestroy() {
    if (this.questionsSub || this.authSub) {
      this.questionsSub.unsubscribe();
      this.pageSub.unsubscribe();
      this.authSub.unsubscribe();
      this.totalUserSub.unsubscribe();
      this.userNameSub.unsubscribe();
    }
  }

}
