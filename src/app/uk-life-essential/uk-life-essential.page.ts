import { Component, OnInit } from '@angular/core';
import { FeaturedService } from 'src/app/featured.service';
import { Essentials } from '../about/about.model';

@Component({
  selector: 'app-uk-life-essential',
  templateUrl: './uk-life-essential.page.html',
  styleUrls: ['./uk-life-essential.page.scss'],
})
export class UkLifeEssentialPage implements OnInit {
  loadedEssentials: Essentials[];

  constructor(private featuredService: FeaturedService) { }

  ngOnInit() {
    this.loadedEssentials = this.featuredService.essentials;
  }

  onEdit(essentialId, slidingId) {

  }

}
