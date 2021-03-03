import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FeaturedService } from 'src/app/featured.service';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Story } from '../story.model';
import { AlertController } from '@ionic/angular';


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
  public Editor = ClassicEditor;
  public onReady( editor ) {
      editor.ui.getEditableElement().parentElement.insertBefore(
          editor.ui.view.toolbar.element,
          editor.ui.getEditableElement()
      );
  }

  form: FormGroup;
  private storySub: Subscription;
  storyId: string;
  story: Story;
  isLoading = false;
  isEditing = false;

  constructor(private featuredService: FeaturedService, 
  private route: ActivatedRoute,
  private alertCtrl: AlertController, 
  private router: Router) { }

  ngOnInit() {

    this.route.paramMap.subscribe(paramMap => {
      if(paramMap.has('storyId') && paramMap.get('storyId') == '') {
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
      
      } else {
        this.storyId = paramMap.get('storyId');
        this.isLoading = true;
        this.isEditing = true;
        this.storySub = this.featuredService.getStory(this.storyId).subscribe(story => {
          this.story = story;
          this.form = new FormGroup({
            storyTitle: new FormControl(this.story.storyTitle, {
              updateOn: 'blur',
              validators: [Validators.required, Validators.min(2)]
            }),
            storyDetails: new FormControl(this.story.storyDetail, {
              updateOn: 'blur',
              validators: [Validators.required, Validators.min(5)]
            }),
            theImage: new FormControl(this.story.storyImage, {
              updateOn: 'blur',
              validators: []
            })    
          });
        }, error => {
          this.alertCtrl.create({
            header: 'An error occured!',
            message: 'Story could not be fetched. Please try later',
            buttons: [{text: 'Ok', handler: () => {
              this.router.navigate(['/featured/tabs/stories']);
            }}]
          }).then(alertEl => {
            alertEl.present();
          });
        })
      }
    });
  }

  onCreateStory() {
    if(!this.form.value || !this.form.get('theImage').value) {
      return;
    }
    
    const body = this.form.value.storyDetails;
    const splitBody = body.split(' ');
    let bodyContainer = [];
    let youtubeLinks = [];

    splitBody.forEach(b => {
      if(b.indexOf('url="https://www.youtube.com/watch') !== -1) {
        bodyContainer.push(b);
      }
    });

    bodyContainer.forEach(bc => {
      let newBc = bc.split('v=');
      let newBcN = newBc[1].split('">');
     
      let newLink = 'https://www.youtube.com/embed/' + newBcN[0];
      youtubeLinks.push(newLink);
    });

    const youtubeLinkString = youtubeLinks.join();

    
    return this.storySub = this.featuredService.uploadImage(this.form.get('theImage').value).pipe(
      switchMap(uploadRes => {
        return this.featuredService.addStory(  
          this.isEditing ? this.story.id : null,        
          this.form.value.storyTitle,
          this.form.value.storyDetails,
          uploadRes.imageUrl,
          this.isEditing ? this.story.userName : null,
          this.isEditing ? this.story.postedOn.toString() : new Date().toString(),
          this.isEditing ? this.story.storyLikes.toString() : '0',   
          youtubeLinkString
        );
      })
    ).subscribe(() => {       
      this.form.reset();
      this.router.navigate(['/featured/tabs/stories']);
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
    if (this.storySub) {
      this.storySub.unsubscribe();
    }
  }

}
