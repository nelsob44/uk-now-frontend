import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/featured/tabs/stories', pathMatch: 'full'
  },
  { 
    path: 'featured', 
    loadChildren: './featured/featured.module#FeaturedPageModule',
    canActivate: [AuthGuard]
  }, 
  { 
    path: 'about', 
    children: [
      {
        path: '',
        loadChildren: './about/about.module#AboutPageModule'
      },
      { 
        path: 'about-edit', 
        loadChildren: './about/about-edit/about-edit.module#AboutEditPageModule',
        canActivate: [AuthGuard]
      }
    ]    
  },  
  {
    path: 'ask-a-question',
    children: [
        {
            path: '',
            loadChildren: './ask-a-question/ask-a-question.module#AskAQuestionPageModule',
            canActivate: [AuthGuard]
        }, 
        { 
            path: 'edit-question/:questionId', 
            loadChildren: './ask-a-question/edit-question/edit-question.module#EditQuestionPageModule',
            canActivate: [AuthGuard] 
        }                                   
    ]
  },
  {
    path: 'find-a-mentor',
    children: [
        {
            path: '',
            loadChildren: './find-a-mentor/find-a-mentor.module#FindAMentorPageModule',
            canActivate: [AuthGuard]
        },
        {
            path: 'mentor-details/:mentorId',
            loadChildren: './find-a-mentor/mentor-details/mentor-details.module#MentorDetailsPageModule',
            canActivate: [AuthGuard]
        }, 
        { 
            path: 'edit-mentor/:mentorId', 
            loadChildren: './find-a-mentor/edit-mentor/edit-mentor.module#EditMentorPageModule',
            canActivate: [AuthGuard] 
        }
        
    ]
  },  
  {
    path: 'uk-life-essential',
    children: [
        {
            path: '',
            loadChildren: './uk-life-essential/uk-life-essential.module#UkLifeEssentialPageModule',
            canActivate: [AuthGuard]
        },
        { 
            path: 'quiz-results', 
            loadChildren: './uk-life-essential/quiz-results/quiz-results.module#QuizResultsPageModule',
            canActivate: [AuthGuard]
        },
        { 
            path: 'delete-quiz', 
            loadChildren: './uk-life-essential/delete-quiz/delete-quiz.module#DeleteQuizPageModule',
            canActivate: [AuthGuard]
        },
        {
            path: 'uk-quiz-details',
            loadChildren: './uk-life-essential/uk-quiz-details/uk-quiz-details.module#UkQuizDetailsPageModule',
            canActivate: [AuthGuard]
        }, 
        { 
            path: 'edit-quiz/:quizId', 
            loadChildren: './uk-life-essential/edit-quiz/edit-quiz.module#EditQuizPageModule',
            canActivate: [AuthGuard]
        },  
        { 
            path: 'edit-life-essential/:essentialId', 
            loadChildren: './uk-life-essential/edit-life-essential/edit-life-essential.module#EditLifeEssentialPageModule',
            canActivate: [AuthGuard]
        }                   
    ]
  },
  {
    path: 'your-local',
    children: [
        {
            path: '',
            loadChildren: './your-local/your-local.module#YourLocalPageModule',
            canActivate: [AuthGuard]
        },
        {
            path: 'your-local-details/:yourLocalId',
            loadChildren: './your-local/your-local-details/your-local-details.module#YourLocalDetailsPageModule',
            canActivate: [AuthGuard]
        },
        { 
            path: 'edit-your-local/:yourLocalId', 
            loadChildren: './your-local/edit-your-local/edit-your-local.module#EditYourLocalPageModule',
            canActivate: [AuthGuard] 
        }        
    ]
  },  
  { path: 'auth', loadChildren: './auth/auth.module#AuthPageModule' },  
  { 
    path: 'blog', 
    children: [
      {
        path: '',
        loadChildren: './blog/blog.module#BlogPageModule'        
      },
      { 
        path: 'blog-edit/:blogId', 
        loadChildren: './blog/blog-edit/blog-edit.module#BlogEditPageModule',
        canActivate: [AuthGuard] 
      },
      { 
        path: 'blog-detail/:blogId', 
        loadChildren: './blog/blog-detail/blog-detail.module#BlogDetailPageModule'
      }
    ]
  },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { 
    path: 'contact', 
    loadChildren: './contact/contact.module#ContactPageModule',
    canActivate: [AuthGuard]
  },
  { 
    path: 'profile', 
    loadChildren: './profile/profile.module#ProfilePageModule',
    canActivate: [AuthGuard]
  },
  { 
    path: 'profile/:userId', 
    loadChildren: './profile/profile.module#ProfilePageModule',
    canActivate: [AuthGuard]
  },
  { 
    path: 'edit-profile/:userId', 
    loadChildren: './profile/edit-profile/edit-profile.module#EditProfilePageModule',
    canActivate: [AuthGuard]
  },
  { 
    path: 'verify-email/:email/:tokenString', 
    loadChildren: './verify-email/verify-email.module#VerifyEmailPageModule' 
  },
  { 
    path: 'request-reset', 
    loadChildren: './auth/request-reset/request-reset.module#RequestResetPageModule' 
  },
  { 
    path: 'response-reset/:token', 
    loadChildren: './auth/response-reset/response-reset.module#ResponseResetPageModule' 
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
