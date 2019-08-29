import { Component, OnInit } from '@angular/core';
import { FeaturedService } from 'src/app/featured.service';
import { Event } from '../event.model';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.page.html',
  styleUrls: ['./event-details.page.scss'],
})
export class EventDetailsPage implements OnInit {
  event: Event;

  constructor(
    private featuredService: FeaturedService,
    private route: ActivatedRoute,
    private navCtrl: NavController
    ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('eventId')) {
        this.navCtrl.navigateBack('/featured/tabs/local-events');
      }
      this.event = this.featuredService.getEvent(paramMap.get('eventId'));
    });
  }

}
