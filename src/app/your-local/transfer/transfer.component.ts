import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Local } from 'src/app/blog/blog.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss'],
})
export class TransferComponent implements OnInit {
  @Input() transferIdLocal: Local;
  theLocal: Local;
  @Output() newLocal = new EventEmitter<Local>();

  constructor(private router: Router) { }

  ngOnInit() {
    this.theLocal = this.transferIdLocal;
    
    this.newLocal.emit(this.theLocal);
  }

}
