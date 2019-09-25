import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FeaturedService } from 'src/app/featured.service';
import { Blog, Blogcomments } from '../blog.model';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription, pipe } from 'rxjs';
import { switchMap, take, map, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';

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
  private blogSub: Subscription;
  private statusSub: Subscription; 
  private commSub: Subscription;
  private likeSub: Subscription;
  isAdmin = false;
  theBlog: Blog;
  theBlogTwo: Blog;
  likedBefore = false;
  type = 'blog';

  constructor(
    private featuredService: FeaturedService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private navCtrl: NavController,
    private router: Router
    ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('blogId')) {
        this.navCtrl.navigateBack('/blog');
      }
      this.blogSub = this.featuredService.getBlog(paramMap.get('blogId')).subscribe(blog => {
        
        this.blog = blog;
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
    
  }

  ionViewWillEnter() {
    
    this.likeSub = this.authService.userId.subscribe(userId => {
      let check = this.blog.blogLikers.indexOf(userId);
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
        console.log(dataRes);

        const newBlogs = [];
        
          for (const key in dataRes) {
            if(dataRes.hasOwnProperty(key)) {
              newBlogs.push(
                new Blog(
                  dataRes[key]._id,
                  dataRes[key].blogTitle,
                  dataRes[key].blogDetails,
                  environment.baseUrl + '/' + dataRes[key].blogImage,
                  dataRes[key].blogFirstName,
                  dataRes[key].blogLastName,
                  dataRes[key].blogDate,
                  dataRes[key].blogLikes,
                  dataRes[key].blogComments,
                  dataRes[key].blogNumberOfComments,
                  dataRes[key].blogLikers,
                )
              );
            }
          }

        this.theBlogTwo = newBlogs[0];
         
         console.log(newBlogs[0]);
      })
    ).subscribe(() => {
      this.blog = this.theBlogTwo;        
              
        this.isReplying = false;
        
        this.form.reset();
    });
  }

  onDelete(blogId: string) {
       
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

  addLike(blogId: string) {
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
           blogRes.blogLikers
         );

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
    
    this.isReplying = !this.isReplying;  
    
  }

  onClickComments() {
    this.showComments = !this.showComments;
  }

  ionViewWillLeave() {
    if (this.blogSub) {
      this.blogSub.unsubscribe();
      this.likeSub.unsubscribe();
      this.statusSub.unsubscribe();
    }
  }

  ngOnDestroy() {
    if (this.blogSub) {
      this.blogSub.unsubscribe();
      this.likeSub.unsubscribe();
      this.statusSub.unsubscribe();
    }
  }
}
