import { Component, OnInit, OnDestroy } from '@angular/core';
import { Event } from './event.model';
import { FeaturedService } from 'src/app/featured.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-local-events',
  templateUrl: './local-events.page.html',
  styleUrls: ['./local-events.page.scss'],
})
export class LocalEventsPage implements OnInit, OnDestroy {
  private eventsSub: Subscription;
  loadedEvents: Event[];

  constructor(private featuredService: FeaturedService) { }

  ngOnInit() {
    this.eventsSub = this.featuredService.events.subscribe(events => {
      this.loadedEvents = events;
    });    
  }

  ionViewWillEnter() {
    // this.loadedEvents = this.featuredService.events;
  }

  onEdit(eventId, slidingItem) {
    console.log(eventId);
    console.log(slidingItem);
  }

  ngOnDestroy() {
    if (this.eventsSub) {
      this.eventsSub.unsubscribe();
    }
  }

}
