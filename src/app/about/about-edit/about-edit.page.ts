import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
  selector: 'app-about-edit',
  templateUrl: './about-edit.page.html',
  styleUrls: ['./about-edit.page.scss'],
})
export class AboutEditPage implements OnInit {
  form: FormGroup;
  constructor() { }

  ngOnInit() {
    this.form = new FormGroup({
      aboutDetails: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(2)]
      }),
      theImage: new FormControl(null, {
        updateOn: 'blur',
        validators: []
      })          
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

  onCreateAbout() {
    if(!this.form.value || !this.form.get('theImage').value) {
      return;
    }
    console.log(this.form.value);
  }
}
