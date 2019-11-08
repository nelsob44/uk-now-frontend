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

  ionViewWillEnter() {
    this.isLoading = true; 
    this.quizResultsSub = this.featuredService.fetchquizresults().subscribe(results => {
      
      this.loadedResults = results;
      this.statusSub = this.authService.userStatus.subscribe(
        status => {
          
          if(status < 3)
          {          
            this.isAdmin = true;
          }
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
