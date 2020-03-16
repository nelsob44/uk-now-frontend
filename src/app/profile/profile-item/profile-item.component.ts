import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/auth/user.model';

@Component({
  selector: 'app-profile-item',
  templateUrl: './profile-item.component.html',
  styleUrls: ['./profile-item.component.scss'],
})
export class ProfileItemComponent implements OnInit {
  @Input() profile: User;
  @Input() isAdmin: boolean;
  @Input() isRightUser: boolean;
  constructor() { }

  ngOnInit() {
    console.log(this.profile);
  }

}
