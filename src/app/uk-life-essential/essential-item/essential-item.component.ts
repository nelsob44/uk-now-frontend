import { Component, OnInit, Input } from '@angular/core';
import { Essentials } from 'src/app/about/about.model';

@Component({
  selector: 'app-essential-item',
  templateUrl: './essential-item.component.html',
  styleUrls: ['./essential-item.component.scss'],
})
export class EssentialItemComponent implements OnInit {
  @Input() essential: Essentials;

  constructor() { }

  ngOnInit() {}

}
