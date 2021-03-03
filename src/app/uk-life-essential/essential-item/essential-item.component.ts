import { Component, OnInit, Input } from '@angular/core';
import { Essentials } from 'src/app/about/about.model';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { FeaturedService } from 'src/app/featured.service';
import { Router } from '@angular/router';
import { take, map } from 'rxjs/operators';

@Component({
  selector: 'app-essential-item',
  templateUrl: './essential-item.component.html',
  styleUrls: ['./essential-item.component.scss'],
})
export class EssentialItemComponent implements OnInit {
  @Input() essential: Essentials;
  private statusSub: Subscription;
  isAdmin = false;
  type = 'essential';

  constructor(private featuredService: FeaturedService, 
  private router: Router,
  private authService: AuthService) { }

  ngOnInit() {
    this.statusSub = this.authService.userStatus.subscribe(
      status => {
        
        if(status != null && (status < 3))
        {          
          this.isAdmin = true;
        }
      });
  }

  onDelete(essentialId: string) {
       
    return this.featuredService.deleteItem(
      essentialId,
      this.type
    ).pipe(
      take(1),
      map(dataRes => {        
        console.log(dataRes);        
      })
    ).subscribe(() => {      
      this.router.navigate(['/uk-life-essential']);
    })   
  }

  onTakeQuiz() {    
    this.router.navigate(['/', 'uk-life-essential', 'uk-quiz-details']);    
  }

  ngOnDestroy() {
    if (this.statusSub) {     
      this.statusSub.unsubscribe();
    }
  }

}
