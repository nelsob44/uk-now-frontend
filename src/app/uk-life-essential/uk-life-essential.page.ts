import { Component, OnInit, OnDestroy } from '@angular/core';
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
        
        if(status < 3)
        {          
          this.isAdmin = true;
        }
      });     
  }

  onEdit(essentialId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    if(this.isAdmin) {
      this.router.navigate(['/', 'uk-life-essential', 'edit-life-essential', essentialId]);
    } else {
      this.router.navigate(['/', 'uk-life-essential']);
    }
    
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
    }
  }

}
