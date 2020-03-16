import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Questions, Blogcomments } from '../../blog/blog.model';
import { FeaturedService } from 'src/app/featured.service';
import { take, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-question-item',
  templateUrl: './question-item.component.html',
  styleUrls: ['./question-item.component.scss'],
})
export class QuestionItemComponent implements OnInit {
  @Input() question: Questions;
  @Output() newQuestion = new EventEmitter<Questions>();
  @Output() oldQuestion = new EventEmitter<Questions>();
  @Output() showReplies = new EventEmitter<Questions>();
  @Output() showRepliesId = new EventEmitter<Questions>();

  form: FormGroup;
  isReplying = false;
  private statusSub: Subscription;
  isAdmin = true;
  type = 'question';
  replyQuestion: Questions;
  

  constructor(private authService: AuthService, private featuredService: FeaturedService) { }

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

    this.statusSub = this.authService.userStatus.subscribe(
      status => {
        
        if(status != null && (status < 3))
        {          
          this.isAdmin = true;
        }
      }); 
  }

  onClickReplies(idQuestion: Questions) {
    this.replyQuestion = this.question;
    this.showReplies.emit(this.replyQuestion);
    this.showRepliesId.emit(idQuestion);
  }

  addReply(questionId: string) {
    this.isReplying = !this.isReplying;
    
  }

  onCreateReply(questionId: string) {
    if(!this.form.valid) {
      return;
    }
    this.form.get('questionId').patchValue(questionId);    

    return this.featuredService.addComment(
      questionId,
      this.form.value.questionReply,
      this.type,
      new Date().toString()
    ).pipe(
      take(1),
      map(dataRes => {
        
        const returnedQuestion = [];
        
          for (const key in dataRes) {
            if(dataRes.hasOwnProperty(key)) {
              returnedQuestion.push(
                new Questions(
                  dataRes[key]._id,
                  dataRes[key].questionUserName,
                  dataRes[key].questionTitle,                  
                  dataRes[key].questionDetails,
                  dataRes[key].questionTime,
                  dataRes[key].questionReplies
                )
              );
            }
          }
        
        this.newQuestion.emit(returnedQuestion[0]);
        
      })
    ).subscribe(() => {
      this.isReplying = false;
      this.form.reset();
    })   
    
  }

  onDelete(questionId: string) {
       
    return this.featuredService.deleteItem(
      questionId,
      this.type
    ).pipe(
      take(1),
      map(dataRes => {
        
        console.log(dataRes);
        
      })
    ).subscribe(() => {
      
      this.oldQuestion.emit(this.question);
    })   
  }

  ngOnDestroy() {
    if (this.statusSub) {      
      this.statusSub.unsubscribe();
    }
  }

}
