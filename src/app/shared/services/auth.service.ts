import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

 
  private token: string;
  constructor(private http: HttpClient, private router: Router) { }
  private saveToken(token: string) {
    localStorage.setItem('ACCESS_TOKEN', token);
    this.token = token;
  }

  private getToken() {
    if (!this.token) {
      return localStorage.getItem('ACCESS_TOKEN');
    }
    return this.token;
  }

  logOut() {
    this.token = '';
    localStorage.removeItem('ACCESS_TOKEN');
   // this.router.navigateByUrl('/auth/login');
  }

  getUserInfo() {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      return JSON.parse(window.atob(payload));
    } else {
      return null;
    }
  }

  isLogged() {
    const user = this.getUserInfo();
    return user ? user.exp > Date.now() / 1000 : false;
  }

  private request(user) {
    const headers = new HttpHeaders({ accept: 'application/json', 'Content-Type': 'application/json', });
    return this.http.post(environment.APIURI + 'auth/login', user, { headers }).pipe(map((res: any) => {
      if (res.auth) {
        const token = JSON.parse(window.atob(res.auth.split('.')[1])); 
          this.saveToken(res.auth);  
      }
      return res;
    }));
  }

  returnToken() {
    return this.isLogged ? this.getToken() : null;
  }

  login(user) {
    return this.request(user);
  }
}
