import { Component, OnInit, OnDestroy } from '@angular/core';
// import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FeaturedService } from 'src/app/featured.service';
import { AlertController, ActionSheetController, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { QuizQuestion } from 'src/app/about/about.model';

@Component({
  selector: 'app-uk-quiz-details',
  templateUrl: './uk-quiz-details.page.html',
  styleUrls: ['./uk-quiz-details.page.scss'],
})
export class UkQuizDetailsPage implements OnInit, OnDestroy {
    
  loadedQuizzes: QuizQuestion[];
  private authSub: Subscription;
  private statusSub: Subscription;
  private answerSub: Subscription;
  private quizViewSub: Subscription;
  isAdmin = false;
  isLoading = false;

  constructor(private featuredService: FeaturedService,
  private alertCtrl: AlertController,
  private loadingCtrl: LoadingController,
  private authService: AuthService,  
  private router: Router) {}

  ngOnInit() {    

    return this.authSub = this.authService.userAuthenticated.subscribe(isAuth => {
      if(isAuth) {
        this.quizViewSub = this.featuredService.quizzes.subscribe(quizzes => {
      
          this.loadedQuizzes = quizzes;     

          setTimeout( () => {
            
            if(this.loadedQuizzes.length < 1) {       
              
              this.showAlertTwo("Sorry, you can\'t take the quiz more than once per session");
              this.router.navigate(['/uk-life-essential']);
            } 
          }, 300);    
          
        });
        
      } else {
        this.router.navigate(['/home']);
      }           
    });     
  }
  

  ionViewWillEnter() {
    this.isLoading = true; 
    this.quizViewSub = this.featuredService.fetchquizzes().subscribe(quizzes => {
      
      this.loadedQuizzes = quizzes;
      setTimeout( () => {
        
        if(this.loadedQuizzes.length < 1) {       
          
          this.showAlertTwo("Sorry, you can\'t take the quiz more than once per session");
          this.router.navigate(['/uk-life-essential']);
        } 
      }, 300); 
      this.statusSub = this.authService.userStatus.subscribe(
      status => {
        
        if(+status < 3)
        {          
          this.isAdmin = true;
        }
      });   
      
      this.isLoading = false; 
        
    });   
      
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    this.presentLoading();
    
    return this.answerSub = this.featuredService.submitQuizAnswers(
      form.value       
    ).subscribe(data => { 
      this.showAlert(data);      
      form.reset();      
      this.router.navigate(['/uk-life-essential/quiz-results']);
    });    
  }  

 
  private async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 1000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
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
      this.statusSub.unsubscribe();
      this.quizViewSub.unsubscribe();
      this.authSub.unsubscribe();
    }
  }

}
