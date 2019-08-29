import { Component, OnInit } from '@angular/core';
import { FeaturedService } from 'src/app/featured.service';
import { Local } from '../blog/blog.model';

@Component({
  selector: 'app-your-local',
  templateUrl: './your-local.page.html',
  styleUrls: ['./your-local.page.scss'],
})
export class YourLocalPage implements OnInit {
  loadedLocals: Local[];

  constructor(private featuredService: FeaturedService) { }

  ngOnInit() {
    this.loadedLocals = this.featuredService.locals;
  }

  onEdit(localId, slidingId) {

  }


}
