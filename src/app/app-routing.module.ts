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
    canLoad: [AuthGuard]
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
        canLoad: [AuthGuard]
      }
    ]    
  },  
  {
    path: 'ask-a-question',
    children: [
        {
            path: '',
            loadChildren: './ask-a-question/ask-a-question.module#AskAQuestionPageModule',
            canLoad: [AuthGuard]
        }, 
        { 
            path: 'edit-question/:questionId', 
            loadChildren: './ask-a-question/edit-question/edit-question.module#EditQuestionPageModule',
            canLoad: [AuthGuard] 
        }                                   
    ]
  },
  {
    path: 'find-a-mentor',
    children: [
        {
            path: '',
            loadChildren: './find-a-mentor/find-a-mentor.module#FindAMentorPageModule',
            canLoad: [AuthGuard]
        },
        {
            path: 'mentor-details/:mentorId',
            loadChildren: './find-a-mentor/mentor-details/mentor-details.module#MentorDetailsPageModule',
            canLoad: [AuthGuard]
        }, 
        { 
            path: 'edit-mentor/:mentorId', 
            loadChildren: './find-a-mentor/edit-mentor/edit-mentor.module#EditMentorPageModule',
            canLoad: [AuthGuard] 
        }
        
    ]
  },  
  {
    path: 'uk-life-essential',
    children: [
        {
            path: '',
            loadChildren: './uk-life-essential/uk-life-essential.module#UkLifeEssentialPageModule',
            canLoad: [AuthGuard]
        },
        { 
            path: 'quiz-results', 
            loadChildren: './uk-life-essential/quiz-results/quiz-results.module#QuizResultsPageModule',
            canLoad: [AuthGuard]
        },
        { 
            path: 'delete-quiz', 
            loadChildren: './uk-life-essential/delete-quiz/delete-quiz.module#DeleteQuizPageModule',
            canLoad: [AuthGuard]
        },
        {
            path: 'uk-quiz-details',
            loadChildren: './uk-life-essential/uk-quiz-details/uk-quiz-details.module#UkQuizDetailsPageModule',
            canLoad: [AuthGuard]
        }, 
        { 
            path: 'edit-quiz/:quizId', 
            loadChildren: './uk-life-essential/edit-quiz/edit-quiz.module#EditQuizPageModule',
            canLoad: [AuthGuard]
        },  
        { 
            path: 'edit-life-essential/:essentialId', 
            loadChildren: './uk-life-essential/edit-life-essential/edit-life-essential.module#EditLifeEssentialPageModule',
            canLoad: [AuthGuard]
        }                   
    ]
  },
  {
    path: 'your-local',
    children: [
        {
            path: '',
            loadChildren: './your-local/your-local.module#YourLocalPageModule',
            canLoad: [AuthGuard]
        },
        {
            path: 'your-local-details/:yourLocalId',
            loadChildren: './your-local/your-local-details/your-local-details.module#YourLocalDetailsPageModule',
            canLoad: [AuthGuard]
        },
        { 
            path: 'edit-your-local/:yourLocalId', 
            loadChildren: './your-local/edit-your-local/edit-your-local.module#EditYourLocalPageModule',
            canLoad: [AuthGuard] 
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
        canLoad: [AuthGuard] 
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
    canLoad: [AuthGuard]
  },
  { 
    path: 'profile', 
    loadChildren: './profile/profile.module#ProfilePageModule',
    canLoad: [AuthGuard]
  },
  { 
    path: 'profile/:userId', 
    loadChildren: './profile/profile.module#ProfilePageModule',
    canLoad: [AuthGuard]
  },
  { 
    path: 'edit-profile/:userId', 
    loadChildren: './profile/edit-profile/edit-profile.module#EditProfilePageModule',
    canLoad: [AuthGuard]
  },
  ];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
