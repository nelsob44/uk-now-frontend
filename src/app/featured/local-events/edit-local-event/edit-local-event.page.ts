import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FeaturedService } from 'src/app/featured.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';
import { Event } from '../event.model';

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
  eventId: string;
  event: Event;
  isLoading = false;
  isEditing = false;

  constructor(private featuredService: FeaturedService, 
  private route: ActivatedRoute,
  private alertCtrl: AlertController,
  private router: Router) { }

  ngOnInit() {

    this.route.paramMap.subscribe(paramMap => {
      if(paramMap.has('eventId') && paramMap.get('eventId') == '') {
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
      } else {
        this.eventId = paramMap.get('eventId');
        this.isLoading = true;
        this.isEditing = true;
        this.eventSub = this.featuredService.getEvent(this.eventId).subscribe(event => {
          this.event = event;
          this.form = new FormGroup({
            eventTitle: new FormControl(this.event.eventName, {
              updateOn: 'blur',
              validators: [Validators.required, Validators.min(2)]
            }),
            eventDetails: new FormControl(this.event.eventDetails, {
              updateOn: 'blur',
              validators: [Validators.required, Validators.min(5)]
            }),
            theImage: new FormControl(this.event.eventImage, {
              updateOn: 'blur',
              validators: []
            }),
            eventDate: new FormControl(this.event.eventDate.toISOString(), {
              updateOn: 'blur',
              validators: [Validators.required]
            }),
            eventLocation: new FormControl(this.event.eventLocation, {
              updateOn: 'blur',
              validators: [Validators.required, Validators.min(2)]
            })
          });
        }, error => {
          this.alertCtrl.create({
            header: 'An error occured!',
            message: 'Blog could not be fetched. Please try later',
            buttons: [{text: 'Ok', handler: () => {
              this.router.navigate(['/featured/tabs/local-events']);
            }}]
          }).then(alertEl => {
            alertEl.present();
          });
        })
      }
    });
    
  }

  onCreateEvent() {
    if(!this.form.value || !this.form.get('theImage').value) {
      return;
    }
    return this.eventSub = this.featuredService.uploadImage(this.form.get('theImage').value).pipe(
      switchMap(uploadRes => {
        return this.featuredService.addEvent( 
          this.isEditing ? this.event.id : null,         
          this.form.value.eventTitle,
          this.form.value.eventDetails,
          this.form.value.eventLocation,
          this.form.value.eventDate,
          uploadRes.imageUrl            
        );
      })
    ).subscribe(() => {       
      this.form.reset();
      this.router.navigate(['/featured/tabs/local-events']);
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
    if (this.eventSub) {
      this.eventSub.unsubscribe();
    }
  }
}
