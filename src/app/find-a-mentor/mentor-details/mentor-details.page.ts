import { Component, OnInit, OnDestroy } from '@angular/core';
import { FeaturedService } from 'src/app/featured.service';
import { Mentor } from 'src/app/blog/blog.model';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
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
  private statusSub: Subscription;
  isAdmin = false;
  type = 'mentor';

  constructor(
    private featuredService: FeaturedService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private navCtrl: NavController,
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
        if(status < 3)
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

  ngOnDestroy() {
    if (this.mentorSub) {
      this.mentorSub.unsubscribe();
      this.statusSub.unsubscribe();
    }
  }
}
