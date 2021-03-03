import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FeaturedService } from 'src/app/featured.service';
import { Essentials } from '../about/about.model';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { IonItemSliding } from '@ionic/angular';


@Component({
  selector: 'app-uk-life-essential',
  templateUrl: './uk-life-essential.page.html',
  styleUrls: ['./uk-life-essential.page.scss'],
})
export class UkLifeEssentialPage implements OnInit, OnDestroy {
  @ViewChild('list', { read: ElementRef, static: false}) list: ElementRef;
  @ViewChild('list1', { read: ElementRef, static: false}) list1: ElementRef;
  @ViewChild('list2', { read: ElementRef, static: false}) list2: ElementRef;
  @ViewChild('list3', { read: ElementRef, static: false}) list3: ElementRef;
  @ViewChild('list4', { read: ElementRef, static: false}) list4: ElementRef;
  @ViewChild('list5', { read: ElementRef, static: false}) list5: ElementRef;
  @ViewChild('list6', { read: ElementRef, static: false}) list6: ElementRef;
  @ViewChild('list7', { read: ElementRef, static: false}) list7: ElementRef;
  @ViewChild('list8', { read: ElementRef, static: false}) list8: ElementRef;
  @ViewChild('list9', { read: ElementRef, static: false}) list9: ElementRef;
  @ViewChild('list10', { read: ElementRef, static: false}) list10: ElementRef;
  @ViewChild('list11', { read: ElementRef, static: false}) list11: ElementRef;
  @ViewChild('list12', { read: ElementRef, static: false}) list12: ElementRef;

  listActive = true;
  list1Active = true;
  list2Active = true;
  list3Active = true;
  list4Active = true;
  list5Active = true;
  list6Active = true;
  list7Active = true;
  list8Active = true;
  list9Active = true;
  list10Active = true;
  list11Active = true;
  list12Active = true;
  
  loadedEssentials: Essentials[];
  private essentialsSub: Subscription;
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
  private totalUserSub: Subscription;
  totalUsers: number;
  userName: string;
  private userNameSub: Subscription;
  loadedEssentialsTitles = [];

  constructor(private authService: AuthService, 
  private router: Router,
  
  private featuredService: FeaturedService) { }

  ngOnInit() {
    this.isLoading = true;
    this.essentialsSub = this.featuredService.essentials.subscribe(essentials => {
      this.loadedEssentials = essentials;

      this.pageSub = this.featuredService.essentialTotalItems.subscribe(pageArray => {
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
    this.essentialsSub = this.featuredService.fetchessentials(this.currentPage).subscribe(essentials => {
      this.loadedEssentials = essentials;
      
      this.isLoading = false; 
    });    

    this.statusSub = this.authService.userStatus.subscribe(
      status => {
        
        if(status != null && (status < 3))
        {          
          this.isAdmin = true;
        }
    });

    this.totalUserSub = this.authService.totalUsers.subscribe(totalusers => {
        this.totalUsers = totalusers;        
      });

      this.userNameSub = this.authService.userName.subscribe(userName => {
        this.userName = userName;        
      });  

    setTimeout(() => {
      this.listActive = false;
    }, 3000);
    setTimeout(() => {
      this.list1Active = false;
    }, 6000);
    setTimeout(() => {
      this.list2Active = false;
    }, 9000);

    setTimeout(() => {
      this.list3Active = false;
    }, 12000);

    setTimeout(() => {
      this.list4Active = false;
    }, 15000);
    setTimeout(() => {
      this.list5Active = false;
    }, 18000);

    setTimeout(() => {
      this.list6Active = false;
    }, 21000);

    setTimeout(() => {
      this.list7Active = false;
    }, 24000);

    setTimeout(() => {
      this.list8Active = false;
    }, 27000);

    setTimeout(() => {
      this.list9Active = false;
    }, 30000);

    setTimeout(() => {
      this.list10Active = false;
    }, 33000);

    setTimeout(() => {
      this.list11Active = false;
    }, 36000);

    setTimeout(() => {
      this.listActive = true;
    }, 36000)

  }

  onEdit(essentialId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    if(this.isAdmin) {
      this.router.navigate(['/', 'uk-life-essential', 'edit-life-essential', essentialId]);
    } else {
      this.router.navigate(['/', 'uk-life-essential']);
    }
    
  }

  onSeeResults() {   
    this.router.navigate(['/', 'uk-life-essential', 'quiz-results']);    
  }

  onTakeQuiz() {    
    this.router.navigate(['/', 'uk-life-essential', 'uk-quiz-details']);    
  }

  onCreateStory() {
    this.router.navigate(['/', 'uk-life-essential', 'edit-life-essential', '']);
  }

  onScrollNext(page: number) {
    
    this.isLoading = true;
    
    this.essentialsSub = this.featuredService.fetchessentials(page).subscribe(essentials => {
      this.loadedEssentials = essentials;
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
    
    this.essentialsSub = this.featuredService.fetchessentials(page).subscribe(essentials => {
      this.loadedEssentials = essentials;
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
    
    this.essentialsSub = this.featuredService.fetchessentials(page).subscribe(essentials => {
      this.loadedEssentials = essentials;
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
    
    this.essentialsSub = this.featuredService.fetchessentials(page).subscribe(essentials => {
      this.loadedEssentials = essentials;
      this.nextPage = page + 1;
      this.previousPage = page;
      if(this.previousPage == 0) {
        this.previousPage = 1;
      }
           
      this.isLoading = false;       
    });    
    
  }


  ngOnDestroy() {
    if (this.essentialsSub) {
      this.essentialsSub.unsubscribe();
      this.statusSub.unsubscribe();
      this.pageSub.unsubscribe();
      this.totalUserSub.unsubscribe();
      this.userNameSub.unsubscribe();
    }
  }

}
