import { Component, OnInit, Input } from '@angular/core';
import { Blogcomments, Blog } from '../blog.model';

@Component({
  selector: 'app-blogcomments-item',
  templateUrl: './blogcomments-item.component.html',
  styleUrls: ['./blogcomments-item.component.scss'],
})
export class BlogcommentsItemComponent implements OnInit {
  @Input() blogcomments: Blogcomments;

  constructor() { }

  ngOnInit() {}

}
