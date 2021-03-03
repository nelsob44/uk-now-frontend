import { Component, OnInit, OnDestroy } from '@angular/core';
import { FeaturedService } from 'src/app/featured.service';
import { Mentor } from 'src/app/blog/blog.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { take, map } from 'rxjs/operators';

@Component({
  selector: 'app-mentor-details',
  templateUrl: './mentor-details.page.html',
  styleUrls: ['./mentor-details.page.scss'],
})
export class MentorDetailsPage implements OnInit, OnDestroy {
  mentor: Mentor;
  private mentorSub: Subscription;
  private userSub: Subscription;
  private statusSub: Subscription;
  private sendEmailSub: Subscription;
  private isLoading: false;
  private loggedInUserEmail: string;
  isAdmin = false;
  type = 'mentor';

  constructor(
    private featuredService: FeaturedService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router
    ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('mentorId')) {
        this.navCtrl.navigateBack('/find-a-mentor');
      }
      this.mentorSub = this.featuredService.getMentor(paramMap.get('mentorId')).subscribe(mentor => {
        this.mentor = mentor;
      });      
    });

    this.userSub = this.authService.user.subscribe(user => {
      if(user) {
        this.loggedInUserEmail = user.email;
        
        if(user.status != null && (user.status < 3)) {
          this.isAdmin = true;
        }
      } 
    }); 
  }

  ionViewWillEnter() {
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('mentorId')) {
        this.navCtrl.navigateBack('/find-a-mentor');
      }
      
      this.mentorSub = this.featuredService.fetchmentor(paramMap.get('mentorId')).subscribe(mentor => {
         this.mentor = mentor;
        });     
         
    });  
    this.statusSub = this.authService.userStatus.subscribe(
      status => {
        if(status != null && (status < 3))
        {
          this.isAdmin = true;
        }
      });   
  }

  onDelete(mentorId: string) {
       
    return this.featuredService.deleteItem(
      mentorId,
      this.type
    ).pipe(
      take(1),
      map(dataRes => {        
        console.log(dataRes);        
      })
    ).subscribe(() => {      
      this.router.navigate(['/find-a-mentor']);
    })   
  }

  onBackToMentors() {
    this.router.navigate(['/find-a-mentor']);
  }

  private showAlert(message: string) {
    this.alertCtrl.create({      
      message: message,
      buttons: ['Okay']
    }).then(alertEl => alertEl.present());
  }

  onConnectMentor() {
    this.loadingCtrl.create({keyboardClose: true, message: 'Sending your connection request....'})
    .then(loadingEl => {
      loadingEl.present();

      this.sendEmailSub = this.featuredService.sendMentorConnectionEmail(this.loggedInUserEmail, this.mentor.mentorEmail).subscribe(data => {
        
        if(data) {
          this.showAlert(data);
        } 
      loadingEl.dismiss();   
      }, errorResponse => {
        loadingEl.dismiss();
        
        const errorCode = errorResponse.error.errors;
                
        this.showAlert(errorCode);
       
        this.isLoading = false;
      });
    });
  }

  ngOnDestroy() {
    if (this.mentorSub) {
      this.mentorSub.unsubscribe();
    }

    if(this.userSub) {
      this.userSub.unsubscribe();
    }
    if(this.statusSub) {
      this.statusSub.unsubscribe();
    }
    if(this.sendEmailSub) {
      this.sendEmailSub.unsubscribe();
    }
  }
}
