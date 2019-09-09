import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { FeaturedService } from 'src/app/featured.service';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

function base64toBlob(dataUrl, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = window.atob(dataUrl);
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
  selector: 'app-edit-story',
  templateUrl: './edit-story.page.html',
  styleUrls: ['./edit-story.page.scss'],
})
export class EditStoryPage implements OnInit {
  form: FormGroup;
  private storySub: Subscription;

  constructor(private featuredService: FeaturedService, private router: Router) { }

  ngOnInit() {
    this.form = new FormGroup({
      storyTitle: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(2)]
      }),
      storyDetails: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(5)]
      }),
      theImage: new FormControl(null, {
        updateOn: 'blur',
        validators: []
      })    
    });
  }

  onCreateStory() {
    if(!this.form.value || !this.form.get('theImage').value) {
      return;
    }
    return this.storySub = this.featuredService.uploadImage(this.form.get('theImage').value).pipe(
      switchMap(uploadRes => {
        return this.featuredService.addStory(          
          this.form.value.storyTitle,
          this.form.value.storyDetails,
          uploadRes.imageUrl,
          'Mandy',
          new Date(),
          0         
        );
      })
    ).subscribe(() => {       
      this.form.reset();
      this.router.navigate(['/about']);
    });
  }

  onImagePicked(imageData: string | File) {
    let imageFile;
    if(typeof imageData === 'string') {
      try {
        imageFile = base64toBlob(imageData.replace('data:image/jpeg;base64,', ''), 'image/jpeg');
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
    if (this.storySub) {
      this.storySub.unsubscribe();
    }
  }

}
