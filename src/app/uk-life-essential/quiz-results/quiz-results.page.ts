import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Results } from 'src/app/blog/blog.model';
import { FeaturedService } from 'src/app/featured.service';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz-results',
  templateUrl: './quiz-results.page.html',
  styleUrls: ['./quiz-results.page.scss'],
})
export class QuizResultsPage implements OnInit, OnDestroy {
  private authSub: Subscription;
  private statusSub: Subscription;
  private quizResultsSub: Subscription;
  loadedResults: Results[];
  isLoading = false;
  isAdmin = false;
  private totalUserSub: Subscription;
  private totalUsers: number;
  private userName: string;
  private userNameSub: Subscription;

  constructor(private featuredService: FeaturedService,
  private alertCtrl: AlertController,
  private authService: AuthService,  
  private router: Router) { }

  ngOnInit() {
    return this.authSub = this.authService.userAuthenticated.subscribe(isAuth => {
      if(isAuth) {
        this.quizResultsSub = this.featuredService.results.subscribe(results => {
      
          this.loadedResults = results;
          
        });
        
      } else {
        this.router.navigate(['/home']);
      }           
    });  
  }

  getUser(userId: string) {
    this.router.navigateByUrl('/profile/' + userId);
  }

  onTakeQuiz() {    
    this.router.navigate(['/', 'uk-life-essential', 'uk-quiz-details']);    
  }

  onAddQuiz() {
    if(this.isAdmin) {
      this.router.navigate(['/', 'uk-life-essential', 'edit-quiz',
        '']);
    } else {
      this.router.navigate(['/', 'uk-life-essential']);
    }
  }

  ionViewWillEnter() {
    this.isLoading = true; 
    this.quizResultsSub = this.featuredService.fetchquizresults().subscribe(results => {
      
      this.loadedResults = results;
      this.statusSub = this.authService.userStatus.subscribe(
        status => {
          
          if(status != null && (status < 3))
          {          
            this.isAdmin = true;
          }
      });  

      this.totalUserSub = this.authService.totalUsers.subscribe(totalusers => {
        this.totalUsers = totalusers;        
      });

      this.userNameSub = this.authService.userName.subscribe(userName => {
        this.userName = userName;        
      });     
  
      this.isLoading = false; 
        
    });  
     
  }

  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
      this.quizResultsSub.unsubscribe();
      this.statusSub.unsubscribe();
     
    }
  }

}