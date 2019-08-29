import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
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
  constructor(
    private authService: AuthService, 
    private router: Router,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
  }

  

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;
    this.authService.login(email, password);
    this.router.navigateByUrl('/featured/tabs/stories')
    
    form.reset();      
  }  

  private showAlert(message: string) {
    this.alertCtrl.create({
      header: 'Authentication failed',
      message: message,
      buttons: ['Okay']
    }).then(alertEl => alertEl.present());
  }


  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }  

}
