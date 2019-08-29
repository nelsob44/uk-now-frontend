import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core';
import { Plugins, Capacitor, CameraSource, CameraResultType } from '@capacitor/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {

  @ViewChild('filePicker', { static: false }) filePickerRef: ElementRef<HTMLInputElement>;
  @Output() imagePick = new EventEmitter<string | File>();
  @Input() showPreview = false;
  selectedImage: string;
  usePicker = false;

  constructor(private platform: Platform) { }

  ngOnInit() {
    console.log('Mobile', this.platform.is('mobile'));
    console.log('desktop', this.platform.is('desktop'));
    console.log('hybrid', this.platform.is('hybrid'));
    console.log('capacitor', this.platform.is('capacitor'));
    console.log('android', this.platform.is('android'));

    if((this.platform.is('mobile') && !this.platform.is('hybrid')) || this.platform.is('desktop')) {
      this.usePicker = true;
    }
  }

  toggleCamera() {
    this.usePicker = !this.usePicker;
  }

  onPickImage() {
    if(!Capacitor.isPluginAvailable('Camera')) {
      this.filePickerRef.nativeElement.click();
      return;
    }
    Plugins.Camera.getPhoto({
      quality: 70,
      allowEditing: true,
      source: CameraSource.Prompt,
      correctOrientation: true,
      height: 320,
      width: 200,
      resultType: CameraResultType.DataUrl
    }).then(image => {
      this.selectedImage = image.dataUrl;
      this.imagePick.emit(image.dataUrl);
      console.log(image.dataUrl);
    })
    .catch(error => {
      console.log(error);
      if(this.usePicker) {
        this.filePickerRef.nativeElement.click();
      }      
      return false;
    });
  }

  onFileChosen(event: Event) {
    const pickedFile = (event.target as HTMLInputElement).files[0];
    if(!pickedFile) {
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      this.selectedImage = dataUrl;
      this.imagePick.emit(pickedFile);
    }
    fr.readAsDataURL(pickedFile);
  }
}
