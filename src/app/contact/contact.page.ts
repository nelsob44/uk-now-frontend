import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators  } from '@angular/forms';
import { FeaturedService } from '../featured.service';
import { Subscription } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit, OnDestroy {
  form: FormGroup;
  private contactSub: Subscription;
  private authSub: Subscription;

  constructor(private featuredService: FeaturedService,
  private alertCtrl: AlertController,
  private authService: AuthService,
  private router: Router) { }

  ngOnInit() {
    return this.authSub = this.authService.userAuthenticated.subscribe(isAuth => {
      if(isAuth) {
        this.form = new FormGroup({
          senderName: new FormControl(null, {
            updateOn: 'blur',
            validators: [Validators.required, Validators.min(2)]
          }),
          senderEmail: new FormControl(null, {
            updateOn: 'blur',
            validators: [Validators.required, Validators.min(5)]
          }),
          messageDetail: new FormControl(null, {
            updateOn: 'blur',
            validators: [Validators.required, Validators.min(5)]
          })    
        });
      } else {
        this.router.navigate(['/home']);
      }
    });
    
  }

  forwardMessage() {
    const senderName = this.form.value.senderName;
    const senderEmail = this.form.value.senderEmail;
    const messageDetail = this.form.value.messageDetail;
    
    return this.contactSub = this.featuredService.sendEmail(
      senderName,
      senderEmail,
      messageDetail
    ).pipe(
      take(1),
      map(data => {
        
        this.alertCtrl.create({
            header: 'Message Sent!',
            message: 'Your message has been sent, we will endeavour to respond as soon as possible',
            buttons: [{text: 'Ok', handler: () => {
              console.log(data);
            }}]
          }).then(alertEl => {
            alertEl.present();
          });
      })
    ).subscribe(() => {
      this.form.reset();
      this.router.navigate(['/featured/tabs/stories']);
    });
    ;
  }

  ngOnDestroy() {
    if (this.contactSub) {
      this.contactSub.unsubscribe();
      this.authSub.unsubscribe();
    }
  }

}
