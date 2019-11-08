import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  private authSub: Subscription;
  private previousAuthState = false;

  constructor(private router: Router, 
  private authService: AuthService,
  private alertCtrl: AlertController) { }

  ngOnInit() {
    this.authSub = this.authService.userAuthenticated.subscribe(isAuth => {
      if(!isAuth && this.previousAuthState !== isAuth) {
        this.router.navigateByUrl('/home');
      }
      this.previousAuthState = isAuth;      
    });
  }

  redirectLogin(message: string, type: string) {
    if(!this.previousAuthState) {
      this.showAlert(message);  
      return;
    }

    switch(type) {
      case 'local':
          this.router.navigateByUrl('/your-local');
        break;
      case 'stories':
          this.router.navigateByUrl('/featured/tabs/stories');
        break;
      case 'event':
          this.router.navigateByUrl('/featured/tabs/local-events');
        break;
      case 'question':
          this.router.navigateByUrl('/ask-a-question');
        break;
      case 'essential':
          this.router.navigateByUrl('/uk-life-essential');
        break; 
      case 'contact':
          this.router.navigateByUrl('/contact');
        break;       
      default:
        
    }
    
  }

  private showAlert(message: string) {
    this.alertCtrl.create({      
      message: "Sorry, you need to login or signup to access the " + message + " page",
      buttons: ['Okay']
    }).then(alertEl => alertEl.present());
  }

}
