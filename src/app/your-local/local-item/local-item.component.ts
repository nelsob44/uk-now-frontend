import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Local } from '../../blog/blog.model';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { FeaturedService } from 'src/app/featured.service';
import { take, map } from 'rxjs/operators';

@Component({
  selector: 'app-local-item',
  templateUrl: './local-item.component.html',
  styleUrls: ['./local-item.component.scss'],
})
export class LocalItemComponent implements OnInit {
  @Input() local:Local;
  isAdmin = true;
  private statusSub: Subscription;
  type = 'local';
  @Output() localId = new EventEmitter<Local>();

  constructor(private authService: AuthService, private featuredService: FeaturedService) { }

  ngOnInit() {
    
    this.statusSub = this.authService.userStatus.subscribe(
      status => {
        
        if(+status < 3)
        {          
          this.isAdmin = true;
        }
      }); 
  }

  onDelete(localId: string) {
    
    return this.featuredService.deleteItem(
      localId,
      this.type
    ).pipe(
      take(1),
      map(dataRes => {
        
        console.log(dataRes);
        
      })
    ).subscribe(() => {
      
      console.log('Deleted');
    })   

  }

  ngOnDestroy() {
    if (this.statusSub) {      
      this.statusSub.unsubscribe();
    }
  }

}
