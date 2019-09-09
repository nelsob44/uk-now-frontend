import { Component, OnInit, OnDestroy } from '@angular/core';
import { FeaturedService } from 'src/app/featured.service';
import { IonItemSliding } from '@ionic/angular';
import { Story } from './story.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-stories',
  templateUrl: './stories.page.html',
  styleUrls: ['./stories.page.scss'],
})
export class StoriesPage implements OnInit, OnDestroy {
  loadedStories: Story[];
  private storiesSub: Subscription;

  constructor(private featuredService: FeaturedService) { }

  ngOnInit() {
    this.storiesSub = this.featuredService.stories.subscribe(stories => {
      this.loadedStories = stories;
    });    
  }

  ionViewWillEnter() {
    // this.loadedStories = this.featuredService.stories;
  }

  onEdit(storyId, slidingItem) {
    console.log(storyId);
    console.log(slidingItem);
  }

  ngOnDestroy() {
    if (this.storiesSub) {
      this.storiesSub.unsubscribe();
    }
  }

}
