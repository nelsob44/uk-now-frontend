import { Component, OnInit } from '@angular/core';
import { Event } from './event.model';
import { FeaturedService } from 'src/app/featured.service';

@Component({
  selector: 'app-local-events',
  templateUrl: './local-events.page.html',
  styleUrls: ['./local-events.page.scss'],
})
export class LocalEventsPage implements OnInit {

  loadedEvents: Event[];

  constructor(private featuredService: FeaturedService) { }

  ngOnInit() {
    this.loadedEvents = this.featuredService.events;
  }

  ionViewWillEnter() {
    this.loadedEvents = this.featuredService.events;
  }

  onEdit(eventId, slidingItem) {
    console.log(eventId);
    console.log(slidingItem);
  }

}
