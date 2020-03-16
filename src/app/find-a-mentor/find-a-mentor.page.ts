import { Component, OnInit, OnDestroy } from '@angular/core';
import { FeaturedService } from 'src/app/featured.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Mentor } from '../blog/blog.model';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-find-a-mentor',
  templateUrl: './find-a-mentor.page.html',
  styleUrls: ['./find-a-mentor.page.scss'],
})
export class FindAMentorPage implements OnInit, OnDestroy {
  mentorsData: Mentor[];
  isLoading = false;
  isAdmin = false;
  private mentorsSub: Subscription;
  private authSub: Subscription;
  private statusSub: Subscription;
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
  myGroup: FormGroup;
  private userName: string;
  private userNameSub: Subscription;
  private loadedMentorFields = [];

  constructor(private featuredService: FeaturedService,
  private authService: AuthService,
  private router: Router
  ) { }

  ngOnInit() {
    this.myGroup = new FormGroup({
      mentorField: new FormControl()
    });
     return this.authSub = this.authService.userAuthenticated.subscribe(isAuth => {
      if(isAuth) {
        this.isLoading = true;
        this.mentorsSub = this.featuredService.mentors.subscribe(mentors => {
          this.mentorsData = mentors;

          this.pageSub = this.featuredService.mentorTotalItems.subscribe(pageArray => {
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
    this.mentorsSub = this.featuredService.fetchmentors(this.currentPage).subscribe(mentors => {
      this.mentorsData = mentors;
      
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
      for(let i = 0; i < this.mentorsData.length; i++) {
      
        if(!this.loadedMentorFields.includes(this.mentorsData[i].mentorField)) {
          this.loadedMentorFields.push(this.mentorsData[i].mentorField);          
        }
      };
    }, 1000)

      this.totalUserSub = this.authService.totalUsers.subscribe(totalusers => {
        this.totalUsers = totalusers;        
      });

      this.userNameSub = this.authService.userName.subscribe(userName => {
        this.userName = userName;        
      });    
  }

  onSearchMentor() {
    if(!this.myGroup.value) {
      return;
    }

    this.mentorsSub = this.featuredService.fetchmentorsFilter(this.currentPage, this.myGroup.value.mentorField).subscribe(mentors => {
      this.mentorsData = mentors;
      
      this.isLoading = false;       
    });    
  }

  refreshFilter() {
    this.myGroup.reset();
    this.ionViewWillEnter();
  }

  onSearchMentorFilter(mentorField: string) {
    this.isLoading = true;
    this.mentorsSub = this.featuredService.fetchmentorsFilter(this.currentPage, mentorField).subscribe(mentors => {
      this.mentorsData = mentors;
      
      this.isLoading = false; 
    });
  }

  onScrollNext(page: number) {
    
    this.isLoading = true;
    
    this.mentorsSub = this.featuredService.fetchmentors(page).subscribe(mentors => {
      this.mentorsData = mentors;
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
    
    this.mentorsSub = this.featuredService.fetchmentors(page).subscribe(mentors => {
      this.mentorsData = mentors;
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
    
    this.mentorsSub = this.featuredService.fetchmentors(page).subscribe(mentors => {
      this.mentorsData = mentors;
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
    
    this.mentorsSub = this.featuredService.fetchmentors(page).subscribe(mentors => {
      this.mentorsData = mentors;
      this.nextPage = page + 1;
      this.previousPage = page;
      if(this.previousPage == 0) {
        this.previousPage = 1;
      }
           
      this.isLoading = false;       
    });    
    
  }


  ngOnDestroy() {
    if (this.mentorsSub) {
      this.mentorsSub.unsubscribe();
      this.statusSub.unsubscribe();
      this.pageSub.unsubscribe();
      this.authSub.unsubscribe();
      this.totalUserSub.unsubscribe();
      this.userNameSub.unsubscribe();
    }
  }

}
