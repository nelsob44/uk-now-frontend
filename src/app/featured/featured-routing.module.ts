import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeaturedPage } from './featured.page';

const routes: Routes = [
    {
        path: 'tabs',
        component: FeaturedPage,
        children: [
            {
                path: 'local-events',
                children: [
                    {
                        path: '',
                        loadChildren: './local-events/local-events.module#LocalEventsPageModule'
                    },
                    {
                        path: 'event-details/:eventId',
                        loadChildren: './local-events/event-details/event-details.module#EventDetailsPageModule'
                    },  
                    { 
                        path: 'edit-local-event/:eventId', 
                        loadChildren: './local-events/edit-local-event/edit-local-event.module#EditLocalEventPageModule' 
                    }
                  
                ]
            },
            {
                path: 'stories',
                children: [
                    {
                        path: '',
                        loadChildren: './stories/stories.module#StoriesPageModule'
                    },
                    {
                        path: 'story-detail/:storyId',
                        loadChildren: './stories/story-detail/story-detail.module#StoryDetailPageModule'
                    }, 
                    { 
                        path: 'edit-story/:storyId', 
                        loadChildren: './stories/edit-story/edit-story.module#EditStoryPageModule' 
                    }                   
                ]
            },
            {
                path: '',
                redirectTo: '/featured/tabs/stories',
                pathMatch: 'full'
            } 
        ]
    },    
    {
        path: '',
        redirectTo: '/featured/tabs/stories',
        pathMatch: 'full'
    } 
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FeaturedRoutingModule {}
