import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FeaturedService } from 'src/app/featured.service';
import { switchMap, map, take } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

import { Blog } from '../blog.model';
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
  selector: 'app-blog-edit',
  templateUrl: './blog-edit.page.html',
  styleUrls: ['./blog-edit.page.scss'],
})
export class BlogEditPage implements OnInit, OnDestroy {
  public Editor = DecoupledEditor;
  public onReady( editor ) {
      editor.ui.getEditableElement().parentElement.insertBefore(
          editor.ui.view.toolbar.element,
          editor.ui.getEditableElement()
      );
  }

  form: FormGroup;
  private blogSub: Subscription;
  blogId: string;
  blog: Blog;
  isLoading = false;
  isEditing = false;

  constructor(private featuredService: FeaturedService,
  private route: ActivatedRoute, 
  private alertCtrl: AlertController,
  private router: Router
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if(paramMap.has('blogId') && paramMap.get('blogId') == '') {

        this.isEditing = false;
        this.form = new FormGroup({
          blogTitle: new FormControl(null, {
            updateOn: 'blur',
            validators: [Validators.required, Validators.min(2)]
          }),
          blogDetails: new FormControl(null, {
            updateOn: 'blur',
            validators: [Validators.required, Validators.min(5)]
          }),
          theImage: new FormControl(null, {
            updateOn: 'blur',
            validators: []
          })    
        });
        
      } else {
        this.blogId = paramMap.get('blogId');
        this.isLoading = true;
        this.isEditing = true;
        this.blogSub = this.featuredService.getBlog(this.blogId).subscribe(blog => {
          this.blog = blog;
          this.form = new FormGroup({
            blogTitle: new FormControl(this.blog.blogTitle, {
              updateOn: 'blur',
              validators: [Validators.required, Validators.min(2)]
            }),
            blogDetails: new FormControl(this.blog.blogDetails, {
              updateOn: 'blur',
              validators: [Validators.required, Validators.min(5)]
            }),
            theImage: new FormControl(this.blog.blogImage, {
              updateOn: 'blur',
              validators: []
            })    
          });
        }, error => {
          this.alertCtrl.create({
            header: 'An error occured!',
            message: 'Blog could not be fetched. Please try later',
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

  onCreateBlog() {
    if(!this.form.value || !this.form.get('theImage').value) {
      return;
    }

    const body = this.form.value.blogDetails;
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

    return this.blogSub = this.featuredService.uploadImage(this.form.get('theImage').value).pipe(
      take(1),
      switchMap(uploadRes => {
        if(this.isEditing) {
          return this.featuredService.addBlog(  
            this.blog.id,        
            this.form.value.blogTitle,
            this.form.value.blogDetails,
            uploadRes.imageUrl,
            this.blog.blogFirstName,
            this.blog.blogFirstName,
            this.blog.blogDate.toString(),
            this.blog.blogLikes.toString(),
            this.blog.blogComments,
            this.blog.blogNumberOfComments.toString(),
            youtubeLinkString
          );          
        } else {
            return this.featuredService.addBlog(  
              null,        
              this.form.value.blogTitle,
              this.form.value.blogDetails,
              uploadRes.imageUrl,
              null,
              null,
              new Date().toString(),
              '0',
              [],
              '0',
              youtubeLinkString         
            );
        }               
      })
    ).subscribe(() => {       
      this.form.reset();
      this.router.navigate(['/blog']);
    });
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
    if (this.blogSub) {
      this.blogSub.unsubscribe();
    }
  }
  
}
