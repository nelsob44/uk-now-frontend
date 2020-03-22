import { Component, OnInit, OnDestroy } from '@angular/core';
import { Event } from './event.model';
import { FeaturedService } from 'src/app/featured.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { IonItemSliding } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-local-events',
  templateUrl: './local-events.page.html',
  styleUrls: ['./local-events.page.scss'],
})
export class LocalEventsPage implements OnInit, OnDestroy {
  private eventsSub: Subscription;
  private statusSub: Subscription;
  private authSub: Subscription;
  loadedEvents: Event[];
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
  private totalUserSub: Subscription;
  private totalUsers: number;
  private userName: string;
  private userNameSub: Subscription;
  private loadedEventTitles = [];

  constructor(private featuredService: FeaturedService, 
  private router: Router,
  private authService: AuthService) { }

  ngOnInit() {
    return this.authSub = this.authService.userAuthenticated.subscribe(isAuth => {
      if(isAuth) {
        this.isLoading = true;
        this.eventsSub = this.featuredService.events.subscribe(events => {
          this.loadedEvents = events;

          this.pageSub = this.featuredService.eventTotalItems.subscribe(pageArray => {
            this.pageTotal = pageArray[0];   

            this.numberOfPages = Math.ceil(this.pageTotal / 10);
            this.lastPage = this.numberOfPages;
            this.firstPage = 1;
            
            this.nextPage = this.firstPage + 1;
            this.previousPage = this.nextPage - 1;
                              
          });
          
          this.isLoading = false; 
        }); 
     } else {
        this.router.navigate(['/home']);
      }
    });
    
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.eventsSub = this.featuredService.fetchevents(this.currentPage).subscribe(events => {
      this.loadedEvents = events;
      
      this.isLoading = false; 
    });   

    this.statusSub = this.authService.userStatus.subscribe(
      status => {
        
        if(status != null && (status < 3))
        {          
          this.isAdmin = true;
        }
      });

    setTimeout(() => {
        for(let i = 0; i < this.loadedEvents.length; i++) {
        
          if(!this.loadedEventTitles.includes(this.loadedEvents[i].eventName)) {
            this.loadedEventTitles.push(this.loadedEvents[i].eventName);          
          }
        };
      }, 1500) 

      this.totalUserSub = this.authService.totalUsers.subscribe(totalusers => {
        this.totalUsers = totalusers;        
      });

      this.userNameSub = this.authService.userName.subscribe(userName => {
        this.userName = userName;        
      });  
    
  }

  refreshFilter() {    
    this.ionViewWillEnter();
  }

  onSearchEventFilter(eventName: string) {
    this.isLoading = true;
    this.eventsSub = this.featuredService.fetchEventsFilter(this.currentPage, eventName).subscribe(events => {
      this.loadedEvents = events;
      
      this.isLoading = false; 
    });
  }

  onCreateEvent() {    
    if(this.isAdmin) {
      this.router.navigate(['/', 'featured', 'tabs', 'local-events', 'edit-local-event',
        '']);
    } else {
      this.router.navigate(['/', 'featured', 'tabs', 'local-events']);

    }    
  }

  onEdit(eventId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    if(this.isAdmin) {
      this.router.navigate(['/', 'featured', 'tabs', 'local-events', 'edit-local-event', eventId]);
    } else {
      this.router.navigate(['/', 'featured', 'tabs', 'local-events']);
    }
    
  }

  onScrollNext(page: number) {
    
    this.isLoading = true;
    
    this.eventsSub = this.featuredService.fetchevents(page).subscribe(events => {
      this.loadedEvents = events;
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
    
    this.eventsSub = this.featuredService.fetchevents(page).subscribe(events => {
      this.loadedEvents = events;
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
    
    this.eventsSub = this.featuredService.fetchevents(page).subscribe(events => {
      this.loadedEvents = events;
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
    
    this.eventsSub = this.featuredService.fetchevents(page).subscribe(events => {
      this.loadedEvents = events;
      this.nextPage = page + 1;
      this.previousPage = page;

      if(this.previousPage == 0) {
        this.previousPage = 1;
      }
           
      this.isLoading = false;       
    });    
    
  }


  ngOnDestroy() {
    if (this.eventsSub) {
      this.eventsSub.unsubscribe();
      this.statusSub.unsubscribe();
      this.pageSub.unsubscribe();
      this.authSub.unsubscribe();
      this.totalUserSub.unsubscribe();
      this.userNameSub.unsubscribe();
    }
  }

}
