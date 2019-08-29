import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.page.html',
  styleUrls: ['./edit-question.page.scss'],
})
export class EditQuestionPage implements OnInit {
  form: FormGroup;

  constructor() { }

  ngOnInit() {
    this.form = new FormGroup({
      questionTitle: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(5)]
      }),
      questionDetails: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(5)]
      })    
    });
  }

  onCreateQuestion() {
    if(!this.form.valid) {
      return;
    }
    console.log(this.form.value);
  }
}
