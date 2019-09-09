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
   

  private _essentials = new BehaviorSubject<Essentials[]>([
    new Essentials(
      '1',
      'U.S. President Donald Trump and Canadian Prime Minister Justin Trudeau discussed the Hong Kong protests and the ongoing detention of two Canadians by the Chinese government, a statement from Trudeau\'s office said on Friday.',
      'https://www.todayifoundout.com/wp-content/uploads/2013/06/canada.jpg',
      new Date('2019-11-22 11:30:00')
    ),

    new Essentials(
      '2',
      'Congress should move quickly with an $8 billion sale of F-16 fighter jets to Taiwan as the self-ruled island faces pressure from China\'s increased military presence in the region, leading U.S. Democratic and Republican lawmakers said on Friday.',
      'http://media.defense.gov/2006/Jun/20/2000551993/-1/-1/0/060614-F-8260H-302.JPG',
      new Date('2019-12-22 08:30:20')
    ),

    new Essentials(
      '3',
      'Cathay CEO resigns amid Hong Kong protest blowback as more rallies planned',
      'http://www.trbimg.com/img-5863c41d/turbine/ct-boeing-777-assembly-line-20161228',
      new Date('2019-11-25 11:32:00')
    ),
  ]);

  private _locals = new BehaviorSubject<Local[]>([
    new Local(
      '1',
      'Iya Basira',
      'Restaurant',
      '248 Sunderland Road, Gateshead, NE4 8BU',
      'https://c8.alamy.com/comp/C9CG2D/sarastro-turkish-restaurant-in-the-west-end-london-england-uk-C9CG2D.jpg',
      'iyabasira@gmail.com',
      4
    ),

    new Local(
      '2',
      'Tony Basira',
      'Restaurant',
      '248 Montagu Road, Gateshead, NE4 8BU',
      'http://www.justopenedlondon.com/wp-content/uploads/2016/11/jamavar3.jpg',
      'tonybasira@gmail.com',
      3
    ),

    new Local(
      '3',
      'Sushi Place',
      'Buffet Place',
      '3 Grey Street, Newcastle NE1 8BU',
      'http://1.bp.blogspot.com/-3ua2heDYF6w/UPFtmmDwMEI/AAAAAAAAIaU/kCUmMVswjK8/s1600/San+Carlo+Cicchetti+London+Restaurant+(3).JPG',
      'sushi@gmail.com',
      5
    ),

    new Local(
      '4',
      'Sushi Place',
      'Buffet Place',
      '3 Grey Street, Newcastle NE1 8BU',
      'https://media-cdn.tripadvisor.com/media/photo-s/0e/90/52/0e/baglioni-hotel-london.jpg',
      'sushi@gmail.com',
      5
    )
  ]);

  private _mentors = new BehaviorSubject<Mentor[]>([
    new Mentor(
      '1',
      'Daniel Kolenda',
      'Graduated from Harvard Business School. Has multiple drgrees in sciences',
      'Data Science',
      'https://static.politico.com/03/23/c600c1a94f93905559db9704e486/180925-donald-trump-gty-773.jpg',
      'danokoli@gmail.com'
    ),

    new Mentor(
      '2',
      'Wendy Kolenda',
      'Graduated from Oxford Business School. Has multiple drgrees in sciences',
      'Business Science',
      'https://static.independent.co.uk/s3fs-public/thumbnails/image/2015/10/03/10/Katie-Hopkins-v2.jpg',
      'wendyokoli@gmail.com'
    ),

    new Mentor(
      '3',
      'Mary Kolenda',
      'Graduated from Yale Business School. Has multiple drgrees in sciences',
      'Business Science',
      'https://ih1.redbubble.net/image.508126609.3627/flat,1000x1000,075,f.u2.jpg',
      'indyokoli@gmail.com'
    ),

    new Mentor(
      '4',
      'John Kolenda',
      'Graduated from Hebrew University School. Has multiple drgrees in sciences',
      'Social Science',
      'https://pixel.nymag.com/imgs/daily/intelligencer/2019/04/12/12-candace-owens.w700.h700.jpg',
      'midyokoli@gmail.com'
    ),
  ]);

  private _questions = new BehaviorSubject<Questions[]>([
    new Questions(
      '1',
      'Patrick',
      'What are your policies?',
      'It\'s good to know what your policies are and the contingencies in case',
      new Date('2019-09-20 10:21:09'),
      [
        new Blogcomments(
          '1',
          'Rosaline',
          'This is the other first comment. Good one man!',
          new Date('2019-11-20 11:00:00')
        ),  
        new Blogcomments(
          '2',
          'Nelly',
          'This is the second other comment. Good too man!',
          new Date('2019-11-22 11:30:00')
        ),        
      ]
    ),

    new Questions(
      '2',
      'Peter',
      'What are your new policies?',
      'It\'s good to know what your policies are and the contingencies in case',
      new Date('2019-10-20 09:23:09'),
      [
        new Blogcomments(
          '1',
          'Rosaline',
          'Thanks for first comment. Good one man!',
          new Date('2019-11-20 11:00:00')
        ),  
        new Blogcomments(
          '2',
          'Nelly',
          'This is the second other comment. Good too man!',
          new Date('2019-11-22 11:30:00')
        ),        
      ]
    ),

    new Questions(
      '3',
      'Max',
      'What are your plans for the year?',
      'It\'s also very nice to know what your policies are and the contingencies in case',
      new Date('2019-12-23 09:43:03'),
      [
        new Blogcomments(
          '1',
          'Rosaline',
          'This is the other first comment. Good one man!',
          new Date('2019-11-20 11:00:00')
        ),  
        new Blogcomments(
          '2',
          'Nelly',
          'This is the second other comment. Good too man!',
          new Date('2019-11-22 11:30:00')
        ),        
      ]
    )
  ]);

  private _blogs = new BehaviorSubject<Blog[]>([
    new Blog(
      '1',
      'Examples of Entreprenurship Blogs',
      'A very well designed and slick blog that’s all about being your own boss and creating your own wealth. It’s a blog with a very active podcast feed. Their podcasts are insanely popular on itunes, and no doubt they make a fair bit of money from selling ad space on those podcasts. Podcasts is something to think about when creating your blog as it could be a great monetization tool.',
      'https://www.abcn.com/images/photos/1016_KierlandOffice.jpg',
      'John',
      'Paul',
      new Date('2019-09-20 10:21:09'),
      235,
      [
        new Blogcomments(
        '1',
        'Rosaline',
        'This is the first comment. Good one man!',
        new Date('2019-11-20 11:00:00')
      ),  
        new Blogcomments(
          '2',
          'Nelly',
          'This is the second comment. Good too man!',
          new Date('2019-11-22 11:30:00')
        ),        
      ] ,  
      7          
    ),

    new Blog(
      '2',
      'More of Entreprenurship Blogs',
      'A very well designed and slick blog that’s all about being your own boss and creating your own wealth. It’s a blog with a very active podcast feed. Their podcasts are insanely popular on itunes, and no doubt they make a fair bit of money from selling ad space on those podcasts. Podcasts is something to think about when creating your blog as it could be a great monetization tool.',
      'http://www.gulfhotelsgroup.com/images/projects/executive_offices/executive_offices3.jpg',
      'John',
      'Paul',
      new Date('2019-09-20 11:03:00'),
      285,
      [
        new Blogcomments(
        '1',
        'Rosaline',
        'This is the other first comment. Good one man!',
        new Date('2019-11-20 11:00:00')
      ),  
        new Blogcomments(
          '2',
          'Nelly',
          'This is the second other comment. Good too man!',
          new Date('2019-11-22 11:30:00')
        ),        
      ] ,  
      7          
    )
  ]);

  private _about: About;

  private _events = new BehaviorSubject<Event[]>([
    new Event(
      '1',
      'Northumbria Graduation',
      'The graduation ceremony for Northumbria University Students graduation',
      'Students\' Hall, Northumbria Uni, NE1 2SU, Newcastle',
      new Date('2019-09-20 11:00:00'),
      'http://c7.alamy.com/comp/EFCECX/northumbria-university-sign-or-logo-newcastle-upon-tyne-england-uk-EFCECX.jpg'
    ),

    new Event(
      '2',
      'Newcastle Graduation',
      'The graduation ceremony for Newcastle University Students graduation',
      'Students\' Hall, Newcastle Uni, NE1 2SU, Newcastle',
      new Date('2019-09-20 11:00:00'),
      'http://www.nawe.co.uk/Private/30343/Live/image/Leeds-Trinity-University-College-logo-500px.png'
    ),

    new Event(
      '3',
      'Leeds Graduation',
      'The graduation ceremony for Leeds University Students graduation',
      'Students\' Hall, Leeds Uni, LS1 2SU, Newcastle',
      new Date('2019-09-20 11:00:00'),
      'http://www.leedsbeckett.ac.uk/assets/studentcharter/media/logo-hr.jpg'
    ),
  ]);

  private _stories = new BehaviorSubject<Story[]>([
    new Story(
      '1',
      'The History of Newcastle',
      'This is a city founded in the medieval times.',
      'http://hbu.h-cdn.co/assets/15/24/1433972013-faerie-cottage-index.jpg',
      'Michael Flynn',
      new Date('2010-10-29 04:40:23'),
      25
    ),

    new Story(
      '2',
      'The History of Hull',
      'This is a city founded in the middle ages times.',
      'https://i.ytimg.com/vi/rruJNmg7uBg/maxresdefault.jpg',
      'Jesicca Anna',
      new Date('2019-01-11 02:40:23'),
      13
    ),

    new Story(
      '3',
      'The History of Leeds',
      'This is a city founded before the Romans.',
      'http://hbu.h-cdn.co/assets/15/24/1433972013-faerie-cottage-index.jpg',
      'Mandela Madiba',
      new Date('2019-06-10 15:25:23'),
      11
    )

  ]);

  get stories() {
    return this._stories.asObservable();
  }

  get events() {
    return this._events.asObservable();
  }

  get about() {
    return new About(
      '1',
      'This is an organization founded on the need to help people find their way in the murky waters of UK JJC',
      'https://image.slidesharecdn.com/lovemarlainainnovation-160411232029/95/innovation-and-information-technology-it-1-638.jpg?cb=1460417773'      
    )
  }

  get blogs() {
    return this._blogs.asObservable();
  }

  get questions() {
    return this._questions.asObservable();
  }

  get mentors() {
    return this._mentors.asObservable();
  }

  get locals() {
    return this._locals.asObservable();
  }

  get essentials() {
    return this._essentials.asObservable();
  }
  constructor(private http: HttpClient, private authService: AuthService) { }

  fetchStories() {
    
  }

  getBlog(id: string) {    
    return this.blogs.pipe(
      take(1),
      map(blogs => {
        return { ...blogs.find(b => b.id === id)};
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
        return this.http.put<{imageUrl: string, imagePath: string}>(URL, uploadData, 
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
            console.log(data);     
            return data;
          })
        );
      })
    );
  }

  addBlog(
    blogTitle: string,
    blogDetails: string,
    blogImage: string,
    blogFirstName: string,
    blogLastName: string,
    blogDate: Date,
    blogLikes: number,
    blogComments: Blogcomments[],
    blogNumberOfComments: number
  ) {
    let newBlog: Blog;

    newBlog = new Blog(
      Math.random().toString(),
      blogTitle, 
      blogDetails,
      blogImage,
      blogFirstName,
      blogLastName,
      blogDate,
      blogLikes,
      blogComments,
      blogNumberOfComments
    );      
    
    const url = environment.baseUrl + '/blog-add';

    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post<Blog>(url, { ...newBlog, id: null }, {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
          })
        })
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

    let newQuestion: Questions;

    newQuestion = new Questions(
      Math.random().toString(),
      questionUserName, 
      questionTitle,
      questionDetails,
      questionTime,
      questionReplies     
    );     

    const url = environment.baseUrl + '/question-add';
    return this.http.post<Questions>(url, { ...newQuestion, id: null }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
    .pipe(
      map(data => {
        console.log(data);
        return data;
      })
    ); 
  }

  addEvent(
    eventName: string,
    eventDetails: string,
    eventLocation: string,
    eventDate: Date,
    eventImage: string
  ) {

    let newEvent: Event;

    newEvent = new Event(
      Math.random().toString(),
      eventName, 
      eventDetails,
      eventLocation,
      eventDate,
      eventImage     
    );     

    const url = environment.baseUrl + '/event-add';
    return this.http.post<Event>(url, { ...newEvent, id: null }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
    .pipe(
      map(data => {
        console.log(data);
        return data;
      })
    ); 
  }

  addStory(
    storyTitle: string,
    storyDetail: string,
    storyImage: string,
    userName: string,
    postedOn: Date,
    storyLikes: number
  ) {

    let newStory: Story;

    newStory = new Story(
      Math.random().toString(),
      storyTitle, 
      storyDetail,
      storyImage,
      userName,
      postedOn,
      storyLikes     
    );     
        
    const url = environment.baseUrl + '/story-add';
    return this.http.post<Story>(url, { ...newStory, id: null }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
    .pipe(
      map(data => {
        console.log(data);
        return data;
      })
    ); 
  }
  
  addMentor(
    mentorUserName: string,
    mentorProfile: string,
    mentorField: string,
    mentorImage: string,
    mentorEmail: string
  ) {

    let newMentor: Mentor;

    newMentor = new Mentor(
      Math.random().toString(),
      mentorUserName, 
      mentorProfile,
      mentorField,
      mentorImage,
      mentorEmail   
    );     

    const url = environment.baseUrl + '/mentor-add';
    return this.http.post<Mentor>(url, { ...newMentor, id: null }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
    .pipe(
      map(data => {
        console.log(data);
        return data;
      })
    ); 
  }

  addEssential(
    essentialsDetails: string,
    essentialsImage: string,
    essentialsTime: Date
  ) {

    let newEssential: Essentials;

    newEssential = new Essentials(
      Math.random().toString(),
      essentialsDetails, 
      essentialsImage,
      essentialsTime
    );     

    const url = environment.baseUrl + '/essential-add';
    return this.http.post<Essentials>(url, { ...newEssential, id: null }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
    .pipe(
      map(data => {
        console.log(data);
        return data;
      })
    ); 
  }

  addLocal(
    localName: string,
    localType: string,
    localAddress: string,
    localImage: string,
    localContact: string,
    localRating: number
  ) {

    let newLocal: Local;

    newLocal = new Local(
      Math.random().toString(),
      localName, 
      localType,
      localAddress,
      localImage,
      localContact,
      localRating
    );     

    const url = environment.baseUrl + '/local-add';
    return this.http.post<Local>(url, { ...newLocal, id: null }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
    .pipe(
      map(data => {
        console.log(data);
        return data;
      })
    ); 
  }
}
