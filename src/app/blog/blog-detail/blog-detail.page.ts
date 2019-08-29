import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FeaturedService } from 'src/app/featured.service';
import { Blog } from '../blog.model';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.page.html',
  styleUrls: ['./blog-detail.page.scss'],
})
export class BlogDetailPage implements OnInit {
  form: FormGroup;
  blog: Blog;
  isReplying = false;

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
      this.blog = this.featuredService.getBlog(paramMap.get('blogId'));
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


}
