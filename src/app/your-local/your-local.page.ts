import { Component, OnInit, OnDestroy } from '@angular/core';
import { FeaturedService } from 'src/app/featured.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Local } from '../blog/blog.model';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { NavController, IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-your-local',
  templateUrl: './your-local.page.html',
  styleUrls: ['./your-local.page.scss'],
})
export class YourLocalPage implements OnInit, OnDestroy {
  loadedLocals: Local[];
  private localsSub: Subscription;
  isLoading = false;
  isAdmin = false;
  private statusSub: Subscription;
  transferIdLocal: Local;
  private pageSub: Subscription;  
  pageTotal: number;
  pageNumber: number;
  numberOfPages: number;
  nextPage: number;
  currentPage: number;
  firstPage: number;
  lastPage: number;
  previousPage: number;
  private authSub: Subscription;
  private totalUserSub: Subscription;
  private totalUsers: number;
  private userName: string;
  private userNameSub: Subscription;  
  myGroup: FormGroup;
  private loadedLocalTypes = [];

  constructor(private featuredService: FeaturedService, 
  private router: Router,
  private navCtrl: NavController,
  private authService: AuthService) { }

  ngOnInit() {
    this.myGroup = new FormGroup({
       localType: new FormControl()
    });
    return this.authSub = this.authService.userAuthenticated.subscribe(isAuth => {
      if(isAuth) {
        this.isLoading = true;
        this.localsSub = this.featuredService.locals.subscribe(locals => {
          this.loadedLocals = locals;

          this.pageSub = this.featuredService.localTotalItems.subscribe(pageArray => {
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
    this.localsSub = this.featuredService.fetchlocals(this.currentPage).subscribe(locals => {
      this.loadedLocals = locals;
      
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
      for(let i = 0; i < this.loadedLocals.length; i++) {
      
        if(!this.loadedLocalTypes.includes(this.loadedLocals[i].localType)) {
          this.loadedLocalTypes.push(this.loadedLocals[i].localType);          
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


  onEdit(localId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    if(this.isAdmin) {
      this.router.navigate(['/', 'your-local', 'edit-your-local', localId]);
    } else {
      this.router.navigate(['/', 'your-local']);
    }
    
  }

  transferId(localId: Local) {
    
    this.transferIdLocal = localId;  
  }

  refreshFilter() {
    this.myGroup.reset();
    this.ionViewWillEnter();
  }

  onScrollNext(page: number) {
    
    this.isLoading = true;
    
    this.localsSub = this.featuredService.fetchlocals(page).subscribe(locals => {
      this.loadedLocals = locals;
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
    
    this.localsSub = this.featuredService.fetchlocals(page).subscribe(locals => {
      this.loadedLocals = locals;
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
    
    this.localsSub = this.featuredService.fetchlocals(page).subscribe(locals => {
      this.loadedLocals = locals;
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
    
    this.localsSub = this.featuredService.fetchlocals(page).subscribe(locals => {
      this.loadedLocals = locals;
      this.nextPage = page + 1;
      this.previousPage = page;
      if(this.previousPage == 0) {
        this.previousPage = 1;
      }
           
      this.isLoading = false;       
    });    
    
  }

  onSearchLocal() {
    if(!this.myGroup.value) {
      return;
    }

    this.isLoading = true;
    this.localsSub = this.featuredService.fetchlocalsFilter(this.currentPage, this.myGroup.value.localType).subscribe(locals => {
      this.loadedLocals = locals;
      
      this.isLoading = false; 
    });
  }

  onSearchLocalFilter(localType: string) {
    this.isLoading = true;
    this.localsSub = this.featuredService.fetchlocalsFilter(this.currentPage, localType).subscribe(locals => {
      this.loadedLocals = locals;
      
      this.isLoading = false; 
    });
  }

  ngOnDestroy() {
    if (this.localsSub) {
      this.localsSub.unsubscribe();
      this.statusSub.unsubscribe();
      this.pageSub.unsubscribe();
      this.totalUserSub.unsubscribe();
      this.userNameSub.unsubscribe();
    }
  }
}
