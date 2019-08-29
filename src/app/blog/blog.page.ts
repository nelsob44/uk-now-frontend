import { Component, OnInit } from '@angular/core';
import { FeaturedService } from 'src/app/featured.service';
import { Blog, Blogcomments } from './blog.model';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.page.html',
  styleUrls: ['./blog.page.scss'],
})
export class BlogPage implements OnInit {
  loadedBlogs: Blog[];
  constructor(private featuredService: FeaturedService) { }

  ngOnInit() {
    this.loadedBlogs = this.featuredService.blogs;
  }

  onEdit(blogId, slidingId) {

  }

}
