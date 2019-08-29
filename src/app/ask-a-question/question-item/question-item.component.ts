import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Questions, Blogcomments } from '../../blog/blog.model';

@Component({
  selector: 'app-question-item',
  templateUrl: './question-item.component.html',
  styleUrls: ['./question-item.component.scss'],
})
export class QuestionItemComponent implements OnInit {
  @Input() question: Questions;
  form: FormGroup;
  isReplying = false;

  constructor() { }

  ngOnInit() {
    this.form = new FormGroup({
      questionId: new FormControl(null, {
        updateOn: 'blur',
        validators: []
      }),  
      questionReply: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      })    
    });
  }

  addReply(questionId: string) {
    this.isReplying = !this.isReplying;
    console.log(questionId);
  }

  onCreateReply(questionId: string) {
    if(!this.form.valid) {
      return;
    }
    this.form.get('questionId').patchValue(questionId);    
    console.log(this.form.value);    
    this.isReplying = false;
    this.form.reset();
  }

}
