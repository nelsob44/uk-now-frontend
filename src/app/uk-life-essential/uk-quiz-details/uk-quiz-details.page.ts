import { Component, OnInit, OnDestroy } from '@angular/core';
// import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { FeaturedService } from 'src/app/featured.service';
import { AlertController, ActionSheetController, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { QuizQuestion } from 'src/app/about/about.model';

export interface QuizResponseData {  
  message: string,
  score: number 
}

@Component({
  selector: 'app-uk-quiz-details',
  templateUrl: './uk-quiz-details.page.html',
  styleUrls: ['./uk-quiz-details.page.scss'],
})
export class UkQuizDetailsPage implements OnInit, OnDestroy {
    
  loadedQuizzes: QuizQuestion[] = [];
  private authSub: Subscription;
  private statusSub: Subscription;
  private answerSub: Subscription;
  private quizViewSub: Subscription;
  isAdmin = false;
  isLoading = false;
  private totalUserSub: Subscription;
  totalUsers: number;
  userName: string;
  private userNameSub: Subscription;


  constructor(private featuredService: FeaturedService,
  private alertCtrl: AlertController,
  private loadingCtrl: LoadingController,
  private authService: AuthService,  
  private router: Router) {}

  ngOnInit() {    
      this.totalUserSub = this.authService.totalUsers.subscribe(totalusers => {
        this.totalUsers = totalusers;        
      });

      this.userNameSub = this.authService.userName.subscribe(userName => {
        this.userName = userName;        
      });

    return this.authSub = this.authService.userAuthenticated.subscribe(isAuth => {
      
      if(!isAuth) {
        this.router.navigate(['/home']);
        // this.quizViewSub = this.featuredService.quizzes.subscribe(quizzes => {
           
        //   if(quizzes && quizzes.length > 0) {
        //     this.loadedQuizzes = quizzes;  

        //   }              
          
        // });
        
      }         
    });     
  }
  

  ionViewWillEnter() {
    this.isLoading = true; 
    
    this.quizViewSub = this.featuredService.fetchquizzes().subscribe(quizzes => {
      if(quizzes && quizzes.length == 0) {        
        this.loadedQuizzes = quizzes;        
        
      } else if(quizzes && quizzes.length > 0) {        
        this.loadedQuizzes = quizzes;        
        
      } else {                      
        this.showAlertTwo("Sorry, you can\'t take the quiz more than once per session");
        this.router.navigate(['/uk-life-essential']);        
      }
       
      this.statusSub = this.authService.userStatus.subscribe(
      status => {
        
        if(status != null && (status < 3))
        {          
          this.isAdmin = true;
        }
      });   
      
      this.isLoading = false; 
        
    });   
      
  }

  onSeeResults() {
    this.router.navigate(['/', 'uk-life-essential', 'quiz-results']);
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    this.isLoading = true;
      this.loadingCtrl.create({keyboardClose: true, message: 'Processing your quiz, please wait...' })
      .then(loadingEl => {
        loadingEl.present();
        
        let quizObs: Observable<QuizResponseData>;
       
        quizObs = this.featuredService.submitQuizAnswers(form.value);        
        
        return quizObs.subscribe(resData => {
          
          loadingEl.dismiss();
          
          this.showAlert(resData);  
          this.isLoading = false;    
          form.reset();      
          this.router.navigate(['/uk-life-essential/quiz-results']);

        }, errorResponse => {
          loadingEl.dismiss();
          const errorCode = errorResponse.error.message;

          this.showAlert(errorCode);
          this.isLoading = false;
        });      
      });  
  }  
  
  private showAlert(data: any) {
    this.alertCtrl.create({       
      subHeader: data.message,
      message: 'Your score in the quiz is ' + data.score + '%',
      buttons: ['OK']
    }).then(alertEl => alertEl.present());
  }
  
  private showAlertTwo(data: string) {
    this.alertCtrl.create({       
      subHeader: 'Duplicate Quiz Attempt Detected',
      message: data,
      translucent: true,
      buttons: ['OK']
    }).then(alertEl => alertEl.present());
  }

  ngOnDestroy() {
    if (this.answerSub) {
      this.answerSub.unsubscribe();
      
    }
    if (this.statusSub) {
     
      this.statusSub.unsubscribe();
      
    }
    if (this.quizViewSub) {     
      this.quizViewSub.unsubscribe();      
    }
    if (this.authSub) {      
      this.authSub.unsubscribe();
    }
    if (this.totalUserSub) {      
      this.totalUserSub.unsubscribe();
    }
    if (this.userNameSub) {      
      this.userNameSub.unsubscribe();
    }
  }

}
