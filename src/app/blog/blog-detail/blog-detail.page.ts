import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FeaturedService } from 'src/app/featured.service';
import { Blog } from '../blog.model';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.page.html',
  styleUrls: ['./blog-detail.page.scss'],
})
export class BlogDetailPage implements OnInit, OnDestroy {
  form: FormGroup;
  blog: Blog;
  isReplying = false;
  private blogSub: Subscription;

  constructor(
    private featuredService: FeaturedService,
    private route: ActivatedRoute,
    private navCtrl: NavController
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

  addReply(blogId: string) {
    this.isReplying = !this.isReplying;
    console.log();
  }

  onCreateReply(blogId: string) {
    if(!this.form.valid) {
      return;
    }
    this.form.get('blogId').patchValue(blogId);    
    console.log(this.form.value);    
    this.isReplying = false;
    this.form.reset();
  }

  ngOnDestroy() {
    if (this.blogSub) {
      this.blogSub.unsubscribe();
    }
  }
}
