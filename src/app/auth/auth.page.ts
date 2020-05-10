import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponseData } from './auth.service';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLogin = true;
  isLoading = false;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
  }

  //Begin action to process submitted login or signup form
  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const terms = form.value.terms;
    const firstname = form.value.firstname;
    const lastname = form.value.lastname;
    const email = form.value.email;
    const password = form.value.password;
    const confirmpassword = form.value.confirmpassword;
    

    if (!this.isLogin) {
      if(!terms) {
        this.showAlert('You need to agree to terms and conditions to proceed');
        return;
      }

      if(password !== confirmpassword) {
        this.showAlert('Your passwords do not match. Please enter and confirm your password again');
        return;
      }
    }
      this.isLoading = true;
      this.loadingCtrl.create({keyboardClose: true, message: this.isLogin ? 'Logging in....' : 'Signing up....' })
      .then(loadingEl => {
        loadingEl.present();
        
        let authObs: Observable<AuthResponseData>;

        if(!this.isLogin) {
          
          authObs = this.authService.signup(firstname, lastname, email, password);
        }
        else {
          authObs = this.authService.login(email, password);
        }    
        
        return authObs.subscribe(resData => {
          
          loadingEl.dismiss();
          this.isLoading = false;
          form.reset();
          this.isLogin ? this.router.navigateByUrl('/featured/tabs/stories') : this.showAlert('Account created. You can now log in. An email has been sent to you to verify your email.');
          this.isLogin ? '' : this.isLogin = true;

        }, errorResponse => {
          loadingEl.dismiss();
          const errorCode = errorResponse.error.message;

          this.showAlert(errorCode);
          this.isLoading = false;
        });      
      });
            
  }  

  //Prepare alert message
  private showAlert(message: string) {
    this.alertCtrl.create({      
      message: message,
      buttons: ['Okay']
    }).then(alertEl => alertEl.present());
  }

  //Toggle signup and login forms
  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }  

}
