import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export interface AuthResponseData {
  
  email: string;
  password: string;
  
}

@Injectable({
  providedIn: 'root'
})


export class AuthService {
  private _userIsAuthenticated = true;

  get userIsAuthenticated() {
    return this._userIsAuthenticated;
  }
  
  constructor(private http: HttpClient) { }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(`http://localhost:8080/auth`, { email: email, password: password }
    )
    .pipe(tap());
  }

  // login(email: string, password: string) {
  //   this.http.post('http://localhost:8080/auth',
  //   { email: email, password: password }
  //   );
  //   console.log(email);
  //   // this._userIsAuthenticated = true;
  // }

  logout() {
    this._userIsAuthenticated = false;
  }
}
