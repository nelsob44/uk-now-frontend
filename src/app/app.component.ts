import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController, AlertController } from '@ionic/angular';

import { Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private authSub: Subscription;
  private totalUserSub: Subscription;
  public previousAuthState = false;
  public totalUsers: number;
     
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private menu: MenuController,
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    this.authSub = this.authService.userAuthenticated.subscribe(isAuth => {
      if(!isAuth && this.previousAuthState !== isAuth) {
        this.router.navigateByUrl('/home');
      }   
      this.previousAuthState = isAuth;      
    });   
    
  }

  private showAlert(message: string) {
    this.alertCtrl.create({      
      message: "Sorry, you need to login or signup to access the " + message + " page",
      buttons: ['Okay']
    }).then(alertEl => alertEl.present());
  }

  ionWiewWillEnter() {
      
      this.totalUserSub = this.authService.totalUsers.subscribe(totalusers => {
        
        this.totalUsers = totalusers;
      }); 
  }

  login() {
    this.router.navigateByUrl('/auth');
  }   

  onLogout() {
    this.authService.logout();
    // this.router.navigateByUrl('/auth');
  }

  ngOnDestroy() {
    if(this.authSub) {
      this.authSub.unsubscribe();
      this.totalUserSub.unsubscribe();
    }
  }

}
