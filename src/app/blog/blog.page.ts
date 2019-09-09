import { Component, OnInit, OnDestroy } from '@angular/core';
import { FeaturedService } from 'src/app/featured.service';
import { Blog, Blogcomments } from './blog.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.page.html',
  styleUrls: ['./blog.page.scss'],
})
export class BlogPage implements OnInit, OnDestroy {
  loadedBlogs: Blog[];
  private blogsSub: Subscription;
  constructor(private featuredService: FeaturedService) { }

  ngOnInit() {
    this.blogsSub = this.featuredService.blogs.subscribe(blogs => {
      this.loadedBlogs = blogs;
    });
  }

  onEdit(blogId, slidingId) {

  }

  ngOnDestroy() {
    if (this.blogsSub) {
      this.blogsSub.unsubscribe();
    }
  }
}
