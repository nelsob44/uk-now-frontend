import { Component, OnInit, Input } from '@angular/core';
import { Story } from '../story.model';

@Component({
  selector: 'app-story-item',
  templateUrl: './story-item.component.html',
  styleUrls: ['./story-item.component.scss'],
})
export class StoryItemComponent implements OnInit {
  @Input() story: Story;

  constructor() { }

  ngOnInit() {}

}
