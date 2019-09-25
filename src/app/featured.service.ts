import { Injectable } from '@angular/core';
import { Story } from './featured/stories/story.model';
import { Event } from './featured/local-events/event.model';
import { About, Essentials } from './about/about.model';
import { AuthService } from 'src/app/auth/auth.service';
import { take, map, tap, delay, switchMap, filter } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { Blog, Blogcomments, Questions, Mentor, Local } from './blog/blog.model';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';


export interface AboutResponseData {  

  aboutDetails: string;
  aboutImage: string;  

}
const URL = environment.baseUrl + '/post-image';

@Injectable({
  providedIn: 'root'
})
export class FeaturedService {
   

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
                    environment.baseUrl + '/' + data[key].aboutImage
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
                  environment.baseUrl + '/' + data.blogs[key].blogImage,
                  data.blogs[key].blogFirstName,
                  data.blogs[key].blogLastName,
                  new Date(data.blogs[key].blogDate),
                  data.blogs[key].blogLikes,
                  data.blogs[key].blogComments,                  
                  data.blogs[key].blogNumberOfComments,
                  data.blogs[key].blogLikers
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
                  environment.baseUrl + '/' + data.events[key].eventImage                  
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
                  environment.baseUrl + '/' + data.stories[key].storyImage,
                  data.stories[key].userName,
                  new Date(data.stories[key].postedOn),
                  data.stories[key].storyLikes,
                  data.stories[key].storyLikers
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
                  environment.baseUrl + '/' + data.mentors[key].mentorImage,
                  data.mentors[key].mentorEmail                  
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
                  environment.baseUrl + '/' + data.essentials[key].essentialsImage,
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
                  environment.baseUrl + '/' + data.locals[key].localImage,
                  data.locals[key].localContact, 
                  data.locals[key].localRating                             
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
        return { ...stories.find(s => s.id === id)};
      })
    );         
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
            console.log(data);           
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
            console.log(data);     
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
    
    // console.log(blogLikes);
    const uploadData = new FormData();
    uploadData.append('blogTitle', blogTitle);
    uploadData.append('blogDetails', blogDetails);
    uploadData.append('blogImage', blogImage);       
    uploadData.append('blogLikes', blogLikes);    
    uploadData.append('blogNumberOfComments', blogNumberOfComments);
    
    console.log(blogLikes);
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        console.log(' here too');
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
    
    // console.log(blogLikes);
    const uploadData = new FormData();    
           
    uploadData.append('blogLikes', blogLikes);    
      
    console.log(blogLikes);
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        console.log(' here too');
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
        console.log(' here too');
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
    blogNumberOfComments: string
  ) {
    
    const urlAdd = environment.baseUrl + '/blog/add';
    const urlEdit = environment.baseUrl + '/blog/update/' + id;
    const url = (id != null) ? urlEdit : urlAdd;
        
    const uploadData = new FormData();
    uploadData.append('blogTitle', blogTitle);
    uploadData.append('blogDetails', blogDetails);
    uploadData.append('blogImage', blogImage);       
    uploadData.append('blogLikes', blogLikes);    
    uploadData.append('blogNumberOfComments', blogNumberOfComments);
    
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        
        return this.http.post<Blog>(url, uploadData, 
        {headers: {Authorization: 'Bearer ' + token}}
        )
        .pipe(
          map(data => {
            console.log(data);
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
            console.log(data);
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
            console.log(data);
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
    storyLikes: string
  ) {

    const uploadData = new FormData();
    uploadData.append('storyTitle', storyTitle);
    uploadData.append('storyDetails', storyDetail);
    uploadData.append('storyImage', storyImage);
    uploadData.append('postedOn', postedOn);
    uploadData.append('storyLikes', storyLikes);
        
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
            console.log(data);
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
    mentorEmail: string
  ) {

    const uploadData = new FormData();
    uploadData.append('mentorUserName', mentorUserName);
    uploadData.append('mentorProfile', mentorProfile);
    uploadData.append('mentorField', mentorField);
    uploadData.append('mentorImage', mentorImage);
    uploadData.append('mentorEmail', mentorEmail);

    
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
            console.log(data);
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
            console.log(data);
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
        console.log(this.urlPath);
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

}
