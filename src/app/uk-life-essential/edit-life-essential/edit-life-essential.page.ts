import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FeaturedService } from 'src/app/featured.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Essentials } from 'src/app/about/about.model';
import { AlertController } from '@ionic/angular';

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
  selector: 'app-edit-life-essential',
  templateUrl: './edit-life-essential.page.html',
  styleUrls: ['./edit-life-essential.page.scss'],
})
export class EditLifeEssentialPage implements OnInit {
form: FormGroup;
private essentialSub: Subscription;
essential: Essentials;
essentialId: string;
isLoading = false;
isEditing = false;

  constructor(private featuredService: FeaturedService, 
  private route: ActivatedRoute, 
  private alertCtrl: AlertController,
  private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if(paramMap.has('essentialId') && paramMap.get('essentialId') == '') {

        this.form = new FormGroup({     
          essentialDetails: new FormControl(null, {
            updateOn: 'blur',
            validators: [Validators.required, Validators.min(5)]
          }),
          theImage: new FormControl(null, {
            updateOn: 'blur',
            validators: []
          })
        });
      } else {
        this.essentialId = paramMap.get('essentialId');
        this.isLoading = true;
        this.isEditing = true;
        this.essentialSub = this.featuredService.getEssential(this.essentialId).subscribe(essential => {
          this.essential = essential;
          this.form = new FormGroup({     
            essentialDetails: new FormControl(this.essential.essentialsDetails, {
              updateOn: 'blur',
              validators: [Validators.required, Validators.min(5)]
            }),
            theImage: new FormControl(this.essential.essentialsImage, {
              updateOn: 'blur',
              validators: []
            })
          });
        }, error => {
          this.alertCtrl.create({
            header: 'An error occured!',
            message: 'Essentials could not be fetched. Please try later',
            buttons: [{text: 'Ok', handler: () => {
              this.router.navigate(['/uk-life-essential']);
            }}]
          }).then(alertEl => {
            alertEl.present();
          });
        })
      }
      
    });    
  }

  onCreateEssential() {
    if(!this.form.value || !this.form.get('theImage').value) {
      return;
    }
    return this.essentialSub = this.featuredService.uploadImage(this.form.get('theImage').value).pipe(
      switchMap(uploadRes => {
        return this.featuredService.addEssential(  
          this.isEditing ? this.essential.id : null,        
          this.form.value.essentialDetails,          
          uploadRes.imageUrl,
          new Date().toString()
        );
      })
    ).subscribe(() => {       
      this.form.reset();
      this.router.navigate(['/uk-life-essential']);
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
    if (this.essentialSub) {
      this.essentialSub.unsubscribe();
    }
  }
}
