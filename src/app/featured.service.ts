import { Injectable } from '@angular/core';
import { Story } from './featured/stories/story.model';
import { Event } from './featured/local-events/event.model';
import { About, Essentials, QuizQuestion } from './about/about.model';
import { AuthService } from 'src/app/auth/auth.service';
import { take, map, tap, delay, switchMap, filter } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { Blog, Blogcomments, Questions, Mentor, Local, Results } from './blog/blog.model';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './auth/user.model';
import { Message } from './profile/message.model';


export interface AboutResponseData {  

  aboutDetails: string;
  aboutImage: string;  

}

const URL = environment.baseUrl + '/post-image';

@Injectable({
  providedIn: 'root'
})
export class FeaturedService {

  private _results = new BehaviorSubject<Results[]>([]); 
  private _resultsTotalItems = new BehaviorSubject<any[]>([]); 
   
  private _quizzes = new BehaviorSubject<QuizQuestion[]>([]); 
  private _quizzesTotalItems = new BehaviorSubject<any[]>([]); 

  private _essentials = new BehaviorSubject<Essentials[]>([]); 
  private _essentialTotalItems = new BehaviorSubject<any[]>([]); 

  private _locals = new BehaviorSubject<Local[]>([]);
  private _localTotalItems = new BehaviorSubject<any[]>([]);

  private _mentors = new BehaviorSubject<Mentor[]>([]);
  private _mentorTotalItems = new BehaviorSubject<any[]>([]);

  private _questions = new BehaviorSubject<Questions[]>([]);
  private _questionTotalItems = new BehaviorSubject<any[]>([]);

  private _blogs = new BehaviorSubject<Blog[]>([]);
  private _blogTotalItems = new BehaviorSubject<any[]>([]);
 
  private _about: About;

  private _events = new BehaviorSubject<Event[]>([]);
  private _eventTotalItems = new BehaviorSubject<any[]>([]);

  private _stories = new BehaviorSubject<Story[]>([]);
  private _storyTotalItems = new BehaviorSubject<any[]>([]);

  urlPath: string;

  get stories() {
    return this._stories.asObservable();
  }
  get storyTotalItems() {
    return this._storyTotalItems.asObservable();
  }

  get events() {
    return this._events.asObservable();
  }
  get eventTotalItems() {
    return this._eventTotalItems.asObservable();
  }

  get blogs() {
    return this._blogs.asObservable();
  }
  get blogTotalItems() {
    return this._blogTotalItems.asObservable();
  }

  get questions() {
    return this._questions.asObservable();
  }
  get questionTotalItems() {
    return this._questionTotalItems.asObservable();
  }

  get mentors() {
    return this._mentors.asObservable();
  }
  get mentorTotalItems() {
    return this._mentorTotalItems.asObservable();
  }

  get locals() {
    return this._locals.asObservable();
  }
  get localTotalItems() {
    return this._localTotalItems.asObservable();
  }

  get essentials() {
    return this._essentials.asObservable();
  }
  get essentialTotalItems() {
    return this._essentialTotalItems.asObservable();
  }

  get quizzes() {
    return this._quizzes.asObservable();
  }
  get quizzesTotalItems() {
    return this._quizzesTotalItems.asObservable();
  }

  get results() {
    return this._results.asObservable();
  }
  get resultsTotalItems() {
    return this._resultsTotalItems.asObservable();
  }

  constructor(private http: HttpClient, private authService: AuthService) { }

  fetchabout() {
    const url = environment.baseUrl + '/about/show';

    return this.http.get<About>(url)
        .pipe(
          map(data => {     
              
            const about = [];

            for (const key in data) {
              if(data.hasOwnProperty(key)) {
                about.push(
                  new About(
                    data[key]._id,
                    data[key].aboutDetails,
                    data[key].aboutImage
                  )

                );
              }
            }

            return about;
          })
        );
  }

