import { Component, OnInit, Input } from '@angular/core';
import { Questions, Blogcomments } from 'src/app/blog/blog.model';

@Component({
  selector: 'app-replies-item',
  templateUrl: './replies-item.component.html',
  styleUrls: ['./replies-item.component.scss'],
})
export class RepliesItemComponent implements OnInit {
  @Input() question: Questions;

  constructor() { }

  ngOnInit() {}

}
