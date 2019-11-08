import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Local } from '../../blog/blog.model';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { FeaturedService } from 'src/app/featured.service';
import { take, map, reduce } from 'rxjs/operators';
import { ifError } from 'assert';

@Component({
  selector: 'app-local-item',
  templateUrl: './local-item.component.html',
  styleUrls: ['./local-item.component.scss'],
})
export class LocalItemComponent implements OnInit {
  @Input() local:Local;
  checkLocal: Local;
  isAdmin = false;
  isHover = false;
  private statusSub: Subscription;
  private rateSub: Subscription;
  ratedBefore = false;
  type = 'local';
  @Output() localId = new EventEmitter<Local>();
  localsRate: Local;

  constructor(private authService: AuthService, private featuredService: FeaturedService) { }

  ngOnInit() {
    
    this.statusSub = this.authService.userStatus.subscribe(
      status => {
        
        if(status < 3)
        {          
          this.isAdmin = true;
        }
      }); 

      this.rateSub = this.authService.userId.subscribe(userId => {
      this.local.ratings.forEach(r => {
        if(r.creator === userId) {
          this.ratedBefore = true; 
        }
      });      
    });  
  }

  ionViewWillEnter() {
    
    this.rateSub = this.authService.userId.subscribe(userId => {
      this.local.ratings.forEach(r => {
        if(r.creator === userId) {
          this.ratedBefore = true; 
        }
      });      
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

  classEnter(id: number) {
    this.isHover = true;
  }

  classLeave(id: number) {
    this.isHover = false;
  }

  addRating(localId: string, rating: number) {
    if(this.ratedBefore) {
      return;
    }
    
    return this.featuredService.updateRating(
      localId,
      rating.toString()
    ).pipe(
      take(1),
      map(dataRes => {

        const localsRate = [];
          for (const key in dataRes) {
            if(dataRes.hasOwnProperty(key)) {
              localsRate.push(
                new Local(
                  dataRes[key]._id,
                  dataRes[key].localName,
                  dataRes[key].localType,
                  dataRes[key].localAddress,
                  dataRes[key].localImage,
                  dataRes[key].localContact, 
                  dataRes[key].localRating,
                  dataRes[key].ratings                            
                )
              );
            }
          }
        
        this.checkLocal = localsRate[0];        
      })
    ).subscribe(() => {
      this.local = this.checkLocal;
      this.ratedBefore = true;
      console.log('rated');
    })   
  }

  ngOnDestroy() {
    if (this.statusSub) {      
      this.statusSub.unsubscribe();
      this.rateSub.unsubscribe();
    }
  }

}
