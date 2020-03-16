import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { FeaturedService } from 'src/app/featured.service';
import { Local } from 'src/app/blog/blog.model';

@Component({
  selector: 'app-your-local-details',
  templateUrl: './your-local-details.page.html',
  styleUrls: ['./your-local-details.page.scss'],
})
export class YourLocalDetailsPage implements OnInit, OnDestroy {
  local: Local;
  private localSub: Subscription;
  private statusSub: Subscription;
  isAdmin = false;
  
  constructor(
    private featuredService: FeaturedService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('localId')) {
        this.navCtrl.navigateBack('/your-local');
      }
      this.localSub = this.featuredService.getLocal(paramMap.get('localId')).subscribe(local => {
        this.local = local;
      });      
    });
  }

  ionViewWillEnter() {    

    this.statusSub = this.authService.userStatus.subscribe(
      status => {
        if(status != null && (status < 3))
        {
          this.isAdmin = true;
        }
      });   
  }


  ngOnDestroy() {
    if (this.localSub) {
      this.localSub.unsubscribe();
      this.statusSub.unsubscribe();
    }
  }


}
