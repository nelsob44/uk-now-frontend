import { Component, OnInit } from '@angular/core';
import { FeaturedService } from 'src/app/featured.service';
import { Mentor } from '../blog/blog.model';

@Component({
  selector: 'app-find-a-mentor',
  templateUrl: './find-a-mentor.page.html',
  styleUrls: ['./find-a-mentor.page.scss'],
})
export class FindAMentorPage implements OnInit {
  mentorsData: Mentor[];

  constructor(private featuredService: FeaturedService) { }

  ngOnInit() {
    this.mentorsData = this.featuredService.mentors;
  }

}
