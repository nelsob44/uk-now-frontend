import { Component, OnInit, OnDestroy } from '@angular/core';
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
  selector: 'app-edit-local-event',
  templateUrl: './edit-local-event.page.html',
  styleUrls: ['./edit-local-event.page.scss'],
})
export class EditLocalEventPage implements OnInit, OnDestroy  {
  form: FormGroup;
  private eventSub: Subscription;

  constructor(private featuredService: FeaturedService, private router: Router) { }

  ngOnInit() {
    this.form = new FormGroup({
      eventTitle: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(2)]
      }),
      eventDetails: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(5)]
      }),
      theImage: new FormControl(null, {
        updateOn: 'blur',
        validators: []
      }),
      eventDate: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      eventLocation: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(2)]
      })
    });
  }

  onCreateEvent() {
    if(!this.form.value || !this.form.get('theImage').value) {
      return;
    }
    return this.eventSub = this.featuredService.uploadImage(this.form.get('theImage').value).pipe(
      switchMap(uploadRes => {
        return this.featuredService.addEvent(          
          this.form.value.eventTitle,
          this.form.value.eventDetails,
          this.form.value.eventLocation,
          this.form.value.eventDate,
          uploadRes.imageUrl            
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
    if (this.eventSub) {
      this.eventSub.unsubscribe();
    }
  }
}
