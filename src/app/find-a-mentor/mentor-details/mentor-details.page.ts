import { Component, OnInit } from '@angular/core';
import { FeaturedService } from 'src/app/featured.service';
import { Mentor } from 'src/app/blog/blog.model';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-mentor-details',
  templateUrl: './mentor-details.page.html',
  styleUrls: ['./mentor-details.page.scss'],
})
export class MentorDetailsPage implements OnInit {
  mentor: Mentor;

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
      this.mentor = this.featuredService.getMentor(paramMap.get('mentorId'));
    });
  }

}
