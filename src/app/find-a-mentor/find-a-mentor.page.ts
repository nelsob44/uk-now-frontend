import { Component, OnInit, OnDestroy } from '@angular/core';
import { FeaturedService } from 'src/app/featured.service';
import { Mentor } from '../blog/blog.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-find-a-mentor',
  templateUrl: './find-a-mentor.page.html',
  styleUrls: ['./find-a-mentor.page.scss'],
})
export class FindAMentorPage implements OnInit, OnDestroy {
  mentorsData: Mentor[];
  private mentorsSub: Subscription;

  constructor(private featuredService: FeaturedService) { }

  ngOnInit() {
    this.mentorsSub = this.featuredService.mentors.subscribe(mentors => {
      this.mentorsData = mentors;
    });    
  }

  ngOnDestroy() {
    if (this.mentorsSub) {
      this.mentorsSub.unsubscribe();
    }
  }

}