  fetchquestions(page) {
    const url = environment.baseUrl + '/question/list';
    const uploadData = new FormData();
    uploadData.append('pageNumber', page);

    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post<{[key: string]: Questions}>(url, uploadData,
          {headers: {Authorization: 'Bearer ' + token}}
        )
      }), 
        map(data => {    

          let totalArray = [];

          for (const key in data) {
            if(data.hasOwnProperty(key)) {
              totalArray.push(
                data.totalItems
              );
            }
          }   
          
          const questions = [];
          for (const key in data.questions) {
            if(data.questions.hasOwnProperty(key)) {
              questions.push(
                new Questions(
                  data.questions[key]._id,
                  data.questions[key].questionUserName,
                  data.questions[key].questionTitle,
                  data.questions[key].questionDetails,
                  data.questions[key].questionTime,
                  data.questions[key].questionReplies
                )
              );
            }
          }
          this._questionTotalItems.next(totalArray);
          return questions;
        }),
        tap(questions => {
          this._questions.next(questions);
        })     
    );
  }

  fetchblogs(page) {
    const url = environment.baseUrl + '/blog/list';
    const uploadData = new FormData();
    uploadData.append('pageNumber', page);
    
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post<{[key: string]: Blog}>(url, uploadData,
          {headers: {Authorization: 'Bearer ' + token}}
        )
      }), 
        map(data => {     
          let totalArray = [];

          for (const key in data) {
            if(data.hasOwnProperty(key)) {
              totalArray.push(
                data.totalItems
              );
            }
          }         
            
          const blogs = [];
          for (const key in data.blogs) {
            if(data.blogs.hasOwnProperty(key)) {
              blogs.push(
                new Blog(
                  data.blogs[key]._id,
                  data.blogs[key].blogTitle,
                  data.blogs[key].blogDetails,
                  data.blogs[key].blogImage,
                  data.blogs[key].blogFirstName,
                  data.blogs[key].blogLastName,
                  new Date(data.blogs[key].blogDate),
                  data.blogs[key].blogLikes,
                  data.blogs[key].blogComments,                  
                  data.blogs[key].blogNumberOfComments,
                  data.blogs[key].blogLikers,
                  data.blogs[key].youtubeLinkString
                )
              );
            }
          }                 
          this._blogTotalItems.next(totalArray);
          return blogs;
        }),
        tap(blogs => {
          this._blogs.next(blogs);
        })     
    );
  }

  fetchevents(page) {
    const url = environment.baseUrl + '/event/list';
    const uploadData = new FormData();
    uploadData.append('pageNumber', page);

    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post<{[key: string]: Event}>(url, uploadData,
          {headers: {Authorization: 'Bearer ' + token}}
        )
      }), 
        map(data => {  
          let totalArray = [];

          for (const key in data) {
            if(data.hasOwnProperty(key)) {
              totalArray.push(
                data.totalItems
              );
            }
          }       
            
          const events = [];
          for (const key in data.events) {
            if(data.events.hasOwnProperty(key)) {
              events.push(
                new Event(
                  data.events[key]._id,
                  data.events[key].eventName,
                  data.events[key].eventDetails,
                  data.events[key].eventLocation,
                  new Date(data.events[key].eventDate),
                  data.events[key].eventImage                  
                )
              );
            }
          }
          this._eventTotalItems.next(totalArray);
          return events;
        }),
        tap(events => {
          this._events.next(events);
        })     
    );
  }


  fetchstories(page) {
    const url = environment.baseUrl + '/story/list';
    const uploadData = new FormData();
    uploadData.append('pageNumber', page);

    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post<{[key: string]: Story}>(url, uploadData,
          {headers: {Authorization: 'Bearer ' + token}}
        )
      }), 
        map(data => {     
            let totalArray = [];

          for (const key in data) {
            if(data.hasOwnProperty(key)) {
              totalArray.push(
                data.totalItems
              );
            }
          }     
          const stories = [];
          for (const key in data.stories) {
            if(data.stories.hasOwnProperty(key)) {
              stories.push(
                new Story(
                  data.stories[key]._id,
                  data.stories[key].storyTitle,
                  data.stories[key].storyDetail,
                  data.stories[key].storyImage,
                  data.stories[key].userName,
                  new Date(data.stories[key].postedOn),
                  data.stories[key].storyLikes,
                  data.stories[key].storyLikers,
                  data.stories[key].youtubeLinkString
                )
              );
            }
          }
          this._storyTotalItems.next(totalArray);
          return stories;
        }),
        tap(stories => {
          this._stories.next(stories);
        })     
    );
  }

  fetchmentors(page) {
    const url = environment.baseUrl + '/mentor/list';
    const uploadData = new FormData();
    uploadData.append('pageNumber', page);

    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post<{[key: string]: Mentor}>(url, uploadData, 
          {headers: {Authorization: 'Bearer ' + token}}
        )
      }), 
        map(data => {     
            let totalArray = [];

          for (const key in data) {
            if(data.hasOwnProperty(key)) {
              totalArray.push(
                data.totalItems
              );
            }
          }     
          const mentors = [];
          for (const key in data.mentors) {
            if(data.mentors.hasOwnProperty(key)) {
              mentors.push(
                new Mentor(
                  data.mentors[key]._id,
                  data.mentors[key].mentorUserName,
                  data.mentors[key].mentorProfile,
                  data.mentors[key].mentorField,
                  data.mentors[key].mentorImage,
                  data.mentors[key].mentorEmail,
                  data.mentors[key].mentorLinkedIn                
                )
              );
            }
          }
          this._mentorTotalItems.next(totalArray);
          return mentors;
        }),
        tap(mentors => {
          this._mentors.next(mentors);
        })     
    );
  }

  fetchessentials(page) {
    const url = environment.baseUrl + '/essential/list';
    const uploadData = new FormData();
    uploadData.append('pageNumber', page);

    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post<{[key: string]: Essentials}>(url, uploadData,
          {headers: {Authorization: 'Bearer ' + token}}
        )
      }), 
        map(data => {     
          let totalArray = [];

          for (const key in data) {
            if(data.hasOwnProperty(key)) {
              totalArray.push(
                data.totalItems
              );
            }
          }     
          const essentials = [];
          for (const key in data.essentials) {
            if(data.essentials.hasOwnProperty(key)) {
              essentials.push(
                new Essentials(
                  data.essentials[key]._id,
                  data.essentials[key].essentialDetails,
                  data.essentials[key].essentialsImage,
                  data.essentials[key].essentialsTime                                
                )
              );
            }
          }
          this._essentialTotalItems.next(totalArray);
          return essentials;
        }),
        tap(essentials => {
          this._essentials.next(essentials);
        })     
    );
  }

  fetchquizzes(page=null) {
    const url = environment.baseUrl + '/essential/get-quiz';
    const uploadData = new FormData();
    uploadData.append('pageNumber', page);

    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post<{[key: string]: QuizQuestion}>(url, uploadData,
          {headers: {Authorization: 'Bearer ' + token}}
        )
      }), 
        map(data => {     
          let totalArray = [];

          for (const key in data) {
            if(data.hasOwnProperty(key)) {
              totalArray.push(
                data.totalItems
              );
            }
          }     
          const quizzes = [];
          for (const key in data.quizzes) {
            if(data.quizzes.hasOwnProperty(key)) {
              quizzes.push(
                new QuizQuestion(
                  data.quizzes[key]._id,
                  data.quizzes[key].questionDetail,
                  data.quizzes[key].questionImage,
                  data.quizzes[key].questionAnswer,
                  data.quizzes[key].questionSubject                                
                )
              );
            }
          }
          this._quizzesTotalItems.next(totalArray);
           
          return quizzes;
        }),
        tap(quizzes => {
          this._quizzes.next(quizzes);
        })     
    );
  }

  fetchquizresults(page=null) {
    const url = environment.baseUrl + '/essential/get-quiz-results';
    const uploadData = new FormData();
    uploadData.append('pageNumber', page);

    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post<{[key: string]: Results}>(url, uploadData,
          {headers: {Authorization: 'Bearer ' + token}}
        )
      }), 
        map(data => {     
          let totalArray = [];

          for (const key in data) {
            if(data.hasOwnProperty(key)) {
              totalArray.push(
                data.totalItems
              );
            }
          }     
          const results = [];
          for (const key in data.results) {
            if(data.results.hasOwnProperty(key)) {
              results.push(
                new Results(
                  data.results[key]._id,
                  data.results[key].userName,
                  data.results[key].userId,  
                  data.results[key].isWinner,                
                  data.results[key].subject,
                  data.results[key].score,
                  data.results[key].createdAt                                              
                )
              );
            }
          }
          this._resultsTotalItems.next(totalArray);
           
          return results;
        }),
        tap(results => {
          this._results.next(results);
        })     
    );
  }


  fetchlocals(page) {
    const url = environment.baseUrl + '/local/list';
    const uploadData = new FormData();
    uploadData.append('pageNumber', page);
    
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post<{[key: string]: Local}>(url, uploadData,
          {headers: {Authorization: 'Bearer ' + token}}
        )
      }), 
        map(data => {     
          let totalArray = [];

          for (const key in data) {
            if(data.hasOwnProperty(key)) {
              totalArray.push(
                data.totalItems
              );
            }
          }  
          const locals = [];
          for (const key in data.locals) {
            if(data.locals.hasOwnProperty(key)) {
              locals.push(
                new Local(
                  data.locals[key]._id,
                  data.locals[key].localName,
                  data.locals[key].localType,
                  data.locals[key].localAddress,
                  data.locals[key].localImage,
                  data.locals[key].localContact, 
                  data.locals[key].localRating,
                  data.locals[key].ratings                            
                )
              );
            }
          }
          this._localTotalItems.next(totalArray);
          return locals;
        }),
        tap(locals => {
          this._locals.next(locals);
        })     
    );
  }

  fetchlocalsFilter(page, localType: string = null) {
    const url = environment.baseUrl + '/local/list-filter';
    const uploadData = new FormData();
    uploadData.append('pageNumber', page);
    uploadData.append('localType', localType);

    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post<{[key: string]: Local}>(url, uploadData,
          {headers: {Authorization: 'Bearer ' + token}}
        )
      }), 
        map(data => {     
          let totalArray = [];

          for (const key in data) {
            if(data.hasOwnProperty(key)) {
              totalArray.push(
                data.totalItems
              );
            }
          }  
          const locals = [];
          for (const key in data.locals) {
            if(data.locals.hasOwnProperty(key)) {
              locals.push(
                new Local(
                  data.locals[key]._id,
                  data.locals[key].localName,
                  data.locals[key].localType,
                  data.locals[key].localAddress,
                  data.locals[key].localImage,
                  data.locals[key].localContact, 
                  data.locals[key].localRating,
                  data.locals[key].ratings                            
                )
              );
            }
          }
          this._localTotalItems.next(totalArray);
          return locals;
        }),
        tap(locals => {
          this._locals.next(locals);
        })     
    );
  }

  fetchEventsFilter(page, eventName: string = null) {
    const url = environment.baseUrl + '/event/list-filter';
    const uploadData = new FormData();
    uploadData.append('pageNumber', page);
    uploadData.append('eventName', eventName);

    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post<{[key: string]: Event}>(url, uploadData,
          {headers: {Authorization: 'Bearer ' + token}}
        )
      }), 
        map(data => {  
          let totalArray = [];

          for (const key in data) {
            if(data.hasOwnProperty(key)) {
              totalArray.push(
                data.totalItems
              );
            }
          }       
           
          const events = [];
          for (const key in data.events) {
            if(data.events.hasOwnProperty(key)) {
              events.push(
                new Event(
                  data.events[key]._id,
                  data.events[key].eventName,
                  data.events[key].eventDetails,
                  data.events[key].eventLocation,
                  new Date(data.events[key].eventDate),
                  data.events[key].eventImage                  
                )
              );
            }
          }
          this._eventTotalItems.next(totalArray);
          return events;
        }),
        tap(events => {
          this._events.next(events);
        })     
    );
  }

  fetchBlogsFilter(page, blogTitle: string = null) {
    const url = environment.baseUrl + '/blog/list-filter';
    const uploadData = new FormData();
    uploadData.append('pageNumber', page);
    uploadData.append('blogTitle', blogTitle);
    
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post<{[key: string]: Blog}>(url, uploadData,
          {headers: {Authorization: 'Bearer ' + token}}
        )
      }), 
        map(data => {     
          let totalArray = [];

          for (const key in data) {
            if(data.hasOwnProperty(key)) {
              totalArray.push(
                data.totalItems
              );
            }
          }         
            
          const blogs = [];
          for (const key in data.blogs) {
            if(data.blogs.hasOwnProperty(key)) {
              blogs.push(
                new Blog(
                  data.blogs[key]._id,
                  data.blogs[key].blogTitle,
                  data.blogs[key].blogDetails,
                  data.blogs[key].blogImage,
                  data.blogs[key].blogFirstName,
                  data.blogs[key].blogLastName,
                  new Date(data.blogs[key].blogDate),
                  data.blogs[key].blogLikes,
                  data.blogs[key].blogComments,                  
                  data.blogs[key].blogNumberOfComments,
                  data.blogs[key].blogLikers,
                  data.blogs[key].youtubeLinkString
                )
              );
            }
          }                 
          this._blogTotalItems.next(totalArray);
          return blogs;
        }),
        tap(blogs => {
          this._blogs.next(blogs);
        })     
    );
  }

  fetchStoriesFilter(page, storyTitle: string = null) {
    const url = environment.baseUrl + '/story/list-filter';
    const uploadData = new FormData();
    uploadData.append('pageNumber', page);
    uploadData.append('storyTitle', storyTitle);

    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post<{[key: string]: Story}>(url, uploadData,
          {headers: {Authorization: 'Bearer ' + token}}
        )
      }), 
        map(data => {     
            let totalArray = [];

          for (const key in data) {
            if(data.hasOwnProperty(key)) {
              totalArray.push(
                data.totalItems
              );
            }
          }     
          const stories = [];
          for (const key in data.stories) {
            if(data.stories.hasOwnProperty(key)) {
              stories.push(
                new Story(
                  data.stories[key]._id,
                  data.stories[key].storyTitle,
                  data.stories[key].storyDetail,
                  data.stories[key].storyImage,
                  data.stories[key].userName,
                  new Date(data.stories[key].postedOn),
                  data.stories[key].storyLikes,
                  data.stories[key].storyLikers,
                  data.stories[key].youtubeLinkString
                )
              );
            }
          }
          this._storyTotalItems.next(totalArray);
          return stories;
        }),
        tap(stories => {
          this._stories.next(stories);
        })     
    );
  }

  fetchmentorsFilter(page, mentorField: string = null) {
    const url = environment.baseUrl + '/mentor/list-filter';
    const uploadData = new FormData();
    uploadData.append('pageNumber', page);
    uploadData.append('mentorField', mentorField);

    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post<{[key: string]: Mentor}>(url, uploadData, 
          {headers: {Authorization: 'Bearer ' + token}}
        )
      }), 
        map(data => {     
            let totalArray = [];

          for (const key in data) {
            if(data.hasOwnProperty(key)) {
              totalArray.push(
                data.totalItems
              );
            }
          }     
          const mentors = [];
          for (const key in data.mentors) {
            if(data.mentors.hasOwnProperty(key)) {
              mentors.push(
                new Mentor(
                  data.mentors[key]._id,
                  data.mentors[key].mentorUserName,
                  data.mentors[key].mentorProfile,
                  data.mentors[key].mentorField,
                  data.mentors[key].mentorImage,
                  data.mentors[key].mentorEmail,
                  data.mentors[key].mentorLinkedIn           
                )
              );
            }
          }
          this._mentorTotalItems.next(totalArray);
          return mentors;
        }),
        tap(mentors => {
          this._mentors.next(mentors);
        })     
    );
  }

  fetchuser(userId: string) { 

    const url = environment.baseUrl + '/auth/user';
    const uploadData = new FormData();
    uploadData.append('userId', userId);

    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post<any>(url, uploadData,
          {headers: {Authorization: 'Bearer ' + token}}
        )
      }),
      map(blogData => {
            
          return  new User(
              blogData.userId,
              blogData.firstname,
              blogData.lastname,
              blogData.status,
              '',
              0,
              blogData.details,
              blogData.email,
              blogData.profilePic,
              new Date()             
            )              
    }));       
  }



  fetchblog(id: string) { 

    const url = environment.baseUrl + '/blog/' + id;
    const uploadData = new FormData();
    uploadData.append('id', id);

    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post<any>(url, uploadData,
          {headers: {Authorization: 'Bearer ' + token}}
        )
      }),
      map(blogData => {
                     
          return  new Blog(
              blogData.blog._id,
              blogData.blog.blogTitle,
              blogData.blog.blogDetails,
              blogData.blog.blogImage,
              blogData.blog.blogFirstName,
              blogData.blog.blogLastName,
              new Date(blogData.blog.blogDate),
              blogData.blog.blogLikes,
              blogData.blog.blogComments,
              blogData.blog.blogNumberOfComments,
              blogData.blog.blogLikers,
              blogData.blog.youtubeLinkString
            )              
    }));       
  }

  fetchmentor(id: string) { 

    const url = environment.baseUrl + '/mentor/' + id;
    const uploadData = new FormData();
    uploadData.append('id', id);

    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post<any>(url, uploadData,
          {headers: {Authorization: 'Bearer ' + token}}
        )
      }),
      map(mentorData => {                     
          return  new Mentor(
              mentorData.mentor._id,
              mentorData.mentor.mentorUserName,
              mentorData.mentor.mentorProfile,
              mentorData.mentor.mentorField,
              mentorData.mentor.mentorImage,
              mentorData.mentor.mentorEmail,
              mentorData.mentor.mentorLinkedIn
            )
    }));       
  }


  fetchevent(id: string) { 

    const url = environment.baseUrl + '/event/' + id;
    const uploadData = new FormData();
    uploadData.append('id', id);

    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post<any>(url, uploadData,
          {headers: {Authorization: 'Bearer ' + token}}
        )
      }),
      map(eventData => {     
                     
          return  new Event(
              eventData.event._id,
              eventData.event.eventName,
              eventData.event.eventDetails,
              eventData.event.eventLocation,
              new Date(eventData.event.eventDate),
              eventData.event.eventImage                  
            )
    }));       
  }

  getBlog(id: string) {    
    return this.blogs.pipe(
      take(1),
      map(blogs => {
        return { ...blogs.find(b => b.id === id)};
      })
    );     
  }

  getLocal(id: string) {    
    return this.locals.pipe(
      take(1),
      map(locals => {
        return { ...locals.find(l => l.id === id)};
      })
    );     
  }


  getEssential(id: string) {    
    return this.essentials.pipe(
      take(1),
      map(essentials => {
        return { ...essentials.find(e => e.id === id)};
      })
    );     
  }

  getQuestion(id: string) {    
    return this.questions.pipe(
      take(1),
      map(questions => {
        return { ...questions.find(q => q.id === id)};
      })
    );     
  }

  getStory(id: string) {
    return this.stories.pipe(
      take(1),
      map(stories => {
        return { ...stories.find(q => q.id === id)};
      })
    );
  }

  fetchstory(id: string) { 

    const url = environment.baseUrl + '/story/' + id;
    const uploadData = new FormData();
    uploadData.append('id', id);

    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post<any>(url, uploadData,
          {headers: {Authorization: 'Bearer ' + token}}
        )
      }),
      map(storyData => {
                     
          return  new Story(
              storyData.story._id,
              storyData.story.storyTitle,
              storyData.story.storyDetail,
              storyData.story.storyImage,
              storyData.story.userName,
              new Date(storyData.story.postedOn),
              storyData.story.storyLikes,
              storyData.story.storyLikers,
              storyData.story.youtubeLinkString
            )              
    }));       
  }


  getEvent(id: string) {    
    return this.events.pipe(
      take(1),
      map(events => {
        return {...events.find(ev => ev.id === id)};
      })
    );     
  }

  getMentor(id: string) {   
    return this.mentors.pipe(
      take(1),
      map(mentors => {
        return {...mentors.find(m => m.id === id)};
      })
    );          
  }

  uploadImage(image: any) {
    
    const uploadData = new FormData();
    uploadData.append('image', image);
    
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.put<{imageUrl: string}>(URL, uploadData, 
        {headers: {Authorization: 'Bearer ' + token}}
        ).pipe(
          map(data => {   
                    
            return data;
          })
        );
      })
    );     
  }

  addAbout(
    aboutDetails: string,
    aboutImage: string
  ) {
    
    const uploadData = new FormData();
    uploadData.append('aboutDetails', aboutDetails);
    uploadData.append('aboutImage', aboutImage);

    
    const url = environment.baseUrl + '/about/add';
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post<AboutResponseData>(url, uploadData, 
        {headers: {Authorization: 'Bearer ' + token}}
        )
        .pipe(
          map(data => {   
               
            return data;
          })
        );
      })
    );
  }

  updateBlog(
    id: string,
    blogTitle: string,
    blogDetails: string,
    blogImage: string,
    blogFirstName: string,
    blogLastName: string,
    blogDate: Date,
    blogLikes: string,
    blogComments: Blogcomments[],
    blogNumberOfComments: string
  ) {
    
    const url = environment.baseUrl + '/blog/update/' + id;
        
    const uploadData = new FormData();
    uploadData.append('blogTitle', blogTitle);
    uploadData.append('blogDetails', blogDetails);
    uploadData.append('blogImage', blogImage);       
    uploadData.append('blogLikes', blogLikes);    
    uploadData.append('blogNumberOfComments', blogNumberOfComments);
    
    
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        
        return this.http.put<Blog>(url, uploadData, 
        {headers: {Authorization: 'Bearer ' + token}}
        )
        .pipe(
          map(data => {
           
            return data;
          })
        );
      })
    );
  }  

  updateBlogLike(
    id: string,    
    blogLikes: string,    
  ) {
    
    const url = environment.baseUrl + '/blog/like/' + id;
    
    
    const uploadData = new FormData();    
           
    uploadData.append('blogLikes', blogLikes);        
   
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        
        return this.http.put<Blog>(url, uploadData, 
        {headers: {Authorization: 'Bearer ' + token}}
        )
        .pipe(
          map(data => {
           
            return data;
          })
        );
      })
    );
  }  

  updateStoryLike(
    id: string,    
    storyLikes: string,    
  ) {
    
    const url = environment.baseUrl + '/story/like/' + id;
        
    const uploadData = new FormData();    
           
    uploadData.append('storyLikes', storyLikes);    
        
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        
        return this.http.put<Story>(url, uploadData, 
        {headers: {Authorization: 'Bearer ' + token}}
        )
        .pipe(
          map(data => {
           
            return data;
          })
        );
      })
    );
  }  

  addMessage(
    messageFrom: string,
    messageTo: string,    
    messageDetails: string,
    messageImage: string
  ) {
    
    const url = environment.baseUrl + '/message/add';
    const uploadData = new FormData();    
           
    uploadData.append('messageFrom', messageFrom);
    uploadData.append('messageTo', messageTo);
    uploadData.append('messageDetails', messageDetails);
    uploadData.append('messageImage', messageImage);       
    
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        
        return this.http.post<any>(url, uploadData, 
        {headers: {Authorization: 'Bearer ' + token}}
        )
        .pipe(
          map(data => {
            
           return  new Message(
              data.message._id,
              data.message.messageFrom,
              data.message.messageTo,
              data.message.messageDetails,
              data.message.messageImage,
              data.message.messageRead,
              new Date(data.message.messageTime).toString()              
            )
          })
        );
      })
    );
  }

  getMessages(
    page,
    messageFrom: string,
    messageTo: string
  ) {
    
    const url = environment.baseUrl + '/message/read';
    const uploadData = new FormData();
    uploadData.append('pageNumber', page);    
           
    uploadData.append('messageFrom', messageFrom);
    uploadData.append('messageTo', messageTo);
        
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        
        return this.http.post<any>(url, uploadData, 
        {headers: {Authorization: 'Bearer ' + token}}
        )
        .pipe(
          map(data => {
                        
           const returnedMessages = [];
          for (const key in data.messages) {
            if(data.messages.hasOwnProperty(key)) {
              returnedMessages.push(
                new Message(
                  data.messages[key]._id,
                  data.messages[key].messageFrom,
                  data.messages[key].messageTo,
                  data.messages[key].messageDetails,
                  data.messages[key].messageImage,
                  data.messages[key].messageRead,
                  new Date(data.messages[key].messageTime).toString()
                )
              );
            }
          }          
          return returnedMessages.reverse();       
          })
        );
      })
    );
  }

  verifyEmail(
    email: string,
    token: string
  ) {
    
    const url = environment.baseUrl + '/email/verify-email';
    const uploadData = new FormData();
    
    uploadData.append('email', email);
    uploadData.append('token', token);
    
      return this.http.post<any>(url, uploadData)
      .pipe(
        map(data => {
                            
        return data.message;       
        })
      );    
  }

  resendEmailVerification(email: string) {
    
    const url = environment.baseUrl + '/email/resend';
       
    const uploadData = new FormData();
    uploadData.append('email', email);

    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post<any>(url, uploadData,
          {headers: {Authorization: 'Bearer ' + token}}
        )
      }),
      map(data => {      
           
          return data.message;
    }));       
  }

  sendMentorConnectionEmail(email: string, mentorEmail: string) {
    
    const url = environment.baseUrl + '/email/connect-mentor';
       
    const uploadData = new FormData();
    uploadData.append('mentorEmail', mentorEmail);
    uploadData.append('email', email);

    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post<any>(url, uploadData,
          {headers: {Authorization: 'Bearer ' + token}}
        )
      }),
      map(data => {      
           
          return data.message;
    }));       
  }

  onUpdateWinner(userId: string) {
    const url = environment.baseUrl + '/essential/update-result';
       
    const uploadData = new FormData();
    uploadData.append('userId', userId);

    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post<any>(url, uploadData,
          {headers: {Authorization: 'Bearer ' + token}}
        )
      }),
      map(data => {     
          let totalArray = [];
          
          for (const key in data) {
            if(data.hasOwnProperty(key)) {
              totalArray.push(
                data.totalItems
              );
            }
          }     
          const results = [];
          for (const key in data.results) {
            if(data.results.hasOwnProperty(key)) {
              results.push(
                new Results(
                  data.results[key]._id,
                  data.results[key].userName,
                  data.results[key].userId,
                  data.results[key].isWinner,                  
                  data.results[key].subject,
                  data.results[key].score,
                  data.results[key].createdAt                                              
                )
              );
            }
          }
          this._resultsTotalItems.next(totalArray);
           
          return results;
        }),
        tap(results => {
          this._results.next(results);
        })     
    );
  }

  getUnreadMessages(
    messageTo: string
  ) {
    
    const url = environment.baseUrl + '/message/get-unread';
    const uploadData = new FormData();
    
    uploadData.append('messageTo', messageTo);
        
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        
        return this.http.post<any>(url, uploadData, 
        {headers: {Authorization: 'Bearer ' + token}}
        )
        .pipe(
          map(data => {
                             
          return data;       
          })
        );
      })
    );
  }

  updateReadMessages(  
    page,  
    messageFrom: string,
    messageTo: string
  ) {
    
    const url = environment.baseUrl + '/message/read-update';
    const uploadData = new FormData();
    uploadData.append('pageNumber', page);
    uploadData.append('messageFrom', messageFrom);
    uploadData.append('messageTo', messageTo);
        
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        
        return this.http.post<any>(url, uploadData, 
        {headers: {Authorization: 'Bearer ' + token}}
        )
        .pipe(
          map(data => {
                        
           const returnedMessages = [];
          for (const key in data.messages) {
            if(data.messages.hasOwnProperty(key)) {
              returnedMessages.push(
                new Message(
                  data.messages[key]._id,
                  data.messages[key].messageFrom,
                  data.messages[key].messageTo,
                  data.messages[key].messageDetails,
                  data.messages[key].messageImage,
                  data.messages[key].messageRead,
                  new Date(data.messages[key].messageTime).toString()
                )
              );
            }
          }          
          return returnedMessages.reverse();       
          })
        );
      })
    );
  }

  addComment(
    id: string,    
    commentDetails: string, 
    type: string,
    date: string 
  ) {
    
    const urlBlog = environment.baseUrl + '/blog/comment/' + id;
    const urlQuestion = environment.baseUrl + '/question/comment/' + id;
    const url = (type != 'question') ? urlBlog : urlQuestion;
            
    const uploadData = new FormData();    
           
    uploadData.append('commentDetails', commentDetails);
    uploadData.append('type', type);
    uploadData.append('date', date);       
    
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        
        return this.http.put<any>(url, uploadData, 
        {headers: {Authorization: 'Bearer ' + token}}
        )
        .pipe(
          map(data => {
           
            return data;
          })
        );
      })
    );
  }  


  addBlog(
    id: string,
    blogTitle: string,
    blogDetails: string,
    blogImage: string,
    blogFirstName: string,
    blogLastName: string,
    blogDate: string,
    blogLikes: string,
    blogComments: Blogcomments[],
    blogNumberOfComments: string,
    youtubeLinkString: string
  ) {
    
    const urlAdd = environment.baseUrl + '/blog/add';
    const urlEdit = environment.baseUrl + '/blog/update/' + id;
    const url = (id != null) ? urlEdit : urlAdd;
    console.log(youtubeLinkString);
    const uploadData = new FormData();
    uploadData.append('blogTitle', blogTitle);
    uploadData.append('blogDetails', blogDetails);
    uploadData.append('blogImage', blogImage);       
    uploadData.append('blogLikes', blogLikes);    
    uploadData.append('blogNumberOfComments', blogNumberOfComments);
    uploadData.append('youtubeLinkString', youtubeLinkString);
    
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        
        return this.http.post<Blog>(url, uploadData, 
        {headers: {Authorization: 'Bearer ' + token}}
        )
        .pipe(
          map(data => {
            
            return data;
          })
        );
      })
    );
  }  

  addQuestion(
    questionUserName: string,
    questionTitle: string,
    questionDetails: string,
    questionTime: Date,
    questionReplies: Blogcomments[]
  ) {
    
    const url = environment.baseUrl + '/question/add';

    const uploadData = new FormData();
    uploadData.append('questionTitle', questionTitle);
    uploadData.append('questionDetails', questionDetails);
    
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post<Questions>(url, uploadData, 
            {headers: {Authorization: 'Bearer ' + token}}
            )
        .pipe(
          map(data => {
            
            return data;
          })
        );
      })
    ); 
  }

  addEvent(
    id: string,
    eventName: string,
    eventDetails: string,
    eventLocation: string,
    eventDate: string,
    eventImage: string
  ) {

    const urlAdd = environment.baseUrl + '/event/add';
    const urlEdit = environment.baseUrl + '/event/update/' + id;
    const url = (id != null) ? urlEdit : urlAdd;

    const uploadData = new FormData();
    uploadData.append('eventName', eventName);
    uploadData.append('eventDetails', eventDetails);
    uploadData.append('eventLocation', eventLocation);
    uploadData.append('eventDate', eventDate);
    uploadData.append('eventImage', eventImage);

    
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post<Event>(url, uploadData, 
                {headers: {Authorization: 'Bearer ' + token}}
                )
        .pipe(
          map(data => {
            
            return data;
          })
        ); 
      })
    )
  }

  addStory(
    id: string,
    storyTitle: string,
    storyDetail: string,
    storyImage: string,
    userName: string,
    postedOn: string,
    storyLikes: string,
    youtubeLinkString: string
  ) {

    const uploadData = new FormData();
    uploadData.append('storyTitle', storyTitle);
    uploadData.append('storyDetails', storyDetail);
    uploadData.append('storyImage', storyImage);
    uploadData.append('postedOn', postedOn);
    uploadData.append('storyLikes', storyLikes);
    uploadData.append('youtubeLinkString', youtubeLinkString);
        
    const urlAdd = environment.baseUrl + '/story/add';
    const urlEdit = environment.baseUrl + '/story/update/' + id;
    const url = (id != null) ? urlEdit : urlAdd;

    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post<Story>(url, uploadData, 
                {headers: {Authorization: 'Bearer ' + token}}
                )
        .pipe(
          map(data => {
            
            return data;
          })
        ); 
      })
    );
  }
  
  addMentor(
    id: string,
    mentorUserName: string,
    mentorProfile: string,
    mentorField: string,
    mentorImage: string,
    mentorEmail: string,
    mentorLinkedIn: string
  ) {

    const uploadData = new FormData();
    uploadData.append('mentorUserName', mentorUserName);
    uploadData.append('mentorProfile', mentorProfile);
    uploadData.append('mentorField', mentorField);
    uploadData.append('mentorImage', mentorImage);
    uploadData.append('mentorEmail', mentorEmail);
    uploadData.append('mentorLinkedIn', mentorLinkedIn);

    
    const urlAdd = environment.baseUrl + '/mentor/add';
    const urlEdit = environment.baseUrl + '/mentor/update/' + id;
    const url = (id != null) ? urlEdit : urlAdd;

    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post<Mentor>(url, uploadData, 
                  {headers: {Authorization: 'Bearer ' + token}}
                  )
        .pipe(
          map(data => {
            
            return data;
          })
        ); 
      })
    );
  }

  addEssential(
    id: string,
    essentialsDetails: string,
    essentialsImage: string,
    essentialsTime: string
  ) {

    const uploadData = new FormData();
    uploadData.append('essentialDetails', essentialsDetails);
    uploadData.append('essentialsImage', essentialsImage);
    uploadData.append('essentialsTime', essentialsTime);
    
    const urlAdd = environment.baseUrl + '/essential/add';
    const urlEdit = environment.baseUrl + '/essential/update/' + id;
    const url = (id != null) ? urlEdit : urlAdd;

    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post<Essentials>(url, uploadData, 
                    {headers: {Authorization: 'Bearer ' + token}}
                    )
        .pipe(
          map(data => {
            
            return data;
          })
        ); 
      })
    );
  }

  addLocal(
    id: string,
    localName: string,
    localType: string,
    localAddress: string,
    localImage: string,
    localContact: string,
    localRating: string
  ) {

    const uploadData = new FormData();
    uploadData.append('localName', localName);
    uploadData.append('localType', localType);
    uploadData.append('localAddress', localAddress);
    uploadData.append('localImage', localImage);
    uploadData.append('localContact', localContact);
    uploadData.append('localRating', localRating);
    
    const urlAdd = environment.baseUrl + '/local/add';
    const urlEdit = environment.baseUrl + '/local/update/' + id;
    const url = (id != null) ? urlEdit : urlAdd;

    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post<Local>(url, uploadData, 
                      {headers: {Authorization: 'Bearer ' + token}}
                      )
        .pipe(
          map(data => {
            
            return data;
          })
        ); 
      })
    );
  }

  deleteItem(
    id: string,
    type: string
  ) {

    
    switch(type) {
      case 'local':
          this.urlPath = environment.baseUrl + '/local/delete/' + id;
        break;
      case 'story':
          this.urlPath = environment.baseUrl + '/story/delete/' + id;
        break;
      case 'blog':
          this.urlPath = environment.baseUrl + '/blog/delete/' + id;
        break;
      case 'question':
          this.urlPath = environment.baseUrl + '/question/delete/' + id;
        break;
      case 'mentor':
          this.urlPath = environment.baseUrl + '/mentor/delete/' + id;
        break;
      case 'event':
          this.urlPath = environment.baseUrl + '/event/delete/' + id;
        break;
      case 'essential':
          this.urlPath = environment.baseUrl + '/essential/delete/' + id;
        break;
      default:
        
    }
    
    const uploadData = new FormData();
    uploadData.append('id', id);
    uploadData.append('type', type);
    
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        
        return this.http.post<any>(this.urlPath, uploadData,
                      {headers: {Authorization: 'Bearer ' + token}}
                      )
        .pipe(
          map(data => {
            
            return data;
          })
        ); 
      })
    );

  }

  deleteQuiz(    
    subject: string
  ) {
    
    const uploadData = new FormData();
    uploadData.append('subject', subject);
    const url = environment.baseUrl + '/essential/delete-quiz';
        
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        
        return this.http.post<any>(url, uploadData,
                {headers: {Authorization: 'Bearer ' + token}}
                )
        .pipe(
          map(data => {
            
            return data;
          })
        ); 
      })
    );

  }


  sendEmail(
    senderName: string,
    senderEmail: string,
    messageDetail: string
  ) {
    const uploadData = new FormData();
    uploadData.append('senderName', senderName);
    uploadData.append('senderEmail', senderEmail);
    uploadData.append('messageDetail', messageDetail);

    const url = environment.baseUrl + '/email/send';

    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        
        return this.http.post<any>(url, uploadData,
                      {headers: {Authorization: 'Bearer ' + token}}
                      )
        .pipe(
          map(data => {
            
            return data;
          })
        ); 
      })
    );
  }

  submitQuizAnswers(quizAnswers: any) {
    const uploadData = quizAnswers;

    const url = environment.baseUrl + '/essential/quiz-submit';
    
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post<any>(url, uploadData, 
              {headers: {Authorization: 'Bearer ' + token}}
              )
        .pipe(
          map(data => {
            
            return data;
          })
        ); 
      })
    );
  }

  addQuiz(
    subject: string,
    theImage: string,
    questionDetail: string,
    questionAnswer: string
  ) {

    const uploadData = new FormData();
    uploadData.append('subject', subject);
    uploadData.append('theImage', theImage);
    uploadData.append('questionDetail', questionDetail);
    uploadData.append('questionAnswer', questionAnswer);
    
    const url = environment.baseUrl + '/essential/quiz';
    
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post<QuizQuestion>(url, uploadData, 
                    {headers: {Authorization: 'Bearer ' + token}}
                    )
        .pipe(
          map(data => {
            
            return data;
          })
        ); 
      })
    );
  }


  updateRating(
    id: string,    
    localRating: string,    
  ) {
    
    const url = environment.baseUrl + '/local/rating/' + id;
    
    
    const uploadData = new FormData();    
           
    uploadData.append('localRating', localRating);        
   
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        
        return this.http.put<Local>(url, uploadData, 
        {headers: {Authorization: 'Bearer ' + token}}
        )
        .pipe(
          map(data => {
           
            return data;
          })
        );
      })
    );
  }  

}

