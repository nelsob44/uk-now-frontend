import { Component, OnInit, OnDestroy } from '@angular/core';
import { FeaturedService } from 'src/app/featured.service';
import { Mentor } from 'src/app/blog/blog.model';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mentor-details',
  templateUrl: './mentor-details.page.html',
  styleUrls: ['./mentor-details.page.scss'],
})
export class MentorDetailsPage implements OnInit, OnDestroy {
  mentor: Mentor;
  private mentorSub: Subscription;

  constructor(
    private featuredService: FeaturedService,
    private route: ActivatedRoute,
    private navCtrl: NavController
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

  ngOnDestroy() {
    if (this.mentorSub) {
      this.mentorSub.unsubscribe();
    }
  }
}
