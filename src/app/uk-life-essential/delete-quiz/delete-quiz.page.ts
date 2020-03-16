import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FeaturedService } from 'src/app/featured.service';
import { take, map } from 'rxjs/operators';

@Component({
  selector: 'app-delete-quiz',
  templateUrl: './delete-quiz.page.html',
  styleUrls: ['./delete-quiz.page.scss'],
})
export class DeleteQuizPage implements OnInit, OnDestroy {
  form: FormGroup;
  private authSub: Subscription;
  private deleteSub: Subscription;
  private statusSub: Subscription;
  isLoading = false;
  isAdmin = false;

  constructor(private authService: AuthService,
  private featuredService: FeaturedService,
  private router: Router) { }

  ngOnInit() {
    return this.authSub = this.authService.userAuthenticated.subscribe(isAuth => {
      if(isAuth) {
        this.form = new FormGroup({
          subject: new FormControl(null, {
            updateOn: 'blur',
            validators: []
          })  
        });
      } else {
        this.router.navigate(['/home']);
      }
    });
  }

  ionViewWillEnter() {
    this.isLoading = true; 
    
      this.statusSub = this.authService.userStatus.subscribe(
        status => {
          
          if(status != null && (status < 3))
          {          
            this.isAdmin = true;
          } else {
            this.router.navigate(['/uk-life-essential']);
          }
        });       
  
     this.isLoading = false;      
  }

  onDeleteQuiz() {
    
    if(!this.form.value) {
      return;
    }
    
    return this.featuredService.deleteQuiz(
      this.form.value.subject
    ).pipe(
      take(1),
      map(dataRes => {        
        console.log(dataRes);        
      })
    ).subscribe(() => {      
      this.router.navigate(['/uk-life-essential']);
    })   
  }

  ngOnDestroy() {
    if (this.authSub) {
      this.statusSub.unsubscribe();
      this.authSub.unsubscribe();
      
    }
  }

}
