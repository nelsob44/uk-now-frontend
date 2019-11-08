import { Component, OnInit, OnDestroy } from '@angular/core';
import { FeaturedService } from 'src/app/featured.service';
import { Event } from '../event.model';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { take, map } from 'rxjs/operators';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.page.html',
  styleUrls: ['./event-details.page.scss'],
})
export class EventDetailsPage implements OnInit, OnDestroy {
  event: Event;
  private eventSub: Subscription;
  private statusSub: Subscription;
  isAdmin = false;
  type = 'event';

  constructor(
    private featuredService: FeaturedService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private navCtrl: NavController,
    private router: Router
    ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('eventId')) {
        this.navCtrl.navigateBack('/featured/tabs/local-events');
      }
      this.eventSub = this.featuredService.getEvent(paramMap.get('eventId')).subscribe(event => {
        this.event = event;
      });      
    });
  }

  ionViewWillEnter() {   
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('eventId')) {
        this.navCtrl.navigateBack('/featured/tabs/local-events');
      }
      
      this.eventSub = this.featuredService.fetchevent(paramMap.get('eventId')).subscribe(event => {
                
        this.event = event;
          
      });      
    });     

    this.statusSub = this.authService.userStatus.subscribe(
      status => {
        if(status < 3)
        {
          this.isAdmin = true;
        }
      });   
  }

  onDelete(eventId: string) {
       
    return this.featuredService.deleteItem(
      eventId,
      this.type
    ).pipe(
      take(1),
      map(dataRes => {        
        console.log(dataRes);        
      })
    ).subscribe(() => {      
      this.router.navigate(['/featured/tabs/local-events']);
    })   
  }


  ngOnDestroy() {
    if (this.eventSub) {
      this.eventSub.unsubscribe();
      this.statusSub.unsubscribe();
    }
  }

}
