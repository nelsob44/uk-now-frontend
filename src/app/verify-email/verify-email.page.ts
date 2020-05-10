import { Component, OnInit, OnDestroy } from '@angular/core';
import { FeaturedService } from '../featured.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss'],
})
export class VerifyEmailPage implements OnInit, OnDestroy {
  private verificationSub: Subscription;
  email: string;
  tokenString: string;
  isValid = true;
  isVerified = false;

  constructor(private featuredService: FeaturedService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private navCtrl: NavController) { }

  ngOnInit() {
    
    this.route.paramMap.subscribe( params => {
      this.email = params.get('email');
      this.tokenString = params.get('tokenString');
      
      if(this.email == null || this.tokenString == null) {
        this.isValid = false;
      } else {
        
        this.loadingCtrl.create({keyboardClose: true, message: 'Verifying email....'})
        .then(loadingEl => {
          loadingEl.present();

          this.verificationSub = this.featuredService.verifyEmail(this.email, this.tokenString).subscribe(verified => {
            if(verified) {
              if(verified === 'Your email has been verified') {          
                this.isVerified = true;
                this.showAlert(verified);
              } else {
                this.isVerified = false;
                this.showAlert(verified);
              }
            }            
          loadingEl.dismiss();   
        }, errorResponse => {
            loadingEl.dismiss();
            const errorCode = errorResponse.error.errors;
                
            this.showAlert(errorCode);
                        
          });
        });        
        
      }
      
    });
  }

  private showAlert(message: string) {
    this.alertCtrl.create({      
      message: message,
      buttons: ['Okay']
    }).then(alertEl => alertEl.present());
  }

  ngOnDestroy() {
    
    if (this.verificationSub) {      
      this.verificationSub.unsubscribe();
    }
  }


}
