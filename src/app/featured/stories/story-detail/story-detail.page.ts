import { Component, OnInit } from '@angular/core';
import { FeaturedService } from 'src/app/featured.service';

import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Story } from '../story.model';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-story-detail',
  templateUrl: './story-detail.page.html',
  styleUrls: ['./story-detail.page.scss'],
})
export class StoryDetailPage implements OnInit {
  story: Story;

  constructor(
    private featuredService: FeaturedService,
    private route: ActivatedRoute,
    private navCtrl: NavController
    ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('storyId')) {
        this.navCtrl.navigateBack('/featured/tabs/stories');
      }
      this.story = this.featuredService.getStory(paramMap.get('storyId'));
    });
  }

  addLike(id: string) {
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('storyId')) {
        this.navCtrl.navigateBack('/featured/tabs/stories');
      }
      this.story = this.featuredService.getStory(paramMap.get('storyId'));
      this.story.storyLikes++;
    });
  }

}
