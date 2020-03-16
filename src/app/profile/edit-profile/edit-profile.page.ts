import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { take, switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { FeaturedService } from 'src/app/featured.service';
import { Subscription } from 'rxjs';

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
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  form: FormGroup;
  userId: string;
  private profileSub: Subscription;

  constructor(private featuredService: FeaturedService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      console.log(paramMap.get('userId'));
      if(paramMap.has('userId') && paramMap.get('userId') != '') {
        this.userId = paramMap.get('userId');
        this.form = new FormGroup({
          newPassword: new FormControl(null, {
            updateOn: 'blur',
            validators: []
          }),
          details: new FormControl(null, {
            updateOn: 'blur',
            validators: []
          }),
          theImage: new FormControl(null, {
            updateOn: 'blur',
            validators: []
          })    
        });        
      } else {
        this.router.navigate(['/home']);
      }
    });
  }

  onCancelEditing() {
    this.router.navigate(['/profile']);
  }

  onUpdate() {  
    if(!this.form.value.newPassword && 
    !this.form.get('theImage').value &&
    !this.form.value.details) {
      console.log(this.form.value);
      return;
    }  
    console.log(this.form.value);
    if(this.form.get('theImage').value) {
      return this.profileSub = this.featuredService.uploadImage(this.form.get('theImage').value).pipe(
        take(1),
        switchMap(uploadRes => {
          return this.authService.updateProfile(
            this.userId,
            this.form.value.newPassword,
            this.form.value.details,
            uploadRes.imageUrl
            );
        })
      ).subscribe(() => {
        console.log('updated with image');
        this.router.navigate(['/profile']);
      });

    } else {
      return this.profileSub = this.authService.updateProfile(
        this.userId,
        this.form.value.newPassword,
        this.form.value.details,
        this.form.value.theImage
        ).subscribe(() => {
          console.log('updated without image');
          this.router.navigate(['/profile']);
      });
    }
      
  }

  onImagePicked(imageData: string | File) {
    
    let imageFile;
    if(typeof imageData === 'string') {
      try {
        imageFile = base64toBlob(imageData.replace('data:image/png;base64,', ''), 'image/jpeg');
      } catch (error) {
        
        return;
      } 
    } else {
      imageFile = imageData;
    }
    this.form.patchValue({ theImage: imageFile });
  }

  ngOnDestroy() {
    if (this.profileSub) {
      this.profileSub.unsubscribe();
    }
  }

}
