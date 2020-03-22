import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, catchError, map, take, switchMap } from 'rxjs/operators';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { Plugins } from '@capacitor/core';
import { environment } from 'src/environments/environment';
import { User } from './user.model';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

export interface AuthResponseData {  
  userId: string;
  firstname: string;
  lastname: string;
  status: number;
  token: string;
  totalUsers: number;
  details: string;
  email: string;
  profilePic: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private activeLogoutTimer: any;
  private _user = new BehaviorSubject<User>(null);

  get user() {
    return this._user.asObservable();
  }
  
  get userAuthenticated() {
    return this._user.asObservable().pipe(
      map(user => {
        if(user) {
          return !!user.token;
        } else {
          return false;
        }
      })
    );
  }

  get userName() {
    return this._user.asObservable().pipe(
      map(user => {
        if(user) {
          return user.firstname + ' ' + user.lastname;
        } else {
          return null;
        }
      })
    );
  }

  get userId() {
    return this._user.asObservable().pipe(
      map(user => {
        if(user) {
          return user.id;
        } else {
          return null;
        }
      })
    );
  }

  get userEmail() {
    return this._user.asObservable().pipe(
      map(user => {
        if(user) {
          return user.email;
        } else {
          return null;
        }
      })
    );
  }

  get userStatus() {
    return this._user.asObservable().pipe(
      map(user => {
        if(user) {
          return user.status;
        } else {
          return null;
        }
      })
    );
  }

  get totalUsers() {
    return this._user.asObservable().pipe(
      map(user => {
        if(user) {
          return user.totalUsers;
        } else {
          return null;
        }
      })
    );
  }

  get token() {
    return this._user.asObservable().pipe(
      map(user => {
        if(user) {
          return user.token;
        } else {
          return null;
        }
      })
    );
  }
  
  constructor(private http: HttpClient, 
  private alertCtrl: AlertController,
  private router: Router
  ) { }

  //Perform auto login function
  autoLogin() {    
    return from(Plugins.Storage.get({key: 'authData'})).pipe(
      map(storedData => {
        if(!storedData || !storedData.value) {
          return null;
        }
        const parsedData = JSON.parse(storedData.value) as {
          userId: string,
          firstname: string,
          lastname: string,
          status: number,
          token: string,
          totalUsers: number,
          details: string,
          email: string,
          profilePic: string,
          tokenExpirationDate: string
        };

      
        const expirationTimeDuration = new Date(parsedData.tokenExpirationDate).getTime()  + (60 * 120 * 1000);
        if(expirationTimeDuration <= new Date().getTime()) {
          
          return null;
        }
        
        const user = new User(
          parsedData.userId,
          parsedData.firstname,
          parsedData.lastname,
          parsedData.status,
          parsedData.token,
          parsedData.totalUsers,
          parsedData.details,
          parsedData.email,
          parsedData.profilePic,
          new Date(expirationTimeDuration)
        );
        return user;
      }),
      tap(user => {
        if(user) {
         
          this._user.next(user);
          this.autoLogout(user.tokenDuration);
          return user;
        }
      }),
      map(user => {
        return !!user;
      })
    );
  }
  
  //Perform login request
  login(email: string, password: string){
    let oldUser = { email: email, password: password };
    const url = environment.baseUrl + '/auth/login';
    return this.http.post<AuthResponseData>(url, JSON.stringify(oldUser), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
    .pipe(tap(this.setUserData.bind(this)));
  }

  //Update userprofile function
  updateProfile(userId: string, password: string, details: string, profilePic: string) {
    
    const url = environment.baseUrl + '/auth/update-profile';
    const uploadData = new FormData();
    uploadData.append('userId', userId);
    uploadData.append('password', password);
    uploadData.append('details', details);
    uploadData.append('profilePic', profilePic);

    return this.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post<AuthResponseData>(url, uploadData,
          {headers: {Authorization: 'Bearer ' + token}}
        )
        .pipe(tap(this.setUserData.bind(this)));
      })
    );
  }
  
  //Prepare user data for storage
  private setUserData(userData: AuthResponseData) {
    const remainingMilliseconds = 60 * 60 * 2 * 1000;
    const expirationTime = new Date(
      new Date().getTime() + remainingMilliseconds
    );

    const user = new User(
      userData.userId,
      userData.firstname,
      userData.lastname,
      userData.status,
      userData.token,
      userData.totalUsers,
      userData.details,
      userData.email,
      userData.profilePic,
      expirationTime
    );
    
    this._user.next(user);
    this.autoLogout(user.tokenDuration);
    this.storeAuthData(
      userData.userId,
      userData.firstname,
      userData.lastname,
      userData.status,
      userData.token,
      userData.totalUsers,
      userData.details,
      userData.email,
      userData.profilePic,
      expirationTime.toISOString()
    );
  }

  //Store auth data in device storage
  private storeAuthData(
    userId: string,
    firstname: string,
    lastname: string,
    status: number,
    token: string,
    totalUsers: number,
    details: string,
    email: string,
    profilePic: string,
    tokenExpirationDate: string
  ) {
    const data = JSON.stringify({
      userId: userId,
      firstname: firstname,
      lastname: lastname,
      status: status,
      token: token,
      totalUsers: totalUsers,
      details: details,
      email: email,
      profilePic: profilePic,
      tokenExpirationDate: tokenExpirationDate
    });

    Plugins.Storage.set({
      key: 'authData',
      value: data
    });
  }

  //Send signup request
  signup(firstname: string, lastname: string, email: string, password: string){
    let newUser = {firstname: firstname, lastname: lastname, email: email, password: password };
    const url = environment.baseUrl + '/auth/signup';
    
    return this.http.post<AuthResponseData>(url, JSON.stringify(newUser), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
    .pipe(tap(resData => {
      return resData;
    }));
  }

  //Autologout function
  private autoLogout(duration: number) {
    if(this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  //Perform logout action
  logout() {
    if(this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }    
    Plugins.Storage.remove({ key: 'authData' });
    this._user.next(null);
    this.router.navigateByUrl('/home');
  }

  ngOnDestroy() {
    if(this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  }

}