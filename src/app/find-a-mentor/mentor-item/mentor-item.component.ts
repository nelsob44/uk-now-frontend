import { Component, OnInit, Input } from '@angular/core';
import { Mentor } from 'src/app/blog/blog.model';

@Component({
  selector: 'app-mentor-item',
  templateUrl: './mentor-item.component.html',
  styleUrls: ['./mentor-item.component.scss'],
})
export class MentorItemComponent implements OnInit {
  @Input() mentor: Mentor;

  constructor() { }

  ngOnInit() {}

}
