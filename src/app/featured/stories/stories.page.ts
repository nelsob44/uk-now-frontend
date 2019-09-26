import { Component, OnInit, OnDestroy } from '@angular/core';
import { FeaturedService } from 'src/app/featured.service';
import { IonItemSliding } from '@ionic/angular';
import { Story } from './story.model';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stories',
  templateUrl: './stories.page.html',
  styleUrls: ['./stories.page.scss'],
})
export class StoriesPage implements OnInit, OnDestroy {
  loadedStories: Story[];
  private storiesSub: Subscription;
  private statusSub: Subscription;
  isLoading = false; 
  isAdmin = false; 
  private pageSub: Subscription;  
  pageTotal: number;
  pageNumber: number;
  numberOfPages: number;
  nextPage: number;
  currentPage: number;
  firstPage: number;
  lastPage: number;
  previousPage: number;

  constructor(private featuredService: FeaturedService, 
  private router: Router,
  private authService: AuthService) { }

  ngOnInit() {
    this.isLoading = true;
    this.storiesSub = this.featuredService.stories.subscribe(stories => {
      this.loadedStories = stories;

      this.pageSub = this.featuredService.storyTotalItems.subscribe(pageArray => {
        this.pageTotal = pageArray[0];   

        this.numberOfPages = Math.ceil(this.pageTotal / 10);
        this.lastPage = this.numberOfPages;
        this.firstPage = 1;
        
        this.nextPage = this.firstPage + 1;
        this.previousPage = this.nextPage - 1;
                          
      }); 
      
      this.isLoading = false; 
    });    
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.storiesSub = this.featuredService.fetchstories(this.currentPage).subscribe(stories => {
      this.loadedStories = stories;
      
      this.isLoading = false; 
    });  

    this.statusSub = this.authService.userStatus.subscribe(
      status => {
        
        if(+status < 3)
        {          
          this.isAdmin = true;
        }
      });    
  }

  onScrollNext(page: number) {
    
    this.isLoading = true;
    
    this.storiesSub = this.featuredService.fetchstories(page).subscribe(stories => {
      this.loadedStories = stories;
      this.nextPage = page + 1;
      this.previousPage = page;
      if(this.previousPage == 0) {
        this.previousPage = 1;
      }
      this.isLoading = false;   
         
    });    
    
  }

  onScrollPrev(page: number) {
    
    this.isLoading = true;
    
    this.storiesSub = this.featuredService.fetchstories(page).subscribe(stories => {
      this.loadedStories = stories;
      this.nextPage = page;
      this.previousPage = page - 1;
      if(this.previousPage == 0) {
        this.previousPage = 1;
      }
      this.isLoading = false;       
    });    
    
  }

  onScrollLast(page: number) {
    
    this.isLoading = true;
    
    this.storiesSub = this.featuredService.fetchstories(page).subscribe(stories => {
      this.loadedStories = stories;
      this.nextPage = page;
      this.previousPage = page - 1;
      if(this.previousPage == 0) {
        this.previousPage = 1;
      }
           
      this.isLoading = false;       
    });    
    
  }

  onScrollFirst(page: number) {
    
    this.isLoading = true;
    
    this.storiesSub = this.featuredService.fetchstories(page).subscribe(stories => {
      this.loadedStories = stories;
      this.nextPage = page + 1;
      this.previousPage = page;
      if(this.previousPage == 0) {
        this.previousPage = 1;
      }
           
      this.isLoading = false;       
    });    
    
  }



  onEdit(storyId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    
    if(this.isAdmin) {
      this.router.navigate(['/', 'featured', 'tabs', 'stories', 'edit-story', storyId]);
    } else {
      this.router.navigate(['/', 'featured', 'tabs', 'stories']);

    }    
  }

  ngOnDestroy() {
    if (this.storiesSub) {
      this.storiesSub.unsubscribe();
      this.statusSub.unsubscribe();
      this.pageSub.unsubscribe();
    }
  }

}
