import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { take, switchMap, map } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../auth/user.model';
import { NavController, IonContent } from '@ionic/angular';
import { FeaturedService } from '../featured.service';
import { Message } from './message.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})

export class ProfilePage implements OnInit, OnDestroy {
  @ViewChild('ionContent', {static: false}) ionContentRef: IonContent;
  form: FormGroup;
  isLoading = false;
  isRightUser = true;
  private userId: string;
  isAdmin = false;
  private emailSub: Subscription;
  private userSub: Subscription;
  private messageSub: Subscription;
  profile: User;
  idprofile: User;
  isMessaging = false;
  private loggedInUserEmail: string;
  private profileUserEmail: string;
  private loadedMessages: Message[] = [];
  private pageSub: Subscription;  
  
  pageNumber: number;
  numberOfPages: number;
  nextPage: number;
  currentPage: number = 1;
  firstPage: number = 1;
  lastPage = false;
  previousPage: number;
  totalMessages: number;

  

  constructor(private featuredService: FeaturedService,
    private router: Router, 
    private authService: AuthService,
    private route: ActivatedRoute,
    private navCtrl: NavController) { }

  ngOnInit() {
    this.isLoading = true;
    this.userSub = this.authService.user.subscribe(user => {
      this.loggedInUserEmail = user.email;
      this.profile = user;
      
      if(this.profile.status != null && (this.profile.status < 3)) {
        this.isAdmin = true;
      }
      this.isLoading = false; 
    }); 
    this.scrollContent();
    this.form = new FormGroup({
      messageDetails: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      }),
      theImage: new FormControl(null, {
        updateOn: 'blur',
        validators: []
      })  
    }); 
    
  }

  ionViewWillEnter() {   
    this.route.paramMap.subscribe(paramMap => {
      if(paramMap.has('userId') && (paramMap.get('userId') != '')) {
          
          this.userId = paramMap.get('userId');
          this.emailSub = this.featuredService.fetchuser(paramMap.get('userId')).subscribe(user => {
          
          if(user.email !== this.profile.email) {
            this.isRightUser = false;
            this.profileUserEmail = user.email;
            this.messageSub = this.featuredService.getMessages(
              this.currentPage,
              this.profileUserEmail,
              this.loggedInUserEmail
              ).subscribe(messages => {
              this.loadedMessages = messages;
              this.totalMessages = this.loadedMessages.length;  
                     
              this.firstPage = 1;
              this.nextPage = this.firstPage + 1;
              if(this.totalMessages < 10) {
                this.lastPage = true;
              }
              this.previousPage = this.nextPage - 1;                         
            });
                        
          }                
          this.profileUserEmail = user.email;
          this.profile = user;  
          this.scrollContent();                     
        });
      }            
    });     
  }

  onEditProfile(profileId: string) {
    this.router.navigate(['/', 'edit-profile', profileId]);
  }

  toggleMessage(profileId: string) {
    this.isMessaging = !this.isMessaging;
  }

  onSendMessage() {
    if(!this.form.value.messageDetails) {
      return;
    }
    if(this.form.get('theImage').value) {
      return this.messageSub = this.featuredService.uploadImage(this.form.get('theImage').value).pipe(
        take(1),
        switchMap(uploadRes => {
          return this.featuredService.addMessage(
            this.loggedInUserEmail,
            this.profileUserEmail,
            this.form.value.messageDetails,        
            uploadRes.imageUrl
            );
        })
      ).subscribe(messages => {
        if(this.currentPage > 1) {          
          this.messageSub = this.featuredService.getMessages(
            1,
            this.profileUserEmail,
            this.loggedInUserEmail
            ).subscribe(messages => {
            this.loadedMessages = messages;
            if(this.loadedMessages.length >9) {
              this.lastPage = false;
            }                
            this.isLoading = false;       
          });
          this.currentPage = 1;
          this.nextPage = 2;
          
          this.loadedMessages.push(messages);
          this.scrollContent();
          this.form.reset();
        } else {         
          this.loadedMessages.push(messages);
          this.scrollContent();
          this.form.reset();
        }        
      });
    } else {
      return this.messageSub = this.featuredService.addMessage(
        this.loggedInUserEmail,
        this.profileUserEmail,
        this.form.value.messageDetails,
        this.form.value.theImage
      ).subscribe(messages => {        
        if(this.currentPage > 1) {          
          this.messageSub = this.featuredService.getMessages(
            1,
            this.profileUserEmail,
            this.loggedInUserEmail
            ).subscribe(messages => {
            this.loadedMessages = messages;
            if(this.loadedMessages.length >9) {
              this.lastPage = false;
            }                
            this.isLoading = false;       
          });
          this.currentPage = 1;
          this.nextPage = 2;
          
          this.loadedMessages.push(messages);
          this.scrollContent();
          this.form.reset();
        } else {         
          this.loadedMessages.push(messages);
          this.scrollContent();
          this.form.reset();
        }
      });
    
    }
  }

  scrollContent(): void {
    setTimeout(() => {
      this.ionContentRef.scrollToBottom(1000);
    }, 1000);
  }

  onScrollNext(page: number) {
    
    this.isLoading = true;
    this.ionContentRef.scrollToBottom(1000);
    this.messageSub = this.featuredService.getMessages(
      page,
      this.profileUserEmail,
      this.loggedInUserEmail
      ).subscribe(messages => {
      this.loadedMessages = messages;
      this.totalMessages = this.loadedMessages.length;  
      
      if(this.totalMessages < 10) {
        this.lastPage = true;
      }
      
      this.nextPage = page + 1;
      this.previousPage = this.nextPage - 1;
      this.currentPage++;
     
      this.nextPage = page + 1;
      this.previousPage = page;
      if(this.previousPage == 0) {
        this.previousPage = 1;
      }      
      this.isLoading = false; 
      this.scrollContent();
    });
  }

  onScrollPrev(page: number) {
    
    this.isLoading = true;
    this.currentPage--;
    this.messageSub = this.featuredService.getMessages(
      page - 1,
      this.profileUserEmail,
      this.loggedInUserEmail
      ).subscribe(messages => {
      this.loadedMessages = messages;
      this.totalMessages = this.loadedMessages.length;
      if(this.totalMessages < 10) {
        this.lastPage = true;
      } else {
        this.lastPage = false;
      }
      this.nextPage = page;
      
      this.previousPage = page - 1;
      if(this.previousPage == 0) {
        this.previousPage = 1;
      }
      this.scrollContent();
      this.isLoading = false;       
    });    
  }

  onScrollLast(page: number) {
    
    this.isLoading = true;
    
    this.messageSub = this.featuredService.getMessages(
      page,
      this.profileUserEmail,
      this.loggedInUserEmail
      ).subscribe(mentors => {
      this.loadedMessages = mentors;
      this.nextPage = page;
      this.previousPage = page - 1;
      if(this.previousPage == 0) {
        this.previousPage = 1;
      }
           
      this.isLoading = false;       
    });    
    
  }

  onScrollFirst(page: number) {
    
    this.isLoading = true;
    
    this.messageSub = this.featuredService.getMessages(
      page,
      this.profileUserEmail,
      this.loggedInUserEmail
      ).subscribe(messages => {
      this.loadedMessages = messages;
      this.nextPage = page + 1;
      this.previousPage = page;
      if(this.previousPage == 0) {
        this.previousPage = 1;
      }
           console.log(this.loadedMessages);
      this.isLoading = false;       
    });
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
      
    }
    if (this.emailSub) {      
      this.emailSub.unsubscribe();
      
    }
    if (this.messageSub) {      
      this.messageSub.unsubscribe();
    }
  }

}
