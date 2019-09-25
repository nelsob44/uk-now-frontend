import { Component, OnInit, OnDestroy } from '@angular/core';
import { FeaturedService } from 'src/app/featured.service';

import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Story } from '../story.model';
import { switchMap, take, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-story-detail',
  templateUrl: './story-detail.page.html',
  styleUrls: ['./story-detail.page.scss'],
})
export class StoryDetailPage implements OnInit, OnDestroy {
  story: Story;
  theStory: Story;
  theStoryTwo: Story;
  private storySub: Subscription;
  private statusSub: Subscription;
  private likeSub: Subscription;
  likedBefore = false;
  isAdmin = false;
  type = 'story';

  constructor(
    private featuredService: FeaturedService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private navCtrl: NavController,
    private router: Router
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

  ionViewWillEnter() {
    
    this.likeSub = this.authService.userId.subscribe(userId => {
      let check = this.story.storyLikers.indexOf(userId);
          if (check > -1) {            
            this.likedBefore = true;            
          }
    });

    this.statusSub = this.authService.userStatus.subscribe(
      status => {
        if(status < 3)
        {
          this.isAdmin = true;
        }
      });   
  }

  onDelete(eventId: string) {
       
    return this.featuredService.deleteItem(
      eventId,
      this.type
    ).pipe(
      take(1),
      map(dataRes => {        
        console.log(dataRes);        
      })
    ).subscribe(() => {      
      this.router.navigate(['/featured/tabs/stories']);
    })   
  }

  addLike(storyId: string) {
          
      return this.featuredService.getStory(storyId).pipe(
        take(1),
        switchMap(storyRes => {
        const newLikes = ++storyRes.storyLikes;        

          const newStory = new Story(
            storyRes.id,
            storyRes.storyTitle,
            storyRes.storyDetail,
            storyRes.storyImage,
            storyRes.userName,
            storyRes.postedOn,
            newLikes,
            storyRes.storyLikers
          );   

          this.theStory = newStory; 
          return this.featuredService.updateStoryLike(
            storyRes.id,          
            newLikes.toString()          
          );       
        })
      ).subscribe(story => {  
        this.likedBefore = true;      
        this.story = this.theStory;
      });      
   
  }

  ngOnDestroy() {
    if (this.storySub) {
      this.storySub.unsubscribe();
      this.statusSub.unsubscribe();
    }
  }

}
