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

 onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    

    // for(let i = 0; i < data.length; i++ ){
    //   const firstname = data[i].firstname.toLowerCase();
    //   const lastname = data[i].lastname.toLowerCase();
    //   const email = firstname + lastname + '@yahoo.com';
    //   const password = 'northumbria';

      this.isLoading = true;
      this.loadingCtrl.create({keyboardClose: true, message: this.isLogin ? 'Logging in....' : 'Signing up....' })
      .then(loadingEl => {
        loadingEl.present();
        const firstname = form.value.firstname;
        const lastname = form.value.lastname;
        const email = form.value.email;
        const password = form.value.password;
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
          this.isLogin ? this.router.navigateByUrl('/featured/tabs/stories') : this.showAlert('Account created. You can now log in');
          this.isLogin ? '' : this.isLogin = true;

        }, errorResponse => {
          loadingEl.dismiss();
          const errorCode = errorResponse.error.message;

          this.showAlert(errorCode);
          this.isLoading = false;
        });      
      });
              
  }  

  private showAlert(message: string) {
    this.alertCtrl.create({      
      message: message,
      buttons: ['Okay']
    }).then(alertEl => alertEl.present());
  }


  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }  

}
