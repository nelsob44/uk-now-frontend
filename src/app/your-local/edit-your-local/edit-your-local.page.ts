import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FeaturedService } from 'src/app/featured.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap, take, map } from 'rxjs/operators';
import { Local } from '../../blog/blog.model';
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
  selector: 'app-edit-your-local',
  templateUrl: './edit-your-local.page.html',
  styleUrls: ['./edit-your-local.page.scss'],
})
export class EditYourLocalPage implements OnInit, OnDestroy {
form: FormGroup;
private localSub: Subscription;
localId: string;
local: Local;
isLoading = false;
isEditing = false;

  constructor(private featuredService: FeaturedService, 
  private route: ActivatedRoute, 
  private alertCtrl: AlertController,
  private router: Router) { }

  ngOnInit() {
        
    this.route.paramMap.subscribe(paramMap => {      
            
      if(!paramMap.has('localId')) {
        
        this.isEditing = false;
        this.form = new FormGroup({
          localName: new FormControl(null, {
            updateOn: 'blur',
            validators: [Validators.required, Validators.min(2)]
          }),
          theImage: new FormControl(null, {
            
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
        
      } else {
        this.localId = paramMap.get('localId');
        
        this.isLoading = true;
        this.isEditing = true;
        this.localSub = this.featuredService.getLocal(this.localId).subscribe(local => {
          this.local = local;
          this.form = new FormGroup({
            localName: new FormControl(this.local.localName, {
              updateOn: 'blur',
              validators: [Validators.required, Validators.min(2)]
            }),
            theImage: new FormControl(this.local.localImage, {
              
              validators: []
            }),
            localType: new FormControl(this.local.localType, {
              updateOn: 'blur',
              validators: [Validators.required, Validators.min(2)]
            }),
            localAddress: new FormControl(this.local.localAddress, {
              updateOn: 'blur',
              validators: []
            }),
            localContact: new FormControl(this.local.localContact, {
              updateOn: 'blur',
              validators: [Validators.required, Validators.min(5)]
            })      
          });
        }, error => {
          this.alertCtrl.create({
            header: 'An error occured!',
            message: 'Your Local could not be fetched. Please try later',
            buttons: [{text: 'Ok', handler: () => {
              this.router.navigate(['/your-local']);
            }}]
          }).then(alertEl => {
            alertEl.present();
          });
        })
      }
      
    });
  }

  
  ionViewWillEnter() {
    
    console.log(this.isEditing);
    
    console.log(this.localId);
  }


  onCreateLocal() {
    if(!this.form.value || !this.form.get('theImage').value) {
      return;
    }
    
    return this.localSub = this.featuredService.uploadImage(this.form.get('theImage').value).pipe(
      switchMap(uploadRes => {
        
        return this.featuredService.addLocal(
          this.isEditing ? this.local.id : null,          
          this.form.value.localName,
          this.form.value.localType,
          this.form.value.localAddress,
          uploadRes.imageUrl,
          this.form.value.localContact,          
          this.isEditing ? this.local.localRating.toString() : '0'                 
        );
      })
    ).subscribe(() => {       
      this.form.reset();
      this.router.navigate(['/your-local']);
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
    if (this.localSub) {
      this.localSub.unsubscribe();
    }
  }

}
