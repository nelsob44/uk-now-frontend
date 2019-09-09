import { Component, OnInit, OnDestroy } from '@angular/core';
import { FeaturedService } from 'src/app/featured.service';
import { Local } from '../blog/blog.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-your-local',
  templateUrl: './your-local.page.html',
  styleUrls: ['./your-local.page.scss'],
})
export class YourLocalPage implements OnInit, OnDestroy {
  loadedLocals: Local[];
  private localsSub: Subscription;

  constructor(private featuredService: FeaturedService) { }

  ngOnInit() {
    this.localsSub = this.featuredService.locals.subscribe(locals => {
      this.loadedLocals = locals;
    });    
  }

  onEdit(localId, slidingId) {

  }

  ngOnDestroy() {
    if (this.localsSub) {
      this.localsSub.unsubscribe();
    }
  }
}
