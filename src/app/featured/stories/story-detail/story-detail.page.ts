import { Component, OnInit, OnDestroy } from '@angular/core';
import { FeaturedService } from 'src/app/featured.service';

import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Story } from '../story.model';
import { switchMap, take, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-story-detail',
  templateUrl: './story-detail.page.html',
  styleUrls: ['./story-detail.page.scss'],
})
export class StoryDetailPage implements OnInit, OnDestroy {
  story: Story;
  private storySub: Subscription;

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
      this.storySub = this.featuredService.getStory(paramMap.get('storyId')).subscribe(story => {
        this.story = story;
      });      
    });
  }

  addLike(id: string) {
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('storyId')) {
        this.navCtrl.navigateBack('/featured/tabs/stories');
      }
      return this.featuredService.getStory(paramMap.get('storyId')).pipe(
        take(1),
        map(storyData => {
          return new Story(
            storyData.id,
            storyData.storyTitle,
            storyData.storyDetail,
            storyData.storyImage,
            storyData.userName,
            storyData.postedOn,
            ++storyData.storyLikes
          );          
        })
      ).subscribe(story => {        
        this.story = story;
      });      
    });
  }

  ngOnDestroy() {
    if (this.storySub) {
      this.storySub.unsubscribe();
    }
  }

}
