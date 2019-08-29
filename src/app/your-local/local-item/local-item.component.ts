import { Component, OnInit, Input } from '@angular/core';
import { Local } from 'src/app/blog/blog.model';

@Component({
  selector: 'app-local-item',
  templateUrl: './local-item.component.html',
  styleUrls: ['./local-item.component.scss'],
})
export class LocalItemComponent implements OnInit {
  @Input() local:Local;

  constructor() { }

  ngOnInit() {}

}
