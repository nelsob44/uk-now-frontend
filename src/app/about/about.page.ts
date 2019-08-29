import { Component, OnInit } from '@angular/core';
import { FeaturedService } from 'src/app/featured.service';
import { About } from './about.model';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  aboutData: About;

  constructor(private featuredService: FeaturedService) { }

  ngOnInit() {
    this.aboutData = this.featuredService.about;
  }

}
