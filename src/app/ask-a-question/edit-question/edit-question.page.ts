import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FeaturedService } from 'src/app/featured.service';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.page.html',
  styleUrls: ['./edit-question.page.scss'],
})
export class EditQuestionPage implements OnInit {
  form: FormGroup;
  private questionSub: Subscription;

  constructor(private featuredService: FeaturedService, 
  private router: Router) { }

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
    return this.questionSub = this.featuredService.addQuestion(       
          '',
          this.form.value.questionTitle,
          this.form.value.questionDetails,
          new Date(),
          []    
    ).subscribe(() => {       
      this.form.reset();
      this.router.navigate(['/ask-a-question']);
    });
  }

  ngOnDestroy() {
    if (this.questionSub) {
      this.questionSub.unsubscribe();
    }
  }
}
