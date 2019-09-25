import { Component, OnInit } from '@angular/core';
import { FeaturedService } from 'src/app/featured.service';
import { About } from './about.model';
import { Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, tap, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  private aboutDataSub: Subscription; 
  private statusSub: Subscription; 
  aboutData: About;
  isLoading = false;
  isAdmin = false;  

  constructor(private http: HttpClient, 
  private featuredService: FeaturedService,
  private authService: AuthService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.aboutDataSub = this.featuredService.fetchabout().subscribe(resData => {
      this.aboutData = resData[1];       
        
      this.isLoading = false;      
    });    
  }

  ionViewWillEnter() {
    this.statusSub = this.authService.userStatus.subscribe(
      status => {
        if(status < 3)
        {
          this.isAdmin = true;
        }
      });       
  }

  ngOnDestroy() {
    if (this.aboutDataSub || this.statusSub) {
      this.aboutDataSub.unsubscribe();
      this.statusSub.unsubscribe();
    }
  }

}
