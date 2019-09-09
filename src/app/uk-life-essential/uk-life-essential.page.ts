import { Component, OnInit, OnDestroy } from '@angular/core';
import { FeaturedService } from 'src/app/featured.service';
import { Essentials } from '../about/about.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-uk-life-essential',
  templateUrl: './uk-life-essential.page.html',
  styleUrls: ['./uk-life-essential.page.scss'],
})
export class UkLifeEssentialPage implements OnInit, OnDestroy {
  loadedEssentials: Essentials[];
  private essentialsSub: Subscription;

  constructor(private featuredService: FeaturedService) { }

  ngOnInit() {
    this.essentialsSub = this.featuredService.essentials.subscribe(essentials => {
      this.loadedEssentials = essentials;
    });    
  }

  onEdit(essentialId, slidingId) {

  }

  ngOnDestroy() {
    if (this.essentialsSub) {
      this.essentialsSub.unsubscribe();
    }
  }

}
