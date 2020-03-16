import { Component, OnInit, OnDestroy } from '@angular/core';
import { FeaturedService } from 'src/app/featured.service';
import { Blog, Blogcomments } from './blog.model';
import { Subscription } from 'rxjs';
import { IonItemSliding } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.page.html',
  styleUrls: ['./blog.page.scss'],
})
export class BlogPage implements OnInit, OnDestroy {
  loadedBlogs: Blog[];
  isLoading = false;
  isAdmin = false;
  private blogsSub: Subscription;
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
  private userName: string;
  private userNameSub: Subscription;
  private loadedBlogTitles = [];

  constructor(private featuredService: FeaturedService, 
  private authService: AuthService,
  private router: Router) { }

  ngOnInit() {
    
    this.isLoading = true;
    this.blogsSub = this.featuredService.blogs.subscribe(blogs => {
      this.loadedBlogs = blogs;

      this.pageSub = this.featuredService.blogTotalItems.subscribe(pageArray => {
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
    this.blogsSub = this.featuredService.fetchblogs(this.currentPage).subscribe(blogs => {
      this.loadedBlogs = blogs;
      
      this.isLoading = false; 
      this.totalUserSub = this.authService.totalUsers.subscribe(totalusers => {
        this.totalUsers = totalusers;        
      });

      this.userNameSub = this.authService.userName.subscribe(userName => {
        this.userName = userName;        
      });
      
    }); 

    this.statusSub = this.authService.userStatus.subscribe(
      status => {
        
        if(status != null && (status < 3))
        {          
          this.isAdmin = true;
        }
      }); 

      setTimeout(() => {
        for(let i = 0; i < this.loadedBlogs.length; i++) {
        
          if(!this.loadedBlogTitles.includes(this.loadedBlogs[i].blogTitle)) {
            this.loadedBlogTitles.push(this.loadedBlogs[i].blogTitle);          
          }
        };
      }, 1500);
            
  }

  onSearchBlogFilter(blogTitle: string) {
    this.isLoading = true;
    this.blogsSub = this.featuredService.fetchBlogsFilter(this.currentPage, blogTitle).subscribe(blogs => {
      this.loadedBlogs = blogs;
      
      this.isLoading = false; 
    });
  }

  onEdit(blogId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    if(this.isAdmin) {
      this.router.navigate(['/', 'blog', 'blog-edit', blogId]);
    } else {
      this.router.navigate(['/', 'blog']);
    }    
  }

  onCreateBlog() {
    if(this.isAdmin) {
      this.router.navigate(['/', 'blog', 'blog-edit', '']);
    } else {
      this.router.navigate(['/', 'blog']);
    }
  }

  ionViewWillLeave() {
    if (this.pageSub) {
      this.pageSub.unsubscribe();
      this.blogsSub.unsubscribe();
      this.statusSub.unsubscribe();
    }
  }

  onScrollNext(page: number) {
    
    this.isLoading = true;
    
    this.blogsSub = this.featuredService.fetchblogs(page).subscribe(blogs => {
      this.loadedBlogs = blogs;
      this.nextPage = page + 1;
      this.previousPage = page;
      if(this.previousPage == 0) {
        this.previousPage = 1;
      }
      this.isLoading = false;       
    });    
    
  }

  refreshFilter() {    
    this.ionViewWillEnter();
  }

  onScrollPrev(page: number) {
    
    this.isLoading = true;
    
    this.blogsSub = this.featuredService.fetchblogs(page).subscribe(blogs => {
      this.loadedBlogs = blogs;
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
    
    this.blogsSub = this.featuredService.fetchblogs(page).subscribe(blogs => {
      this.loadedBlogs = blogs;
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
    
    this.blogsSub = this.featuredService.fetchblogs(page).subscribe(blogs => {
      this.loadedBlogs = blogs;
      this.nextPage = page + 1;
      this.previousPage = page;
      if(this.previousPage == 0) {
        this.previousPage = 1;
      }
           
      this.isLoading = false;       
    });    
    
  }

  ngOnDestroy() {
    if (this.blogsSub) {
      this.blogsSub.unsubscribe();
      this.statusSub.unsubscribe();
      this.pageSub.unsubscribe();
      this.totalUserSub.unsubscribe();
      this.userNameSub.unsubscribe();
    }
  }
}
