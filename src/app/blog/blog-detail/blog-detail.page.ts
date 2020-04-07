import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FeaturedService } from 'src/app/featured.service';
import { Blog, Blogcomments } from '../blog.model';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';
import { Subscription, pipe } from 'rxjs';
import { switchMap, take, map, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.page.html',
  styleUrls: ['./blog-detail.page.scss'],
})
export class BlogDetailPage implements OnInit, OnDestroy {
  form: FormGroup;
  blog: Blog;
  isReplying = false;
  showComments = false;
  numberComments: number;
  private blogSub: Subscription;
  private statusSub: Subscription; 
  private authSub: Subscription;
  private commSub: Subscription;
  private likeSub: Subscription;
  isAdmin = false;
  isLoggedin = false;
  theBlog: Blog;
  theBlogTwo: Blog;
  likedBefore = false;
  type = 'blog';

  constructor(
    private featuredService: FeaturedService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private navCtrl: NavController,
    private router: Router,
    private alertCtrl: AlertController,
    private sanitizer: DomSanitizer
    ) { }

  ngOnInit() {
    let firstStory;
    let videoLinks = [];
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('blogId')) {
        this.navCtrl.navigateBack('/blog');
      }
      this.blogSub = this.featuredService.getBlog(paramMap.get('blogId')).subscribe(blog => {
        
        firstStory = blog;

        if(firstStory.youtubeLinkString) {
          const firstYoutube = firstStory.youtubeLinkString.split(',');

          firstYoutube.forEach(v => {
            let newV = this.updateVideoUrl(v);
            
            videoLinks.push(newV);
          
          });
          
          firstStory.youtubeLinkString = videoLinks;
        }
        this.blog = firstStory;
        
      });
    });

    this.form = new FormGroup({
      blogId: new FormControl(null, {
        updateOn: 'blur',
        validators: []
      }),  
      blogReply: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      })    
    });

    this.statusSub = this.authService.userStatus.subscribe(
      status => {
        if(status != null && (status < 3))
        {
          this.isAdmin = true;
        }
      }); 
    
  }

  onBackToBlogs() {
    this.router.navigate(['/blog']);
  }

  private updateVideoUrl(dangerousVideoUrl: string) {    
    
      return this.sanitizer.bypassSecurityTrustResourceUrl(dangerousVideoUrl);
    
  }

  ionViewWillEnter() {
    let firstStory;
    let videoLinks = [];
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('blogId')) {
        this.navCtrl.navigateBack('/blog');
      }
      
      this.blogSub = this.featuredService.fetchblog(paramMap.get('blogId')).subscribe(blog => {
        firstStory = blog;

        if(firstStory.youtubeLinkString) {
          const firstYoutube = firstStory.youtubeLinkString.split(',');

          firstYoutube.forEach(v => {
            let newV = this.updateVideoUrl(v);
            
            videoLinks.push(newV);
          
          });
          
          firstStory.youtubeLinkString = videoLinks;
        }     
        this.blog = blog;
        this.numberComments = this.blog.blogComments.length;

        this.likeSub = this.authService.userId.subscribe(userId => {
          let check = this.blog.blogLikers.indexOf(userId);
              if (check > -1) {            
                this.likedBefore = true;            
              }
        });     
      });      
    }); 

    this.authSub = this.authService.userAuthenticated.subscribe(
      isAuthenticated => {
        if(isAuthenticated)
        {
          this.isLoggedin = true;
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

  onCreateReply(blogId: string) {
    return this.featuredService.getBlog(blogId).pipe(
      take(1),
      switchMap(blogRes => {
                
        return this.featuredService.addComment(
            blogId, 
            this.form.value.blogReply,
            this.type,
            new Date().toString()
        )        
      }),
      map(dataRes => {
        
        const newBlogs = [];
        
          for (const key in dataRes) {
            if(dataRes.hasOwnProperty(key)) {
              newBlogs.push(
                new Blog(
                  dataRes[key]._id,
                  dataRes[key].blogTitle,
                  dataRes[key].blogDetails,
                  dataRes[key].blogImage,
                  dataRes[key].blogFirstName,
                  dataRes[key].blogLastName,
                  dataRes[key].blogDate,
                  dataRes[key].blogLikes,
                  dataRes[key].blogComments,
                  dataRes[key].blogNumberOfComments,
                  dataRes[key].blogLikers,
                  dataRes[key].youtubeLinkString
                )
              );
            }
          }

        this.theBlogTwo = newBlogs[0];
                  
      })
    ).subscribe(() => {
      this.blog = this.theBlogTwo;        
        this.numberComments++;
        this.isReplying = false;
        
        this.form.reset();
    });
      
  }

  onDelete(blogId: string) {
    if(!this.isAdmin) {
      return;
    }  
    
    return this.featuredService.deleteItem(
      blogId,
      this.type
    ).pipe(
      take(1),
      map(dataRes => {        
        console.log(dataRes);        
      })
    ).subscribe(() => {      
      this.router.navigate(['/blog']);
    })   
  }

  private showAlert(message: string) {
    this.alertCtrl.create({ 
      header: 'You are not logged in',     
      message: "Sorry, you need to login to access the " + message + " functionality",
      buttons: ['Okay']
    }).then(alertEl => alertEl.present());
  }

  addLike(blogId: string) {
        let firstStory;
        let videoLinks = [];
        if(!this.isLoggedin)
        {
          this.showAlert('Like');
          return;
        }

        return this.featuredService.getBlog(blogId).pipe(
          take(1),      
          switchMap(blogRes => {
            const newLikes = ++blogRes.blogLikes;        
            
            const newBlog = new Blog(
              blogRes.id,
              blogRes.blogTitle,
              blogRes.blogDetails,
              blogRes.blogImage,
              blogRes.blogFirstName,
              blogRes.blogLastName,
              blogRes.blogDate,
              newLikes,
              blogRes.blogComments,
              blogRes.blogNumberOfComments,
              blogRes.blogLikers,
              blogRes.youtubeLinkString
            );

            if(newBlog.youtubeLinkString) {
              const firstYoutube = newBlog.youtubeLinkString.split(',');

              firstYoutube.forEach(v => {
                let newV = this.updateVideoUrl(v);
                
                videoLinks.push(newV);
              
              });
              
              newBlog.youtubeLinkString = videoLinks;
            }

            this.theBlog = newBlog;

            return this.featuredService.updateBlogLike(
              blogRes.id,          
              newLikes.toString()          
            );       
          })

        ).subscribe(() => {
          this.likedBefore = true;
          this.blog = this.theBlog;          
        });
          
  }

  addReply(blogId: string) {
    
      if(!this.isLoggedin)
      {
        this.showAlert('Reply');
        return;
      }
      this.isReplying = !this.isReplying; 
    
  }

  onClickComments() {
    this.showComments = !this.showComments;
  }

  ionViewWillLeave() {
    if (this.blogSub || this.authSub) {
      this.blogSub.unsubscribe();
      this.likeSub.unsubscribe();
      this.statusSub.unsubscribe();
      this.authSub.unsubscribe();
    }
  }
  
  ngOnDestroy() {
    if (this.blogSub || this.authSub) {
      this.blogSub.unsubscribe();      
    }
    if (this.statusSub) {     
      this.statusSub.unsubscribe();      
    }
    if (this.likeSub) {      
      this.likeSub.unsubscribe();
    }
    if (this.authSub) {      
      this.authSub.unsubscribe();
    }
  }
}
