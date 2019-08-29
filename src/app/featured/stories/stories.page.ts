import { Component, OnInit } from '@angular/core';
import { FeaturedService } from 'src/app/featured.service';
import { IonItemSliding } from '@ionic/angular';
import { Story } from './story.model';

@Component({
  selector: 'app-stories',
  templateUrl: './stories.page.html',
  styleUrls: ['./stories.page.scss'],
})
export class StoriesPage implements OnInit {
  loadedStories: Story[];

  constructor(private featuredService: FeaturedService) { }

  ngOnInit() {
    this.loadedStories = this.featuredService.stories;
  }

  ionViewWillEnter() {
    this.loadedStories = this.featuredService.stories;
  }

  onEdit(storyId, slidingItem) {
    console.log(storyId);
    console.log(slidingItem);
  }

}
