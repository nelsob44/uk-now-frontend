import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators  } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FeaturedService } from 'src/app/featured.service';
import { AlertController, ActionSheetController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { QuizQuestion } from 'src/app/about/about.model';
import { take, switchMap } from 'rxjs/operators';

function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = window.atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for(let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for(let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}

@Component({
  selector: 'app-edit-quiz',
  templateUrl: './edit-quiz.page.html',
  styleUrls: ['./edit-quiz.page.scss'],
})
export class EditQuizPage implements OnInit, OnDestroy {
  form: FormGroup;
  private authSub: Subscription;
  private statusSub: Subscription;
  private quizSub: Subscription;
  isLoading = false;
  isAdmin = false;

  constructor(private featuredService: FeaturedService,
  private alertCtrl: AlertController,
  private route: ActivatedRoute,
  private actionSheetCtrl: ActionSheetController,
  private authService: AuthService,
  private router: Router) { }

  ngOnInit() {
    return this.authSub = this.authService.userAuthenticated.subscribe(isAuth => {
      if(isAuth) {
        this.form = new FormGroup({
          subject: new FormControl(null, {
            updateOn: 'blur',
            validators: []
          }),
          theImage: new FormControl(null, {
            updateOn: 'blur',
            validators: []
          }),         
          questionDetail: new FormControl(null, {
            updateOn: 'blur',
            validators: [Validators.required, Validators.min(1)]
          }),  
          questionAnswer: new FormControl(null, {
            updateOn: 'blur',
            validators: [Validators.required, Validators.min(1)]
          })    
        });
      } else {
        this.router.navigate(['/home']);
      }
    });
  }

  ionViewWillEnter() {
    this.isLoading = true; 
    
      this.statusSub = this.authService.userStatus.subscribe(
        status => {
          
          if(status < 3)
          {          
            this.isAdmin = true;
          } else {
            this.router.navigate(['/uk-life-essential']);
          }
        });       
  
     this.isLoading = false;      
  }

  onImagePicked(imageData: string | File) {
    let imageFile;    
    if(typeof imageData === 'string') {
      try {        
        imageFile = base64toBlob(imageData.replace('data:image/png;base64,', ''), 'image/jpeg');
      } catch (error) {
        console.log(error);
        return;
      } 
    } else {
      imageFile = imageData;
    }
    
    this.form.patchValue({ theImage: imageFile });
  }

  onSubmitQuestion() {
    
    if(!this.form.value) {
      return;
    }
    if(this.form.get('theImage').value) {
      return this.quizSub = this.featuredService.uploadImage(this.form.get('theImage').value).pipe(
        take(1),
        switchMap(uploadRes => {       
            return this.featuredService.addQuiz(                 
              this.form.value.subject,            
              uploadRes.imageUrl,
              this.form.value.questionDetail,
              this.form.value.questionAnswer          
            );           
        })
      ).subscribe(() => {       
        this.form.reset();
        this.router.navigate(['/uk-life-essential/']);
      });
    } else {
      return this.quizSub = this.featuredService.addQuiz(                 
              this.form.value.subject,            
              '',
              this.form.value.questionDetail,
              this.form.value.questionAnswer          
            ).pipe(          
        take(1),
      ).subscribe(() => {       
        this.form.reset();
        this.router.navigate(['/uk-life-essential/']);
      });
    }
  }


  ngOnDestroy() {
    if (this.authSub) {
      this.quizSub.unsubscribe();
      this.authSub.unsubscribe();
      this.statusSub.unsubscribe();
    }
  }

}
