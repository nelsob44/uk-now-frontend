import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, catchError, map } from 'rxjs/operators';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { Plugins } from '@capacitor/core';
import { environment } from 'src/environments/environment';
import { User } from './user.model';
import { AlertController } from '@ionic/angular';

export interface AuthResponseData {  
  userId: string;
  firstname: string;
  lastname: string;
  status: number;
  token: string;
}

@Injectable({
  providedIn: 'root'
})


export class AuthService {
  
  private _user = new BehaviorSubject<User>(null);
  
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
  
  constructor(private http: HttpClient, private alertCtrl: AlertController) { }

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
          tokenExpirationDate: string
        };

      
        const expirationTimeDuration = new Date(parsedData.tokenExpirationDate).getTime()  + (60 * 30 * 1000);
        if(expirationTimeDuration <= new Date().getTime()) {
          console.log('timecheck null');
          return null;
        }
        console.log('timecheck is not null');
        const user = new User(
          parsedData.userId,
          parsedData.firstname,
          parsedData.lastname,
          parsedData.status,
          parsedData.token,
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

  private setUserData(userData: AuthResponseData) {
    const remainingMilliseconds = 60 * 30 * 1000;
    const expirationTime = new Date(
      new Date().getTime() + remainingMilliseconds
    );

    const user = new User(
      userData.userId,
      userData.firstname,
      userData.lastname,
      userData.status,
      userData.token,
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
      expirationTime.toISOString()
    );
  }

  private storeAuthData(
    userId: string,
    firstname: string,
    lastname: string,
    status: number,
    token: string,
    tokenExpirationDate: string
  ) {
    const data = JSON.stringify({
      userId: userId,
      firstname: firstname,
      lastname: lastname,
      status: status,
      token: token,
      tokenExpirationDate: tokenExpirationDate
    });

    Plugins.Storage.set({
      key: 'authData',
      value: data
    });
  }

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

  private autoLogout(duration: number) {    
    setTimeout(() => {
      this.logout();
    }, duration);
  }

  logout() {
    
    this._user.next(null);
    Plugins.Storage.remove({ key: 'authData' });
  }
}