import { Component, OnInit, OnDestroy } from '@angular/core';
import { FeaturedService } from 'src/app/featured.service';

import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Story } from '../story.model';
import { switchMap, take, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { DomSanitizer } from '@angular/platform-browser';


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
    private router: Router,
    private sanitizer: DomSanitizer
    ) { }

  ngOnInit() {
    let firstStory;
    let videoLinks = [];
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('storyId')) {
        this.navCtrl.navigateBack('/featured/tabs/stories');
      }
      
      this.storySub = this.featuredService.getStory(paramMap.get('storyId')).subscribe(story => {
        
        firstStory = story;

        if(firstStory.youtubeLinkString) {
          const firstYoutube = firstStory.youtubeLinkString.split(',');

          firstYoutube.forEach(v => {
            let newV = this.updateVideoUrl(v);
            
            videoLinks.push(newV);
          
          });
          
          firstStory.youtubeLinkString = videoLinks;
        }
        this.story = firstStory;
        
      });      
    });
  }

  private updateVideoUrl(dangerousVideoUrl: string) {    
    
      return this.sanitizer.bypassSecurityTrustResourceUrl(dangerousVideoUrl);
    
  }

  ionViewWillEnter() {
    let firstStory;
    let videoLinks = [];
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('storyId')) {
        this.navCtrl.navigateBack('/featured/tabs/stories');
      }
      
      this.storySub = this.featuredService.fetchstory(paramMap.get('storyId')).subscribe(story => {
        
        firstStory = story;

        if(firstStory.youtubeLinkString) {
          const firstYoutube = firstStory.youtubeLinkString.split(',');

          firstYoutube.forEach(v => {
            let newV = this.updateVideoUrl(v);
            
            videoLinks.push(newV);
          
          });
          
          firstStory.youtubeLinkString = videoLinks;
        }
        this.story = firstStory;

        this.likeSub = this.authService.userId.subscribe(userId => {
          let check = this.story.storyLikers.indexOf(userId);
              if (check > -1) {            
                this.likedBefore = true;            
              }
        });        
      });      
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
      let firstStory;
      let videoLinks = [];
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
            storyRes.storyLikers,
            storyRes.youtubeLinkString
          );   

          if(newStory.youtubeLinkString) {
          const firstYoutube = newStory.youtubeLinkString.split(',');

          firstYoutube.forEach(v => {
            let newV = this.updateVideoUrl(v);
            
            videoLinks.push(newV);
          
          });
          
          newStory.youtubeLinkString = videoLinks;
        }
        
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
      this.likeSub.unsubscribe();
    }
  }

}
