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
// import { SocketioService } from '../socketio.service';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})

export class ProfilePage implements OnInit, OnDestroy {
  @ViewChild('ionContent', {static: false}) ionContentRef: IonContent;
  socket;
  form: FormGroup;
  isLoading = false;
  isRightUser = true;
  private userId: string;
  isAdmin = false;
  viewUnread = false;
  private emailSub: Subscription;
  private unreadSub: Subscription;
  private userSub: Subscription;
  private messageSub: Subscription;
  profile: User;
  idprofile: User;
  isMessaging = false;
  private loggedInUserEmail: string;
  private profileUserEmail: string;
  private loadedMessages: Message[] = [];
  private pageSub: Subscription;  
  unreadMessages: number = 0;
  pageNumber: number;
  numberOfPages: number;
  nextPage: number;
  currentPage: number = 1;
  firstPage: number = 1;
  lastPage = false;
  previousPage: number;
  totalMessages: number;
  loadedUnreadUsers = [];
  loadedUnreadUsersEmail = [];
  

  constructor(private featuredService: FeaturedService,
    private router: Router, 
    private authService: AuthService,
    private route: ActivatedRoute,
    
    private navCtrl: NavController) { }

  ngOnInit() {
    this.isLoading = true;
    this.userSub = this.authService.user.subscribe(user => {
      if(user) {
        this.loggedInUserEmail = user.email;
        this.profile = user;
        if(this.profile.status != null && (this.profile.status < 3)) {
          this.isAdmin = true;
        }
      }
          
      this.unreadSub = this.featuredService.getUnreadMessages(
        this.loggedInUserEmail
        ).subscribe(data => {
          this.unreadMessages = data.messagesFrom.length;
          this.loadedUnreadUsers = data.messagesFrom;
          data.messagesFrom.forEach(msgF => {
            let email = msgF.split('/')[0];
            this.loadedUnreadUsersEmail.push(email);
          });
          
        });
      this.isLoading = false; 
    }); 
    
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

    this.socket = io(environment.baseUrl);

    this.socket.on('message', data => {
      if ((data.action === 'addMessage') && 
      (data.message.messageTo === this.loggedInUserEmail) && 
      (data.message.messageFrom === this.profileUserEmail)) {
        const newMessage = new Message (
          data.message._id,
          data.message.messageFrom,
          data.message.messageTo,
          data.message.messageDetails,
          data.message.messageImage,
          data.message.messageRead,
          new Date(data.message.messageTime).toString()
        );

        this.loadedMessages.push(newMessage);
      }
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
                               
        });
                
      }            
    });     
  }

  onEditProfile(profileId: string) {
    this.router.navigate(['/', 'edit-profile', profileId]);
  }

  toggleMessage(profileId: string) {
    this.isMessaging = !this.isMessaging;
    if(this.isMessaging) {
      return this.messageSub = this.featuredService.updateReadMessages(
        this.currentPage,
        this.loggedInUserEmail,
        this.profileUserEmail
      ).subscribe(messages => {        
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
        this.isLoading = false;       
      });      
    }
  }

  checkMessages() {
    this.viewUnread = !this.viewUnread;
  }

  onClickViewMessage(email: string) {
    for(let i = 0; i < this.loadedUnreadUsers.length; i++) {
      let userId = this.loadedUnreadUsers[i].split('/');

       if(userId[0] === email) {
        this.router.navigateByUrl('/profile/' + userId[1]);
        break;
      }
    }
    
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
          // this.scrollContent();
          this.form.reset();
        } else {         
          this.loadedMessages.push(messages);
          // this.scrollContent();
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
          
          this.form.reset();
        } else {         
          this.loadedMessages.push(messages);          
          this.form.reset();
        }
      });
    
    }
  }

  onScrollNext(page: number) {    
    this.isLoading = true;
   
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
      // this.scrollContent();
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
       
      this.isLoading = false;       
    });
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
      this.unreadSub.unsubscribe();
    }
    if (this.emailSub) {      
      this.emailSub.unsubscribe();
      
    }
    if (this.messageSub) {      
      this.messageSub.unsubscribe();
    }
  }

}
