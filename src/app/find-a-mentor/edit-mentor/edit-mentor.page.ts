import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FeaturedService } from 'src/app/featured.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';
import { Mentor } from 'src/app/blog/blog.model';

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
  selector: 'app-edit-mentor',
  templateUrl: './edit-mentor.page.html',
  styleUrls: ['./edit-mentor.page.scss'],
})
export class EditMentorPage implements OnInit {
  form: FormGroup;
  private mentorSub: Subscription;
  mentor: Mentor;
  isLoading = false;
  isEditing = false;
  mentorId: string;

  constructor(private featuredService: FeaturedService,
  private route: ActivatedRoute, 
  private alertCtrl: AlertController, 
  private router: Router
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if(paramMap.has('mentorId') && paramMap.get('mentorId') == '') {

        this.form = new FormGroup({
          mentorName: new FormControl(null, {
            updateOn: 'blur',
            validators: [Validators.required, Validators.min(2)]
          }),
          mentorField: new FormControl(null, {
            updateOn: 'blur',
            validators: [Validators.required, Validators.min(2)]
          }),
          theImage: new FormControl(null, {
            updateOn: 'blur',
            validators: []
          }),
          mentorEmail: new FormControl(null, {
            updateOn: 'blur',
            validators: [Validators.required]
          }),
          mentorLinkedIn: new FormControl(null, {
            updateOn: 'blur',
            validators: []
          }),
          mentorProfile: new FormControl(null, {
            updateOn: 'blur',
            validators: [Validators.required, Validators.min(2)]
          })
        });

      } else {
        this.mentorId = paramMap.get('mentorId');
        this.isLoading = true;
        this.isEditing = true;
        this.mentorSub = this.featuredService.getMentor(this.mentorId).subscribe(mentor => {
          this.mentor = mentor;
          this.form = new FormGroup({
            mentorName: new FormControl(this.mentor.mentorUserName, {
              updateOn: 'blur',
              validators: [Validators.required, Validators.min(2)]
            }),
            mentorField: new FormControl(this.mentor.mentorField, {
              updateOn: 'blur',
              validators: [Validators.required, Validators.min(2)]
            }),
            theImage: new FormControl(this.mentor.mentorImage, {
              updateOn: 'blur',
              validators: []
            }),
            mentorEmail: new FormControl(this.mentor.mentorEmail, {
              updateOn: 'blur',
              validators: [Validators.required]
            }),
            mentorLinkedIn: new FormControl(null, {
              updateOn: 'blur',
              validators: []
            }),
            mentorProfile: new FormControl(this.mentor.mentorProfile, {
              updateOn: 'blur',
              validators: [Validators.required, Validators.min(2)]
            })
          });
        }, error => {
          this.alertCtrl.create({
            header: 'An error occured!',
            message: 'Mentor could not be fetched. Please try later',
            buttons: [{text: 'Ok', handler: () => {
              this.router.navigate(['/blog']);
            }}]
          }).then(alertEl => {
            alertEl.present();
          });
        })
      }
      
    });    
  }

  onCreateMentor() {
    if(!this.form.value || !this.form.get('theImage').value) {
      return;
    }
    return this.mentorSub = this.featuredService.uploadImage(this.form.get('theImage').value).pipe(
      switchMap(uploadRes => {
        return this.featuredService.addMentor(  
          this.isEditing ? this.mentor.id : null,        
          this.form.value.mentorName,
          this.form.value.mentorProfile,
          this.form.value.mentorField,
          uploadRes.imageUrl,
          this.form.value.mentorEmail,
          this.form.value.mentorLinkedIn
        );
      })
    ).subscribe(() => {       
      this.form.reset();
      this.router.navigate(['/find-a-mentor']);
    });
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

  ngOnDestroy() {
    if (this.mentorSub) {
      this.mentorSub.unsubscribe();
    }
  }

}
