import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FeaturedService } from 'src/app/featured.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

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
  selector: 'app-edit-your-local',
  templateUrl: './edit-your-local.page.html',
  styleUrls: ['./edit-your-local.page.scss'],
})
export class EditYourLocalPage implements OnInit {
form: FormGroup;
private localSub: Subscription;

  constructor(private featuredService: FeaturedService, private router: Router) { }

  ngOnInit() {
    this.form = new FormGroup({
      localName: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(2)]
      }),
      theImage: new FormControl(null, {
        updateOn: 'blur',
        validators: []
      }),
      localType: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(2)]
      }),
      localAddress: new FormControl(null, {
        updateOn: 'blur',
        validators: []
      }),
      localContact: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(5)]
      })      
    });
  }

  onCreateLocal() {
    if(!this.form.value || !this.form.get('theImage').value) {
      return;
    }
    return this.localSub = this.featuredService.uploadImage(this.form.get('theImage').value).pipe(
      switchMap(uploadRes => {
        return this.featuredService.addLocal(          
          this.form.value.localName,
          this.form.value.localType,
          this.form.value.localAddress,
          uploadRes.imageUrl,
          this.form.value.localContact,          
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
    if (this.localSub) {
      this.localSub.unsubscribe();
    }
  }

}
